import type { Metadata } from 'next'
import Link from 'next/link'
import { getService } from '../../../lib/services'
import { CheckoutButton } from '../../../components/CheckoutButton'

export function generateMetadata({ params }: { params: { serviceKey: string } }): Metadata {
  const service = getService(params.serviceKey)
  if (!service) {
    return { title: 'Service Not Found | AirTax Financial' }
  }
  return {
    title: `${service.title} | AirTax Financial`,
    description: service.shortDescription,
  }
}

export default function ServiceDetailPage({ params }: { params: { serviceKey: string } }) {
  const service = getService(params.serviceKey)
  if (!service) {
    return (
      <main className="container-shell py-16">
        <h1 className="h2">Service not found</h1>
        <p className="lead mt-4">The requested service is not available.</p>
        <Link className="btn-secondary mt-10" href="/financial-services">
          Back to services
        </Link>
      </main>
    )
  }

  const primaryCta =
    service.stripe.mode === 'payment_link' ? (
      <a className="btn-primary" href={service.stripe.paymentLinkUrl}>
        Continue to payment
      </a>
    ) : service.stripe.mode === 'checkout' ? (
      <CheckoutButton serviceKey={service.key} />
    ) : (
      <Link className="btn-primary" href={service.intakePath}>
        Continue
      </Link>
    )

  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="eyebrow">AirTax Financial • Service</div>
            <h1 className="h1 mt-4">{service.title}</h1>
            <p className="lead mt-6">{service.shortDescription}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              {primaryCta}
              <Link className="btn-secondary" href="/financial-services">
                View all services
              </Link>
              <div className="text-sm font-medium text-ink-700 sm:ml-auto">{service.priceDisplay}</div>
            </div>

            {service.stripe.mode === 'none' ? (
              <p className="mt-6 text-xs leading-relaxed text-ink-500">
                TODO(stripe): Connect Stripe for payments. This page currently routes to a secure intake scaffold.
              </p>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">What you can expect</div>
              <ul className="mt-5 space-y-3 text-sm text-ink-600">
                <li>Clear scope and next steps</li>
                <li>Confidential handling expectations</li>
                <li>Professional, conservative language</li>
              </ul>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">After payment / intake</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                You’ll be guided to a secure intake page to submit details and receive structured next steps.
              </p>
              <div className="mt-6">{primaryCta}</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

