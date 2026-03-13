import { getPool } from './db'

export type Preparer = {
  id: string
  name: string
  email: string
  currentBalanceCents: number
}

export type BalanceEntryType =
  | 'CREDIT'
  | 'CREDIT_PENDING'
  | 'HOLD'
  | 'RELEASE'
  | 'MANUAL_ADJUSTMENT'
  | 'PENALTY'
  | 'ADJUSTMENT'

export type BalanceEntry = {
  id: string
  occurredAt: string
  type: BalanceEntryType
  description: string
  amountCents: number
  runningBalanceCents: number
}

export async function listPreparers(limit = 200): Promise<Preparer[]> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT id, name, email, current_balance_cents
     FROM tax_preparers
     ORDER BY name
     LIMIT $1`,
    [limit],
  )
  return res.rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    currentBalanceCents: Number(row.current_balance_cents ?? 0),
  }))
}

export async function getPreparer(preparerId: string): Promise<Preparer | null> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT id, name, email, current_balance_cents
     FROM tax_preparers
     WHERE id = $1`,
    [preparerId],
  )
  if (!res.rows[0]) return null
  const row = res.rows[0]
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    currentBalanceCents: Number(row.current_balance_cents ?? 0),
  }
}

export async function listBalanceEntries(
  preparerId: string,
  limit = 20,
): Promise<BalanceEntry[]> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT id, occurred_at, type, description, amount_cents, running_balance_cents
     FROM preparer_balances
     WHERE preparer_id = $1
     ORDER BY occurred_at DESC
     LIMIT $2`,
    [preparerId, limit],
  )
  return res.rows.map((row) => ({
    id: row.id,
    occurredAt: row.occurred_at.toISOString(),
    type: row.type,
    description: row.description,
    amountCents: Number(row.amount_cents),
    runningBalanceCents: Number(row.running_balance_cents),
  }))
}

export type WeeklyPayoutRollup = {
  grossEarningsCents: number
  adjustmentsCents: number
}

export async function getWeeklyPayoutRollup(preparerId: string): Promise<WeeklyPayoutRollup> {
  const pool = getPool()
  const now = new Date()
  const day = now.getUTCDay() // 0 = Sunday, 1 = Monday, ...
  const diffToMonday = (day + 6) % 7
  const startOfWeek = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - diffToMonday),
  )

  const res = await pool.query(
    `
      SELECT type, amount_cents
      FROM preparer_balances
      WHERE preparer_id = $1
        AND occurred_at >= $2
    `,
    [preparerId, startOfWeek],
  )

  let grossEarningsCents = 0
  let adjustmentsCents = 0

  for (const row of res.rows) {
    const rawAmount = Number(row.amount_cents ?? 0)
    if (!Number.isFinite(rawAmount)) continue

    if (row.type === 'CREDIT') {
      if (rawAmount >= 0) {
        grossEarningsCents += rawAmount
      } else {
        adjustmentsCents += rawAmount
      }
    } else {
      adjustmentsCents += rawAmount
    }
  }

  return { grossEarningsCents, adjustmentsCents }
}

/**
 * Add a CREDIT to the preparer's balance. Updates preparer_balances and tax_preparers.current_balance_cents.
 */
export async function addPreparerCredit(
  preparerId: string,
  amountCents: number,
  description: string,
): Promise<void> {
  const pool = getPool()
  const id = crypto.randomUUID()

  const res = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  const row = res.rows[0]
  if (!row) throw new Error('Preparer not found')

  const currentCents = Number(row.current_balance_cents ?? 0)
  const newBalanceCents = currentCents + amountCents

  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, created_at)
    VALUES ($1, $2, NOW(), 'CREDIT', $3, $4, $5, NOW())
  `,
    [id, preparerId, description, amountCents, newBalanceCents],
  )

  await pool.query(
    `UPDATE tax_preparers SET current_balance_cents = $1, updated_at = NOW() WHERE id = $2`,
    [newBalanceCents, preparerId],
  )
}

export type SettlementSummary = {
  pendingEarningsCents: number
  platformHoldCents: number
}

/**
 * Pending = CREDIT_PENDING not released. Platform hold = HOLD not released.
 */
