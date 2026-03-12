import { NextResponse } from 'next/server'
import { getStripe, getBaseUrl } from '../../../lib/stripeClient'
import { getService } from '../../../lib/services'

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { serviceKey } = body as { serviceKey?: string }

    if (!serviceKey) {
      return NextResponse.json({ error: 'serviceKey required' }, { status: 400 })
    }

    const service = getService(serviceKey)
    if (!service) {
      return NextResponse.json({ error: 'Unknown service' }, { status: 400 })
    }

    if (service.stripe.mode !== 'checkout') {
      return NextResponse.json({ error: 'Service is not configured for Stripe Checkout' }, { status: 400 })
    }

    const stripe = getStripe()
    const baseUrl = getBaseUrl()

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          price: service.stripe.priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/services/${service.key}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/financial-services`,
      metadata: {
        service_key: service.key,
      },
    })

    return NextResponse.json({ url: session.url, sessionId: session.id })
  } catch (error) {
    console.error('Error creating Stripe Checkout session', error)
    return NextResponse.json({ error: 'Unable to create checkout session' }, { status: 500 })
  }
}

