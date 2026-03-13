/**
 * Test helpers for releaseSettlementForSession regression tests.
 * Requires DATABASE_URL. Use a test database to avoid affecting production.
 */

import { getPool } from '../../lib/db'

export type SeedResult = {
  preparerId: string
  sessionId: string
  creditPendingId: string
  holdId: string
}

/**
 * Creates a test preparer and seeds one CREDIT_PENDING and one HOLD row for the given session.
 * Returns IDs for cleanup.
 */
export async function seedPendingSettlement(
  sessionId: string,
  amountCents: number,
  prefix = 'test',
): Promise<SeedResult> {
  const pool = getPool()
  const preparerId = `${prefix}-preparer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const creditPendingId = crypto.randomUUID()
  const holdId = crypto.randomUUID()

  await pool.query(
    `INSERT INTO tax_preparers (id, name, email, current_balance_cents, created_at, updated_at)
     VALUES ($1, $2, $3, 0, NOW(), NOW())
     ON CONFLICT (id) DO NOTHING`,
    [preparerId, `Test ${preparerId}`, `${preparerId}@test.example.com`],
  )

  await pool.query(
    `INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, stripe_session_id, created_at)
     VALUES ($1, $2, NOW(), 'CREDIT_PENDING', $3, $4, 0, $5, NOW())`,
    [creditPendingId, preparerId, `Pending: ${sessionId}`, amountCents, sessionId],
  )

  await pool.query(
    `INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, stripe_session_id, created_at)
     VALUES ($1, $2, NOW(), 'HOLD', $3, $4, 0, $5, NOW())`,
    [holdId, preparerId, `Hold: ${sessionId}`, amountCents, sessionId],
  )

  return { preparerId, sessionId, creditPendingId, holdId }
}

/**
 * Creates a test preparer. Returns preparerId.
 */
export async function createTestPreparer(prefix = 'test'): Promise<string> {
  const pool = getPool()
  const preparerId = `${prefix}-preparer-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  await pool.query(
    `INSERT INTO tax_preparers (id, name, email, current_balance_cents, created_at, updated_at)
     VALUES ($1, $2, $3, 0, NOW(), NOW())`,
    [preparerId, `Test ${preparerId}`, `${preparerId}@test.example.com`],
  )
  return preparerId
}

/**
 * Seeds multiple CREDIT_PENDING rows for the same session.
 */
export async function seedMultipleCreditPending(
  sessionId: string,
  preparerId: string,
  amountsCents: number[],
): Promise<string[]> {
  const pool = getPool()
  const ids: string[] = []

  for (const amt of amountsCents) {
    const id = crypto.randomUUID()
    await pool.query(
      `INSERT INTO preparer_balances (id, preparer_id, occurred_at, type, description, amount_cents, running_balance_cents, stripe_session_id, created_at)
       VALUES ($1, $2, NOW(), 'CREDIT_PENDING', $3, $4, 0, $5, NOW())`,
      [id, preparerId, `Pending: ${sessionId}`, amt, sessionId],
    )
    ids.push(id)
  }

  return ids
}

export async function getPreparerBalance(preparerId: string): Promise<number> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT current_balance_cents FROM tax_preparers WHERE id = $1`,
    [preparerId],
  )
  return res.rows[0] ? Number(res.rows[0].current_balance_cents ?? 0) : 0
}

/**
 * Counts CREDIT rows with description containing the session ID (Settlement released: {sessionId}).
 */
export async function countCreditRowsForSession(
  preparerId: string,
  sessionId: string,
): Promise<number> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT COUNT(*) AS cnt FROM preparer_balances
     WHERE preparer_id = $1 AND type = 'CREDIT' AND description LIKE $2`,
    [preparerId, `%${sessionId}%`],
  )
  return Number(res.rows[0]?.cnt ?? 0)
}

/**
 * Counts HOLD rows for session that have released_at set.
 */
export async function countHoldRowsReleasedForSession(sessionId: string): Promise<number> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT COUNT(*) AS cnt FROM preparer_balances
     WHERE type = 'HOLD' AND stripe_session_id = $1 AND released_at IS NOT NULL`,
    [sessionId],
  )
  return Number(res.rows[0]?.cnt ?? 0)
}

/**
 * Counts total CREDIT_PENDING rows for session that were released (released_at set).
 */
export async function countCreditPendingReleasedForSession(sessionId: string): Promise<number> {
  const pool = getPool()
  const res = await pool.query(
    `SELECT COUNT(*) AS cnt FROM preparer_balances
     WHERE type = 'CREDIT_PENDING' AND stripe_session_id = $1 AND released_at IS NOT NULL`,
    [sessionId],
  )
  return Number(res.rows[0]?.cnt ?? 0)
}

/**
 * Cleans up test data. Call in afterEach or afterAll.
 */
export async function cleanupTestData(seed: SeedResult): Promise<void> {
  const pool = getPool()
  await pool.query(`DELETE FROM preparer_balances WHERE preparer_id = $1`, [seed.preparerId])
  await pool.query(`DELETE FROM tax_preparers WHERE id = $1`, [seed.preparerId])
}

export async function cleanupPreparer(preparerId: string): Promise<void> {
  const pool = getPool()
  await pool.query(`DELETE FROM preparer_balances WHERE preparer_id = $1`, [preparerId])
  await pool.query(`DELETE FROM tax_preparers WHERE id = $1`, [preparerId])
}
