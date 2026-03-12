import type { Metadata } from 'next'
import Link from 'next/link'
import { getService } from '../../../../lib/services'
import { getStripe } from '../../../../lib/stripeClient'

export function generateMetadata({ params }: { params: { serviceKey: string } }): Metadata {
  const service = getService(params.serviceKey)
  if (!service) return { title: 'Success | AirTax Financial' }
  return { title: `Status — ${service.title} | AirTax Financial` }
}

async function verifySession(sessionId: string | undefined) {
  if (!sessionId) return { verified: false as const, paymentStatus: 'unknown' as const }
  try {
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return {
      verified: session.payment_status === 'paid',
      paymentStatus: session.payment_status,
    }
  } catch (err) {
    console.error('Error verifying Stripe session on success page', err)
    return { verified: false as const, paymentStatus: 'unknown' as const }
  }
}

export default async function ServiceSuccessPage({
  params,
  searchParams,
}: {
  params: { serviceKey: string }
  searchParams: { session_id?: string }
}) {
  const service = getService(params.serviceKey)
  const { verified, paymentStatus } = await verifySession(searchParams.session_id)

  const heading = verified ? 'Payment confirmed' : 'Status received'
  const body = verified
    ? service
      ? `Your payment for “${service.title}” has been confirmed.`
      : 'Your payment has been confirmed.'
    : 'We received a request from Stripe. If payment is still processing or unverified, details may be updated later.'

  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="eyebrow">Confirmation</div>
            <h1 className="h2 mt-4">{heading}</h1>
            <p className="lead mt-4">{body}</p>
            <p className="mt-4 text-xs leading-relaxed text-ink-500">
              Payment status (for reference): <span className="font-mono">{paymentStatus}</span>
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                className="btn-primary"
                href={
                  service
                    ? `${service.intakePath}${searchParams.session_id ? `?session_id=${encodeURIComponent(searchParams.session_id)}` : ''}`
                    : '/financial-services'
                }
              >
                Continue to intake
              </Link>
              <Link className="btn-secondary" href="/financial-services">
                Back to services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}


