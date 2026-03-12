import type { Metadata } from 'next'
import Link from 'next/link'
import { services } from '../../lib/services'

export const metadata: Metadata = {
  title: 'Financial Services | AirTax Financial',
  description:
    'Simple, professional tax and financial help for pilots, aviation professionals, and independent contractors in the United States.',
}

const featured = services.filter((s) =>
  ['tax_estimate_1099', 'irs_letter_review', 'pilot_deduction_check'].includes(s.key),
)

export default function FinancialServicesPage() {
  return (
    <main className="bg-white">
      <section className="bg-surface">
        <div className="container-shell py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="eyebrow">AirTax Financial</div>
            <h1 className="h1 mt-4">
              Simple Tax and Financial Help for Pilots, Aviation Professionals, and Independent Contractors
            </h1>
            <p className="lead mt-6">
              Clear, professional support for tax questions, IRS notices, deductions, and filing preparation — without
              unnecessary complexity.
            </p>
            <div id="get-started" className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" href="#services">
                View Services
              </Link>
              <Link className="btn-secondary" href="/aviator-redeem">
                Redeem Aviator Network Code
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="border-t border-navy/10">
        <div className="container-shell py-16 sm:py-20">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <div className="eyebrow">Micro-services</div>
              <h2 className="h2 mt-4">Focused support. Premium standard.</h2>
              <p className="lead mt-4">
                Paid services designed for fast, professional outcomes—presented with clear scope and structured next
                steps.
              </p>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featured.map((s) => (
              <div key={s.key} className="card card-pad flex flex-col">
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-lg font-semibold tracking-tight text-ink-900">{s.title}</h3>
                  <div className="text-sm font-medium text-ink-700">{s.priceDisplay}</div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink-600">{s.shortDescription}</p>
                <div className="mt-8">
                  <Link className="btn-secondary w-full" href={`/services/${s.key}`}>
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-navy/10 bg-surface">
        <div className="container-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="card card-pad">
              <div className="eyebrow">How it works</div>
              <h2 className="text-lg font-semibold tracking-tight text-ink-900 mt-3">A disciplined, simple process.</h2>
              <ol className="mt-6 space-y-3 text-sm text-ink-600">
                <li>
                  <span className="font-medium text-ink-800">1.</span> Choose a service
                </li>
                <li>
                  <span className="font-medium text-ink-800">2.</span> Submit your information securely
                </li>
                <li>
                  <span className="font-medium text-ink-800">3.</span> Receive a professional response
                </li>
              </ol>
            </div>

            <div id="full-filing" className="card card-pad lg:col-span-2">
              <div className="eyebrow">Full filing</div>
              <h2 className="h2 mt-4">Need Full Tax Preparation?</h2>
              <p className="lead mt-4">
                AirTax Financial also offers full-service filing and tax support for qualified clients.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-navy/10 bg-white p-5">
                  <div className="text-sm font-semibold text-ink-900">Standard filing</div>
                  <div className="mt-2 text-sm text-ink-600">Starting at $249</div>
                </div>
                <div className="rounded-md border border-navy/10 bg-white p-5">
                  <div className="text-sm font-semibold text-ink-900">Military & first responders</div>
                  <div className="mt-2 text-sm text-ink-600">Pricing available at $149 (eligible clients)</div>
                </div>
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link className="btn-primary" href="/services/full_tax_filing_standard">
                  Start Tax Filing
                </Link>
                <Link className="btn-secondary" href="/about">
                  Learn about our approach
                </Link>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-ink-500">
                Note: We do not claim CPA/EA status on this site. Scope and engagement terms are confirmed in writing
                prior to work.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-navy/10">
        <div className="container-shell py-16 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="eyebrow">Trust</div>
              <h2 className="h2 mt-4">Aviation-aware. Finance-first.</h2>
              <p className="lead mt-4">
                Built with an understanding of pilots and aviation professionals—delivered with a calm, confidential,
                and structured process.
              </p>
            </div>
            <div className="lg:col-span-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-md border border-navy/10 bg-white p-6">
                <div className="text-sm font-semibold text-ink-900">Confidential by design</div>
                <p className="mt-2 text-sm text-ink-600">Professional communication and clear handling expectations.</p>
              </div>
              <div className="rounded-md border border-navy/10 bg-white p-6">
                <div className="text-sm font-semibold text-ink-900">Clear scope</div>
                <p className="mt-2 text-sm text-ink-600">No ambiguity on what’s included and what isn’t.</p>
              </div>
              <div className="rounded-md border border-navy/10 bg-white p-6">
                <div className="text-sm font-semibold text-ink-900">Aviation-aware</div>
                <p className="mt-2 text-sm text-ink-600">Subtle industry understanding without gimmicks.</p>
              </div>
              <div className="rounded-md border border-navy/10 bg-white p-6">
                <div className="text-sm font-semibold text-ink-900">Professional standards</div>
                <p className="mt-2 text-sm text-ink-600">Measured guidance and conservative, compliant language.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

