import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service | AirTax Financial',
  description: 'Terms of Service for AirTax Financial and airtaxfinancial.com.',
}

export default function TermsPage() {
  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-14 sm:py-18">
          <div className="max-w-3xl">
            <div className="eyebrow">Legal</div>
            <h1 className="h1 mt-4">Terms of Service</h1>
            <p className="lead mt-6">
              This page provides a structured placeholder for AirTax Financial terms. It is not attorney-reviewed legal
              advice.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="max-w-3xl space-y-10">
          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Ownership of Website</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              AirTax Financial and airtaxfinancial.com are operated by Northbridge Venture Group LLC, a Florida limited
              liability company.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Scope of Services</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              AirTax Financial provides U.S.-focused tax preparation and related support services. Service scope, timing,
              and deliverables are confirmed in writing before work begins.
            </p>
            <p className="mt-3 text-xs text-ink-500">
              TODO(legal): Finalize service descriptions, engagement letter references, and eligibility rules.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Limited Advisory Engagement</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Content on this website is for general informational purposes and does not constitute legal advice. Some
              services may provide limited guidance within a clearly defined scope.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Client Responsibility</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Clients are responsible for providing accurate, complete information. Outcomes may be affected by missing
              documentation or inaccurate inputs.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">No Guaranteed Tax Outcome</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Tax outcomes depend on facts, documentation, and applicable law. We do not guarantee refunds, results, or
              acceptance by any agency.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Estimates Are Not Final Filings</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Estimates and reviews are limited-scope services and do not replace full tax preparation unless explicitly
              agreed in writing.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Payment Policy</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Payment terms, refunds, and cancellations are defined per service and will be provided prior to purchase or
              engagement.
            </p>
            <p className="mt-3 text-xs text-ink-500">TODO(legal): Add Refund & Cancellation Policy and link here.</p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Confidentiality & Document Handling</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              We aim to handle documents responsibly and communicate clearly about secure submission methods. Clients
              should avoid sending sensitive information through unsecured channels unless instructed.
            </p>
            <p className="mt-3 text-xs text-ink-500">TODO(security): Define secure upload flow and retention policy.</p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Limitation of Liability</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              To the extent permitted by law, liability is limited as described in the final terms and engagement
              documentation.
            </p>
            <p className="mt-3 text-xs text-ink-500">TODO(legal): Add final limitation language and disclaimers.</p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Governing Law (Florida)</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              These terms are intended to be governed by Florida law, subject to final legal review.
            </p>
          </div>

          <div className="text-sm text-ink-600">
            <Link className="link" href="/privacy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

