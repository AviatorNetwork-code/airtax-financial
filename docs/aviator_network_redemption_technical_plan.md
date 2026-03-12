# Aviator Network → AirTax Redemption (Technical Plan)

## Purpose

Define a secure, auditable code redemption bridge between Aviator Network and AirTax Financial for discounted filing access.

This document is **planning scaffolding** and is not a final security design.

---

## Business Logic Summary

- User purchases AirTax filing access inside Aviator Network
- Payment: **$100 cash + 10,000 AeroCoins**
- Aviator Network generates a **unique code** and a **4–5 digit PIN**
- User redeems at AirTax Financial using **code + PIN**
- AirTax validates and (if valid/unused/unexpired) marks the code as **redeemed** and allows booking/intake

---

## Required Fields (Conceptual)

- `code`
- `pin` (do not store raw long-term)
- `pin_hash`
- `status`: `AVAILABLE | PURCHASED | REDEEMED | EXPIRED`
- `is_paid` / `is_sold`
- `is_redeemed`
- `purchased_by_user_id`
- `redeemed_at`
- `expires_at`
- `created_at`

---

## Security Requirements

- **Code + PIN required** (no code-only redemption)
- **Single-use** codes
- **Rate limit** redemption attempts (per IP and per code)
- **Audit log** all status changes (who/when/what changed)
- Store **PIN as hash**, not plaintext (where possible)
- Avoid verbose errors (do not reveal if code exists vs pin wrong)

---

## Inventory Rules

- Maintain ~**50** available unused codes in inventory
- When redeemed, replenish inventory if available/unsold code count drops below threshold
- Expire codes automatically after **90 days**

---

## Proposed API (AirTax side)

### POST `/api/aviator/redeem`

Request:

```json
{ "code": "ATF-XXXX-XXXX", "pin": "1234" }
```

Response (success):

```json
{ "ok": true, "redirect": "/services/full_tax_filing_standard/intake" }
```

Response (failure, non-revealing):

```json
{ "ok": false, "message": "Unable to verify code." }
```

Notes:
- Verify status, expiry, paid flag
- Validate PIN hash
- Mark redeemed in an atomic transaction
- Append audit log entry
- Apply rate limiting

---

## Pages (AirTax side)

- `/aviator-redeem`
  - Inputs: `code`, `pin`
  - Submits to redemption endpoint
  - On success: routes to booking/intake
  - On failure: professional, non-revealing message

---

## TODOs Before Production

- Choose data store for code records and audit logs
- Implement server-side rate limiting
- Implement hashing strategy (argon2/bcrypt) and safe compare
- Add monitoring/alerting for abuse patterns
- Finalize refund policy handling (Aviator Network side)

