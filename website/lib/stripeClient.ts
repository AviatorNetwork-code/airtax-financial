import Stripe from 'stripe'
import { env } from './env'

export function getStripe() {
  return new Stripe(env.getStripeSecretKey(), {
    apiVersion: '2023-10-16',
  })
}

export function getBaseUrl() {
  return env.getSiteUrl()
}