export async function getSettlementSummary(preparerId: string): Promise<SettlementSummary> {
  const pool = getPool()
  const res = await pool.query(
    `
    SELECT type, amount_cents
    FROM preparer_balances
    WHERE preparer_id = $1 AND released_at IS NULL
  `,
    [preparerId],
  )
  let pendingEarningsCents = 0
  let platformHoldCents = 0
  for (const row of res.rows) {
    const amt = Number(row.amount_cents ?? 0)
    if (row.type === 'CREDIT_PENDING') pendingEarningsCents += amt
    if (row.type === 'HOLD') platformHoldCents += amt
  }
  return { pendingEarningsCents, platformHoldCents }
}

/**
 * CREDIT_PENDING: advisor 70%, not yet available. HOLD: platform 30%.
 * Does not update current_balance_cents.
 */
export async function addPreparerCreditPending(
  preparerId: string,
  amountCents: number,
  description: string,
  consultationId: string,
  stripeSessionId: string | null,
): Promise<void> {
  const pool = getPool()
  const id = crypto.randomUUID()
  const res = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  if (!res.rows[0]) throw new Error('Preparer not found')
  const currentCents = Number(res.rows[0].current_balance_cents ?? 0)

  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, consultation_id, stripe_session_id, created_at)
    VALUES ($1, $2, NOW(), 'CREDIT_PENDING', $3, $4, $5, $6, $7, NOW())
  `,
    [id, preparerId, description, amountCents, currentCents, consultationId, stripeSessionId],
  )
}

/**
 * Platform hold (30%). Does not update current_balance_cents.
 */
export async function addPlatformHold(
  preparerId: string,
  amountCents: number,
  description: string,
  consultationId: string,
  stripeSessionId: string | null,
): Promise<void> {
  const pool = getPool()
  const id = crypto.randomUUID()
  const res = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  if (!res.rows[0]) throw new Error('Preparer not found')
  const currentCents = Number(res.rows[0].current_balance_cents ?? 0)

  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, consultation_id, stripe_session_id, created_at)
    VALUES ($1, $2, NOW(), 'HOLD', $3, $4, $5, $6, $7, NOW())
  `,
    [id, preparerId, description, amountCents, currentCents, consultationId, stripeSessionId],
  )
}

/**
 * On Stripe payment confirmation: pending → available, hold resolves.
 *
 * Idempotent under duplicate and concurrent webhook delivery:
 * - Uses a transaction with atomic claim (UPDATE ... RETURNING)
 * - Only rows with released_at IS NULL are claimable; second call gets 0 rows
 * - No mutation of historical amount rows; ledger remains append-only
 */
