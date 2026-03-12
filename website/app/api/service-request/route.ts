import { NextResponse } from 'next/server'
import { getService } from '../../../lib/services'
import { createOrUpdateServiceRequest, type PaymentStatus } from '../../../lib/serviceRequests'
import { getStripe } from '../../../lib/stripeClient'

type Body = {
  serviceKey?: string
  name?: string
  email?: string
  phone?: string
  message?: string
  stripeSessionId?: string
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body
    const { serviceKey, name, email, phone, message, stripeSessionId } = body

    if (!serviceKey || !name || !email) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const service = getService(serviceKey)
    if (!service) {
      return NextResponse.json({ error: 'Unknown service' }, { status: 400 })
    }

    let paymentStatus: PaymentStatus = 'unverified'
    let stripeReference: string | undefined

    if (stripeSessionId) {
      try {
        const stripe = getStripe()
        const session = await stripe.checkout.sessions.retrieve(stripeSessionId)
        stripeReference = session.id
        if (session.payment_status === 'paid') {
          paymentStatus = 'paid'
        } else if (session.payment_status === 'unpaid' || session.payment_status === 'no_payment_required') {
          paymentStatus = 'pending'
        } else {
          paymentStatus = 'failed'
        }
      } catch (err) {
        console.error('Error verifying Stripe session for service request', err)
        paymentStatus = 'unverified'
      }
    }

    const record = await createOrUpdateServiceRequest({
      serviceKey: service.key,
      customerName: name,
      email,
      phone,
      message,
      paymentStatus,
      stripeSessionId,
      stripeReference,
    })

    return NextResponse.json({ ok: true, id: record.id, paymentStatus: record.paymentStatus })
  } catch (error) {
    console.error('Error creating service request', error)
    return NextResponse.json({ error: 'Unable to create service request' }, { status: 500 })
  }
}

