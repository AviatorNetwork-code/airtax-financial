import { NextResponse } from 'next/server'
import { requireInternalAuth } from '../../../../lib/internalAuth'
import { reconcilePreparerBalances } from '../../../../lib/reconciliation'

/**
 * GET /api/admin/reconciliation
 * Returns preparers with balance drift (ledger-derived vs current_balance_cents).
 * Admin-only, read-only.
 */
export async function GET(request: Request) {
  const authError = requireInternalAuth(request)
  if (authError) return authError

  try {
    const mismatches = await reconcilePreparerBalances()
    return NextResponse.json({
      ok: true,
      count: mismatches.length,
      mismatches,
    })
  } catch (err) {
    console.error('Reconciliation error', err)
    return NextResponse.json(
      { error: 'Unable to run reconciliation' },
      { status: 500 },
    )
  }
}
