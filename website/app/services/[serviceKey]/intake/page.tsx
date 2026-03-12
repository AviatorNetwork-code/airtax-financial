import type { Metadata } from 'next'
import Link from 'next/link'
import { getService } from '../../../../lib/services'
import { ServiceIntakeForm } from '../../../../components/ServiceIntakeForm'

export function generateMetadata({ params }: { params: { serviceKey: string } }): Metadata {
  const service = getService(params.serviceKey)
  if (!service) return { title: 'Intake | AirTax Financial' }
  return { title: `Intake — ${service.title} | AirTax Financial` }
}

export default function ServiceIntakePage({
  params,
  searchParams,
}: {
  params: { serviceKey: string }
  searchParams: { session_id?: string }
}) {
  const service = getService(params.serviceKey)
  if (!service) {
    return (
      <main className="container-shell py-16">
        <h1 className="h2">Intake not available</h1>
        <Link className="btn-secondary mt-10" href="/financial-services">
          Back to services
        </Link>
      </main>
    )
  }

  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-14 sm:py-18">
          <div className="max-w-3xl">
            <div className="eyebrow">Secure intake</div>
            <h1 className="h2 mt-4">Intake — {service.title}</h1>
            <p className="lead mt-4">
              Provide contact details and a brief summary. A structured follow-up will clarify scope and next steps.
            </p>
            {searchParams.session_id && (
              <p className="mt-3 text-xs leading-relaxed text-ink-500">
                A Stripe payment session reference is attached to this request.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="card card-pad max-w-3xl">
          <div className="text-sm font-semibold text-ink-900">Client details</div>
          <ServiceIntakeForm serviceKey={service.key} stripeSessionId={searchParams.session_id} />
        </div>
      </section>
    </main>
  )
}


