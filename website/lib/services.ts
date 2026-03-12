export type ServiceKey =
  | 'tax_estimate_1099'
  | 'irs_letter_review'
  | 'pilot_deduction_check'
  | 'full_tax_filing_standard'
  | 'full_tax_filing_discounted'

export type StripeConfig =
  | {
      mode: 'payment_link'
      paymentLinkUrl: string
    }
  | {
      mode: 'checkout'
      priceId: string
    }
  | {
      mode: 'none'
      reason: 'coming_soon' | 'manual_quote' | 'not_configured'
    }

export type ServiceOffering = {
  key: ServiceKey
  title: string
  shortDescription: string
  priceDisplay: string
  stripe: StripeConfig
  successRedirectPath: string
  intakePath: string
  isMvp: boolean
}

/**
 * Stripe-ready service catalog.
 *
 * TODO(stripe):
 * - For Payment Links: set paymentLinkUrl to a live Stripe payment link.
 * - For Checkout: set priceId and create an API route to generate sessions.
 * - Ensure successRedirectPath matches Stripe success_url configuration.
 */
export const services: readonly ServiceOffering[] = [
  {
    key: 'tax_estimate_1099',
    title: '1099 Tax Estimate',
    shortDescription:
      'Understand estimated liability, quarterly exposure, and deductible categories before tax season becomes a problem.',
    priceDisplay: '$49',
    // TODO(stripe): Replace with live Stripe Price ID
    stripe: { mode: 'checkout', priceId: 'price_1099_ESTIMATE_TODO' },
    successRedirectPath: '/services/tax_estimate_1099/success',
    intakePath: '/services/tax_estimate_1099/intake',
    isMvp: true,
  },
  {
    key: 'irs_letter_review',
    title: 'IRS Letter Review',
    shortDescription:
      'Upload a notice and receive a plain-language explanation, whether action is required, and an appropriate next step.',
    priceDisplay: '$79',
    // TODO(stripe): Replace with live Stripe Price ID
    stripe: { mode: 'checkout', priceId: 'price_IRS_LETTER_TODO' },
    successRedirectPath: '/services/irs_letter_review/success',
    intakePath: '/services/irs_letter_review/intake',
    isMvp: true,
  },
  {
    key: 'pilot_deduction_check',
    title: 'Pilot Deduction Check',
    shortDescription:
      'A focused review of common aviation-related deductions and expense categories for pilots and instructors.',
    priceDisplay: '$39',
    // TODO(stripe): Replace with live Stripe Price ID
    stripe: { mode: 'checkout', priceId: 'price_PILOT_DEDUCTION_TODO' },
    successRedirectPath: '/services/pilot_deduction_check/success',
    intakePath: '/services/pilot_deduction_check/intake',
    isMvp: true,
  },
  {
    key: 'full_tax_filing_standard',
    title: 'Full Tax Preparation (Standard)',
    shortDescription: 'Full-service individual U.S. federal tax preparation and filing for qualified clients.',
    priceDisplay: 'Starting at $249',
    stripe: { mode: 'none', reason: 'manual_quote' },
    successRedirectPath: '/services/full_tax_filing_standard/success',
    intakePath: '/services/full_tax_filing_standard/intake',
    isMvp: true,
  },
  {
    key: 'full_tax_filing_discounted',
    title: 'Full Tax Preparation (Military / First Responders)',
    shortDescription:
      'Special pricing is available for eligible military and first responder clients (verification process to be finalized).',
    priceDisplay: '$149 (eligible clients)',
    stripe: { mode: 'none', reason: 'manual_quote' },
    successRedirectPath: '/services/full_tax_filing_discounted/success',
    intakePath: '/services/full_tax_filing_discounted/intake',
    isMvp: false,
  },
] as const

export function getService(key: string) {
  return services.find((s) => s.key === key)
}

