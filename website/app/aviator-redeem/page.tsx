import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Redeem Aviator Network Code | AirTax Financial',
  description:
    'Redeem an Aviator Network purchase code and PIN to access eligible AirTax Financial services. Professional, non-revealing validation flow (scaffold).',
}

export default function AviatorRedeemPage() {
  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-16 sm:py-20">
          <div className="max-w-3xl">
            <div className="eyebrow">Aviator Network</div>
            <h1 className="h1 mt-4">Redeem your purchase code</h1>
            <p className="lead mt-6">
              Enter your code and verification PIN to begin. This flow is designed to be professional, rate-limited, and
              non-revealing.
            </p>
            <p className="mt-6 text-xs leading-relaxed text-ink-500">
              TODO(integration): This page is a scaffold. Implement server-side validation and audit logging before using
              in production.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">Code redemption</div>
              <form className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm sm:col-span-2">
                  <span className="text-ink-700">Purchase code</span>
                  <input
                    className="rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy/40"
                    placeholder="ATF-XXXX-XXXX"
                    autoCapitalize="characters"
                  />
                </label>
                <label className="grid gap-2 text-sm">
                  <span className="text-ink-700">Verification PIN</span>
                  <input
                    className="rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy/40"
                    placeholder="1234"
                    inputMode="numeric"
                  />
                </label>
                <div className="sm:col-span-2 mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button type="button" className="btn-primary">
                    Redeem (TODO)
                  </button>
                  <Link className="btn-secondary" href="/financial-services">
                    View services
                  </Link>
                </div>
              </form>

              <div className="mt-8 rounded-md border border-navy/10 bg-white p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">Error handling note</div>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">
                  Validation errors should be professional and non-revealing (e.g., “Unable to verify code” rather than
                  “PIN incorrect”).
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">What happens next</div>
              <ol className="mt-4 space-y-3 text-sm text-ink-600">
                <li>
                  <span className="font-medium text-ink-800">1.</span> We validate your code + PIN
                </li>
                <li>
                  <span className="font-medium text-ink-800">2.</span> If valid, we unlock booking/intake
                </li>
                <li>
                  <span className="font-medium text-ink-800">3.</span> You proceed with a structured, confidential flow
                </li>
              </ol>
            </div>
            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">Legal</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Redemption is subject to service scope and eligibility terms.
              </p>
              <div className="mt-4 text-sm">
                <Link className="link" href="/terms">
                  Terms
                </Link>{' '}
                <span className="text-ink-400">/</span>{' '}
                <Link className="link" href="/privacy">
                  Privacy
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

