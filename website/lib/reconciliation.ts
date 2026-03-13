/**
 * Ledger reconciliation utility.
 * Compares ledger-derived balance against tax_preparers.current_balance_cents.
 * Read-only; safe for staging and production.
 */

import { getPool } from './db'

export type ReconciliationMismatch = {
  preparerId: string
  currentBalanceCents: number
  computedBalanceCents: number
  deltaCents: number
}

/**
 * Computes ledger-derived balance for each preparer and returns only mismatches.
 * Read-only: uses SELECT only.
 *
 * computed_balance_cents = SUM(amount_cents) for type IN (CREDIT, MANUAL_ADJUSTMENT, PENALTY, ADJUSTMENT).
 * Excluded: CREDIT_PENDING, HOLD (not in balance until released), RELEASE (audit-only, amount=0).
 */
export async function reconcilePreparerBalances(): Promise<ReconciliationMismatch[]> {
  const pool = getPool()

  const computedRes = await pool.query(
    `
    SELECT preparer_id, COALESCE(SUM(amount_cents), 0)::BIGINT AS computed_balance_cents
    FROM preparer_balances
    WHERE type IN ('CREDIT', 'MANUAL_ADJUSTMENT', 'PENALTY', 'ADJUSTMENT')
    GROUP BY preparer_id
    `,
  )

  const computedByPreparer = new Map<string, number>()
  for (const row of computedRes.rows) {
    computedByPreparer.set(row.preparer_id as string, Number(row.computed_balance_cents ?? 0))
  }

  const preparersRes = await pool.query(
    `SELECT id, current_balance_cents FROM tax_preparers`,
  )

  const mismatches: ReconciliationMismatch[] = []

  for (const row of preparersRes.rows) {
    const preparerId = row.id as string
    const currentBalanceCents = Number(row.current_balance_cents ?? 0)
    const computedBalanceCents = computedByPreparer.get(preparerId) ?? 0

    if (currentBalanceCents !== computedBalanceCents) {
      mismatches.push({
        preparerId,
        currentBalanceCents,
        computedBalanceCents,
        deltaCents: currentBalanceCents - computedBalanceCents,
      })
    }
  }

  return mismatches
}
