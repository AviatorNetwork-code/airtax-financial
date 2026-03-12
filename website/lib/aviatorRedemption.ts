export type AviatorCodeStatus = 'AVAILABLE' | 'PURCHASED' | 'REDEEMED' | 'EXPIRED'

export type AviatorPurchaseCode = {
  code: string
  pin: string
}

export type AviatorPurchaseCodeRecord = {
  code: string
  pin_hash: string
  status: AviatorCodeStatus
  is_paid: boolean
  is_redeemed: boolean
  purchased_by_user_id?: string
  redeemed_at?: string
  expires_at: string
  created_at: string
}

/**
 * Aviator Network code redemption scaffolding.
 *
 * Business rules (docs):
 * - Code + PIN required for redemption (no code-only redemption).
 * - Codes are single-use.
 * - Codes expire after 90 days.
 * - If unused after 90 days, refund 22,000 AeroCoins (Aviator Network side).
 *
 * TODO(api):
 * - POST /api/aviator/redeem { code, pin }
 * - Rate-limit attempts and log/audit status changes.
 * - Do not store raw PIN long-term; store pin_hash.
 * - On redemption, trigger inventory replenishment if AVAILABLE count < threshold (e.g., 50).
 */

