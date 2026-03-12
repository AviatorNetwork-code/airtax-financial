export const env = {
  getStripeSecretKey(): string {
    const value = process.env.STRIPE_SECRET_KEY
    if (!value) {
      throw new Error('Missing required environment variable: STRIPE_SECRET_KEY')
    }
    return value
  },
  getStripeWebhookSecret(): string {
    const value = process.env.STRIPE_WEBHOOK_SECRET
    if (!value) {
      throw new Error('Missing required environment variable: STRIPE_WEBHOOK_SECRET')
    }
    return value
  },
  getSiteUrl(): string {
    return process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  },
}

