/**
 * Regression tests for releaseSettlementForSession(stripeSessionId).
 *
 * Requires DATABASE_URL. Use a test database to avoid affecting production.
 * Run: DATABASE_URL=postgres://... npm run test:release-settlement
 */

import { releaseSettlementForSession } from '../../lib/preparerBalances'
import {
  seedPendingSettlement,
  seedMultipleCreditPending,
  createTestPreparer,
  getPreparerBalance,
  countCreditRowsForSession,
  countHoldRowsReleasedForSession,
  countCreditPendingReleasedForSession,
  cleanupTestData,
  cleanupPreparer,
} from '../helpers/settlementTestHelpers'

const hasDatabase = !!process.env.DATABASE_URL

describe('releaseSettlementForSession', () => {
  const AMOUNT_CENTS = 5000

  beforeAll(() => {
    if (!hasDatabase) {
      console.warn(
        'Skipping releaseSettlementForSession tests: DATABASE_URL not set. ' +
          'Use a test database: DATABASE_URL=postgres://user:pass@host/db npm run test:release-settlement',
      )
    }
  })

  describe('A. Sequential duplicate release', () => {
    it('does not double-credit on second call', async () => {
      if (!hasDatabase) return
      const sessionId = `cs_seq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const seed = await seedPendingSettlement(sessionId, AMOUNT_CENTS, 'seq')

      try {
        await releaseSettlementForSession(sessionId)
        const balanceAfterFirst = await getPreparerBalance(seed.preparerId)
        const creditCountAfterFirst = await countCreditRowsForSession(seed.preparerId, sessionId)
        const holdReleasedAfterFirst = await countHoldRowsReleasedForSession(sessionId)

        await releaseSettlementForSession(sessionId)
        const balanceAfterSecond = await getPreparerBalance(seed.preparerId)
        const creditCountAfterSecond = await countCreditRowsForSession(seed.preparerId, sessionId)
        const holdReleasedAfterSecond = await countHoldRowsReleasedForSession(sessionId)

        expect(balanceAfterSecond).toBe(balanceAfterFirst)
        expect(balanceAfterFirst).toBe(AMOUNT_CENTS)
        expect(creditCountAfterSecond).toBe(creditCountAfterFirst)
        expect(creditCountAfterFirst).toBe(1)
        expect(holdReleasedAfterSecond).toBe(holdReleasedAfterFirst)
        expect(holdReleasedAfterFirst).toBe(1)
      } finally {
        await cleanupTestData(seed)
      }
    })
  })

  describe('B. Concurrent duplicate release', () => {
    it('does not create duplicate CREDIT rows or double-credit', async () => {
      if (!hasDatabase) return
      const sessionId = `cs_concurrent_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const seed = await seedPendingSettlement(sessionId, AMOUNT_CENTS, 'concurrent')

      try {
        const balanceBefore = await getPreparerBalance(seed.preparerId)

        await Promise.all([
          releaseSettlementForSession(sessionId),
          releaseSettlementForSession(sessionId),
        ])

        const balanceAfter = await getPreparerBalance(seed.preparerId)
        const creditCount = await countCreditRowsForSession(seed.preparerId, sessionId)
        const holdReleased = await countHoldRowsReleasedForSession(sessionId)

        expect(creditCount).toBe(1)
        expect(balanceAfter - balanceBefore).toBe(AMOUNT_CENTS)
        expect(holdReleased).toBe(1)
      } finally {
        await cleanupTestData(seed)
      }
    })
  })

  describe('C. No-op release', () => {
    it('does not throw when no releasable rows exist', async () => {
      if (!hasDatabase) return
      const sessionId = `cs_noop_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

      await expect(releaseSettlementForSession(sessionId)).resolves.not.toThrow()
    })

    it('is safe to call multiple times with non-existent session', async () => {
      if (!hasDatabase) return
      const sessionId = `cs_noop2_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

      await expect(
        Promise.all([
          releaseSettlementForSession(sessionId),
          releaseSettlementForSession(sessionId),
        ]),
      ).resolves.not.toThrow()
    })
  })

  describe('D. Multiple pending rows for same session', () => {
    it('releases each CREDIT_PENDING exactly once and balance equals sum', async () => {
      if (!hasDatabase) return
      const sessionId = `cs_multi_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const preparerId = await createTestPreparer('multi')
      const amounts = [3000, 2000, 5000]
      const expectedSum = amounts.reduce((a, b) => a + b, 0)

      try {
        await seedMultipleCreditPending(sessionId, preparerId, amounts)

        await releaseSettlementForSession(sessionId)

        const balanceAfter = await getPreparerBalance(preparerId)
        const creditCount = await countCreditRowsForSession(preparerId, sessionId)
        const creditPendingReleased = await countCreditPendingReleasedForSession(sessionId)

        expect(creditPendingReleased).toBe(3)
        expect(creditCount).toBe(3)
        expect(balanceAfter).toBe(expectedSum)
      } finally {
        await cleanupPreparer(preparerId)
      }
    })

    it('second call does not release again', async () => {
      if (!hasDatabase) return
      const sessionId = `cs_multi2_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
      const preparerId = await createTestPreparer('multi2')
      const amounts = [1000, 2000]

      try {
        await seedMultipleCreditPending(sessionId, preparerId, amounts)

        await releaseSettlementForSession(sessionId)
        const balanceAfterFirst = await getPreparerBalance(preparerId)

        await releaseSettlementForSession(sessionId)
        const balanceAfterSecond = await getPreparerBalance(preparerId)

        expect(balanceAfterSecond).toBe(balanceAfterFirst)
        expect(balanceAfterFirst).toBe(3000)
      } finally {
        await cleanupPreparer(preparerId)
      }
    })
  })
})