export async function releaseSettlementForSession(stripeSessionId: string): Promise<void> {
  const pool = getPool()
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // Atomically claim CREDIT_PENDING rows. Only one transaction can claim each row;
    // concurrent calls get 0 rows (released_at no longer NULL).
    const claimedRes = await client.query(
      `UPDATE preparer_balances
       SET released_at = NOW()
       WHERE type = 'CREDIT_PENDING' AND stripe_session_id = $1 AND released_at IS NULL
       RETURNING id, preparer_id, amount_cents`,
      [stripeSessionId],
    )

    const claimedRows = claimedRes.rows

    for (const row of claimedRows) {
      const preparerId = row.preparer_id as string
      const amountCents = Number(row.amount_cents ?? 0)
      if (amountCents <= 0) continue

      const balanceRes = await client.query(
        `UPDATE tax_preparers
         SET current_balance_cents = current_balance_cents + $1, updated_at = NOW()
         WHERE id = $2
         RETURNING current_balance_cents`,
        [amountCents, preparerId],
      )
      if (!balanceRes.rows[0]) continue
      const runningBalanceCents = Number(balanceRes.rows[0].current_balance_cents ?? 0)

      await client.query(
        `
        INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, created_at)
        VALUES ($1, $2, NOW(), 'CREDIT', $3, $4, $5, NOW())
      `,
        [
          crypto.randomUUID(),
          preparerId,
          `Settlement released: ${stripeSessionId}`,
          amountCents,
          runningBalanceCents,
        ],
      )
    }

    // Atomically claim HOLD rows. Same idempotency: second call matches 0 rows.
    await client.query(
      `UPDATE preparer_balances
       SET released_at = NOW()
       WHERE type = 'HOLD' AND stripe_session_id = $1 AND released_at IS NULL`,
      [stripeSessionId],
    )

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export type PendingSettlementEntry = {
  id: string
  preparerId: string
  preparerName: string
  consultationId: string
  stripeSessionId: string | null
  type: 'CREDIT_PENDING' | 'HOLD'
  amountCents: number
  description: string
  occurredAt: string
}

export type ConsultationWithPendingSettlement = {
  consultationId: string
  preparerId: string
  preparerName: string
  pendingEarningsCents: number
  platformHoldCents: number
  entries: PendingSettlementEntry[]
}

/**
 * List consultations that have unreleased CREDIT_PENDING or HOLD entries, grouped by consultation.
 */
export async function listConsultationsWithPendingSettlement(
  limit = 50,
): Promise<ConsultationWithPendingSettlement[]> {
  const entries = await listPendingSettlements(limit * 4) // fetch more to group
  const byConsultation = new Map<string, PendingSettlementEntry[]>()
  for (const e of entries) {
    const cid = e.consultationId || `_orphan_${e.id}`
    if (!byConsultation.has(cid)) byConsultation.set(cid, [])
    byConsultation.get(cid)!.push(e)
  }
  const result: ConsultationWithPendingSettlement[] = []
  for (const [consultationId, consultationEntries] of Array.from(byConsultation.entries())) {
    if (consultationId.startsWith('_orphan_')) continue
    const pending = consultationEntries.filter((e) => e.type === 'CREDIT_PENDING')
    const holds = consultationEntries.filter((e) => e.type === 'HOLD')
    const pendingEarningsCents = pending.reduce((s, e) => s + e.amountCents, 0)
    const platformHoldCents = holds.reduce((s, e) => s + e.amountCents, 0)
    const preparerId = consultationEntries[0]?.preparerId ?? ''
    const preparerName = consultationEntries[0]?.preparerName ?? '—'
    result.push({
      consultationId,
      preparerId,
      preparerName,
      pendingEarningsCents,
      platformHoldCents,
      entries: consultationEntries,
    })
  }
  result.sort((a, b) => {
    const aMax = Math.max(...a.entries.map((e) => new Date(e.occurredAt).getTime()))
    const bMax = Math.max(...b.entries.map((e) => new Date(e.occurredAt).getTime()))
    return bMax - aMax
  })
  return result.slice(0, limit)
}

/**
 * List unreleased CREDIT_PENDING and HOLD entries for admin settlement view.
 */
export async function listPendingSettlements(limit = 100): Promise<PendingSettlementEntry[]> {
  const pool = getPool()
  const res = await pool.query(
    `
    SELECT pb.id, pb.preparer_id, tp.name as preparer_name, pb.consultation_id, pb.stripe_session_id,
           pb.type, pb.amount_cents, pb.description, pb.occurred_at
    FROM preparer_balances pb
    LEFT JOIN tax_preparers tp ON tp.id = pb.preparer_id
    WHERE pb.released_at IS NULL AND pb.type IN ('CREDIT_PENDING', 'HOLD')
    ORDER BY pb.occurred_at DESC
    LIMIT $1
  `,
    [limit],
  )
  return res.rows.map((row) => ({
    id: row.id,
    preparerId: row.preparer_id,
    preparerName: (row.preparer_name as string) ?? '—',
    consultationId: (row.consultation_id as string) ?? '',
    stripeSessionId: (row.stripe_session_id as string) ?? null,
    type: row.type as 'CREDIT_PENDING' | 'HOLD',
    amountCents: Number(row.amount_cents ?? 0),
    description: (row.description as string) ?? '',
    occurredAt: (row.occurred_at as Date).toISOString(),
  }))
}

type ManualActionOptions = {
  performedBy: string
  reason: string
}

/**
 * Manually release a single CREDIT_PENDING entry. Adds CREDIT and RELEASE audit.
 */
export async function manualReleasePending(
  entryId: string,
  options: ManualActionOptions,
): Promise<{ ok: boolean; error?: string }> {
  const performedBy = options.performedBy?.trim()
  if (!performedBy) return { ok: false, error: 'performedBy is required for audit' }

  const pool = getPool()
  const res = await pool.query(
    `SELECT id, preparer_id, amount_cents FROM preparer_balances
     WHERE id = $1 AND type = 'CREDIT_PENDING' AND released_at IS NULL`,
    [entryId],
  )
  const row = res.rows[0]
  if (!row) return { ok: false, error: 'Entry not found or already released' }

  const preparerId = row.preparer_id as string
  const amountCents = Number(row.amount_cents ?? 0)
  if (amountCents <= 0) return { ok: false, error: 'Invalid amount' }

  const balanceRes = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  if (!balanceRes.rows[0]) return { ok: false, error: 'Preparer not found' }

  const currentCents = Number(balanceRes.rows[0].current_balance_cents ?? 0)
  const newBalanceCents = currentCents + amountCents
  const desc = `Manual release: ${options.reason}`
  const auditDesc = `RELEASE (manual): ${options.reason}`

  await pool.query(
    `UPDATE preparer_balances SET released_at = NOW(), performed_by = $1 WHERE id = $2`,
    [performedBy, entryId],
  )
  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, performed_by, created_at)
    VALUES ($1, $2, NOW(), 'CREDIT', $3, $4, $5, $6, NOW())
  `,
    [crypto.randomUUID(), preparerId, desc, amountCents, newBalanceCents, performedBy],
  )
  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, performed_by, created_at)
    VALUES ($1, $2, NOW(), 'RELEASE', $3, 0, $4, $5, NOW())
  `,
    [crypto.randomUUID(), preparerId, auditDesc, newBalanceCents, performedBy],
  )
  await pool.query(
    `UPDATE tax_preparers SET current_balance_cents = $1, updated_at = NOW() WHERE id = $2`,
    [newBalanceCents, preparerId],
  )
  return { ok: true }
}

