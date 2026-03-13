#!/usr/bin/env npx tsx
/**
 * Run ledger reconciliation from CLI.
 * Requires DATABASE_URL. Use internal auth when calling the API instead.
 *
 * Run: npx tsx scripts/run-reconciliation.ts
 * Or:  npm run reconciliation
 */

import { reconcilePreparerBalances } from '../lib/reconciliation'

async function main() {
  const mismatches = await reconcilePreparerBalances()
  if (mismatches.length === 0) {
    console.log('OK: No balance drift detected.')
    return
  }
  console.log(`Found ${mismatches.length} preparer(s) with balance drift:\n`)
  for (const m of mismatches) {
    console.log(
      `  ${m.preparerId}: current=${m.currentBalanceCents} computed=${m.computedBalanceCents} delta=${m.deltaCents}`,
    )
  }
  process.exit(1)
}

main().catch((err) => {
  console.error('Reconciliation failed:', err)
  process.exit(1)
})
