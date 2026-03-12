import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { env } from '../../../../lib/env'
import { updatePaymentStatusBySessionId, createOrUpdateServiceRequest } from '../../../../lib/serviceRequests'
import { getService } from '../../../../lib/services'

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  const rawBody = await request.text()

  let event: Stripe.Event
  try {
    const stripe = new Stripe(env.getStripeSecretKey(), { apiVersion: '2023-10-16' })
    event = stripe.webhooks.constructEvent(rawBody, signature, env.getStripeWebhookSecret())
  } catch (err) {
    console.error('Stripe webhook signature verification failed', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const sessionId = session.id
      const paymentStatus = session.payment_status === 'paid' ? 'paid' : 'pending'
      const serviceKey = session.metadata?.service_key

      if (sessionId) {
        await updatePaymentStatusBySessionId(sessionId, paymentStatus, sessionId)

        if (serviceKey) {
          const service = getService(serviceKey)
          if (service) {
            // If no request exists yet for this session, create a minimal record.
            await createOrUpdateServiceRequest({
              serviceKey: service.key,
              customerName: 'Stripe session client',
              email: session.customer_details?.email ?? 'unknown@example.com',
              phone: session.customer_details?.phone ?? undefined,
              message: undefined,
              paymentStatus,
              stripeSessionId: sessionId,
              stripeReference: sessionId,
            })
          }
        }
      }
    }
    // Additional events (optional) can be added here, e.g., checkout.session.expired.

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error handling Stripe webhook event', err)
    return NextResponse.json({ error: 'Webhook handler error' }, { status: 500 })
  }
}