/**
 * Manually resolve a single HOLD entry. Adds RELEASE audit.
 */
export async function manualResolveHold(
  entryId: string,
  options: ManualActionOptions,
): Promise<{ ok: boolean; error?: string }> {
  const performedBy = options.performedBy?.trim()
  if (!performedBy) return { ok: false, error: 'performedBy is required for audit' }

  const pool = getPool()
  const res = await pool.query(
    `SELECT id, preparer_id, amount_cents, consultation_id FROM preparer_balances
     WHERE id = $1 AND type = 'HOLD' AND released_at IS NULL`,
    [entryId],
  )
  const row = res.rows[0]
  if (!row) return { ok: false, error: 'Entry not found or already resolved' }

  const preparerId = row.preparer_id as string
  const amountCents = Number(row.amount_cents ?? 0)
  const balanceRes = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  const currentCents = balanceRes.rows[0] ? Number(balanceRes.rows[0].current_balance_cents ?? 0) : 0

  const auditDesc = `HOLD resolved (manual): ${options.reason}`

  await pool.query(
    `UPDATE preparer_balances SET released_at = NOW(), performed_by = $1 WHERE id = $2`,
    [performedBy, entryId],
  )
  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, performed_by, created_at)
    VALUES ($1, $2, NOW(), 'RELEASE', $3, 0, $4, $5, NOW())
  `,
    [crypto.randomUUID(), preparerId, auditDesc, currentCents, performedBy],
  )
  return { ok: true }
}

/**
 * Correct an incorrect payout amount. Adds MANUAL_ADJUSTMENT.
 * Amount can be positive (add to balance) or negative (reduce).
 */
export async function correctPayoutAmount(
  preparerId: string,
  amountCents: number,
  options: ManualActionOptions & { consultationId?: string },
): Promise<{ ok: boolean; error?: string }> {
  const performedBy = options.performedBy?.trim()
  if (!performedBy) return { ok: false, error: 'performedBy is required for audit' }

  const pool = getPool()
  const res = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  if (!res.rows[0]) return { ok: false, error: 'Preparer not found' }

  const currentCents = Number(res.rows[0].current_balance_cents ?? 0)
  const newBalanceCents = currentCents + amountCents
  if (newBalanceCents < -4000) return { ok: false, error: 'Balance would fall below -$40 floor' }

  const desc = options.consultationId
    ? `Manual adjustment: ${options.reason} (consultation ${options.consultationId})`
    : `Manual adjustment: ${options.reason}`

  await pool.query(
    `
    INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, consultation_id, performed_by, created_at)
    VALUES ($1, $2, NOW(), 'MANUAL_ADJUSTMENT', $3, $4, $5, $6, $7, NOW())
  `,
    [
      crypto.randomUUID(),
      preparerId,
      desc,
      amountCents,
      newBalanceCents,
      options.consultationId ?? null,
      performedBy,
    ],
  )
  await pool.query(
    `UPDATE tax_preparers SET current_balance_cents = $1, updated_at = NOW() WHERE id = $2`,
    [newBalanceCents, preparerId],
  )
  return { ok: true }
}

/**
 * NOTE: For MVP, insertion and adjustment of preparer_balances should:
 * - Maintain running_balance_cents
 * - Enforce a floor of -4000 cents (i.e., balance cannot go below -$40)
 * - Update tax_preparers.current_balance_cents to match the latest running_balance_cents
 *
 * Advisors do not owe cash out of pocket; negative balances are offset through future work.
 */

