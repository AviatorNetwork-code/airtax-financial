# Aviator Network Integration

## Overview

AirTax Financial integrates with the Aviator Network to offer preferred pricing, streamlined onboarding, and a seamless experience for aviation professionals who are members. This document defines the integration scope, requirements, and operational procedures.

---

## Integration Objectives

- **Member benefits** — Deliver value to Aviator Network members through exclusive pricing and service access.
- **Referral flow** — Receive qualified leads from the Aviator Network with verified membership.
- **Purchase code system** — Support redemption of prepaid or subsidized services via purchase codes.
- **Brand alignment** — Present a cohesive experience that reflects both AirTax Financial and Aviator Network values.

---

## Member Benefits

| Benefit | Description | Verification |
|---------|-------------|--------------|
| **10% tax preparation discount** | Applied to first-year individual tax filing (Essential through Aviation Plus tiers) | Membership ID or referral token |
| **Priority scheduling** | Preference for discovery calls and intake during peak season | Membership status at referral |
| **Dedicated onboarding** | Recognition as Aviator Network member; expedited welcome | Referral source in CRM |
| **Purchase code redemption** | Ability to apply prepaid credits or subsidized service packages | Valid purchase code at intake |

---

## Referral Flow

### From Aviator Network to AirTax Financial

```
Aviator Network Member
        ↓
Clicks / Redeems → AirTax Financial
        ↓
Landing page or intake form (pre-filled with referral source)
        ↓
Discovery call scheduled
        ↓
Member benefit applied at engagement
```

### Data Requirements

| Field | Purpose |
|-------|---------|
| Referral source | "Aviator Network" |
| Member ID (if provided) | Verification of membership |
| Purchase code (if applicable) | Redemption tracking |
| Contact info | Standard intake fields |

---

## Purchase Code System

### Code Format

- **Structure:** Alphanumeric, e.g. `ATF-XXXX-XXXX` (configurable)
- **Uniqueness:** One-time use per code
- **Validity:** Expiration date and optional service restrictions

### Code Types

| Type | Use Case |
|------|----------|
| **Discount code** | Fixed percentage or dollar discount |
| **Service credit** | Prepaid amount toward specific services |
| **Package code** | Redemption of bundled offering (e.g., Essential + planning call) |

### Redemption Workflow

1. Client presents code at intake or during discovery call.
2. Staff validates code via integration or manual lookup.
3. If valid: apply benefit, mark code as redeemed, record in CRM.
4. If invalid/expired: inform client; offer standard pricing.

### Code Validation

- **Integration (preferred):** API or portal check with Aviator Network.
- **Manual fallback:** Secure list of valid codes; redemption logged for reconciliation.

---

## Technical Integration (Future State)

### Proposed Capabilities

| Capability | Description |
|------------|-------------|
| **Membership verification** | API call to confirm member status before applying benefits |
| **Purchase code validation** | Real-time validation and redemption through shared system |
| **Referral tracking** | UTM or token passed from Aviator Network to AirTax systems |
| **Reporting** | Aggregate metrics on referrals, redemptions, and revenue by source |

### Security & Compliance

- All member data handled per AirTax Financial privacy policy and applicable regulations.
- No storage of Aviator Network credentials; use tokens or API keys with minimal scope.
- Purchase code data retained for reconciliation and audit purposes.

---

## Operational Procedures

### Receiving a Referral

1. Log referral source as "Aviator Network" in CRM.
2. If member ID provided, note for verification.
3. If purchase code provided, validate before engagement.
4. Proceed with standard onboarding; apply member benefits where applicable.
5. Track outcome (engaged / did not engage) for reporting.

### Applying Member Discount

1. Confirm membership (referral token, member ID, or purchase code).
2. Apply 10% discount to eligible tax preparation fee.
3. Document discount and verification in client file.
4. Report to Aviator Network per agreement (if required).

### Handling Invalid or Expired Codes

1. Explain situation clearly to client.
2. Offer standard pricing.
3. Log attempted redemption for Aviator Network feedback.
4. Do not apply benefit without valid verification.

---

## Reporting & Reconciliation

### Metrics to Track

- Number of referrals received
- Conversion rate (inquiry → engagement)
- Number of purchase codes redeemed
- Revenue attributable to Aviator Network
- Discount amounts applied

### Reconciliation (if purchase codes involve prepayment)

- Periodic alignment of redemptions with Aviator Network records.
- Resolution of any code or payment discrepancies.

---

## Contact & Escalation

| Issue | Action |
|-------|--------|
| Membership verification failure | Escalate to Aviator Network contact |
| Code validation failure | Check manual list; escalate if unresolved |
| Integration outage | Use manual fallback; document for post-incident review |
| Billing or payment dispute | Follow internal escalation; involve Aviator Network if needed |

---

## Document Control

| Version | Date | Author |
|---------|------|--------|
| 1.0 | 2025 | AirTax Financial |
