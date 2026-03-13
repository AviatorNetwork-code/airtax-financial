# AirTax Financial Tests

## Settlement Release Regression Tests

Tests for `releaseSettlementForSession(stripeSessionId)` in `lib/preparerBalances.ts`.

### Prerequisites

- PostgreSQL test database
- `DATABASE_URL` environment variable

### Running Tests

```bash
# With DATABASE_URL (required for integration tests)
DATABASE_URL=postgres://user:password@localhost:5432/airtax_test npm run test:release-settlement

# Without DATABASE_URL: tests are skipped (pass)
npm run test:release-settlement
```

### Test Scenarios

| Scenario | Description |
|----------|-------------|
| A. Sequential duplicate | Second call does not double-credit; HOLD released once |
| B. Concurrent duplicate | `Promise.all([release, release])` creates exactly one CREDIT |
| C. No-op | Non-existent sessionId does not throw |
| D. Multiple pending | Multiple CREDIT_PENDING for same session released exactly once |

### Test Database Setup

1. Create a test database: `createdb airtax_test`
2. Run schema migrations from `docs/` (e.g. `preparer_balances_schema.sql`, `advisor_availability_migration.sql`)
3. Set `DATABASE_URL=postgres://.../airtax_test`
