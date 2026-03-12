import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Financial Services and Tax Information for Pilots and Aviation Employees | AirTax Financial',
  description:
    'Practical U.S. tax and financial guidance for pilots, instructors, crew members, contractors, and aviation professionals—written in a calm, structured tone.',
}

function InlineCta({
  title,
  body,
  ctaLabel,
  href,
}: {
  title: string
  body: string
  ctaLabel: string
  href: string
}) {
  return (
    <div className="card card-pad">
      <div className="text-sm font-semibold text-ink-900">{title}</div>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">{body}</p>
      <div className="mt-6">
        <Link className="btn-secondary" href={href}>
          {ctaLabel}
        </Link>
      </div>
    </div>
  )
}

export default function AviationResourcePage() {
  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="eyebrow">Resource</div>
            <h1 className="h1 mt-4">Financial Services and Tax Information for Pilots and Aviation Employees</h1>
            <p className="lead mt-6">
              Practical tax and financial guidance for pilots, instructors, crew members, contractors, and aviation
              professionals.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="max-w-3xl">
          <h2 className="text-xl font-semibold tracking-tight text-ink-900">Aviation careers often come with complexity</h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-600">
            Aviation professionals may shift between employers, duty locations, and pay structures. Some roles include
            1099 or contract income; others are W-2 with variable schedules, reimbursements, and training costs. The goal
            of this page is clarity—what to pay attention to, and when it makes sense to get professional help.
          </p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                Tax Considerations for Pilots and Independent Aviation Professionals
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  If you receive 1099 income, your tax responsibilities typically include estimated tax planning and more
                  disciplined recordkeeping. If you receive W-2 income, you still benefit from a structured approach to
                  documentation and a clear understanding of what is and is not deductible.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>W-2 vs 1099 implications and how they affect withholding and planning</li>
                  <li>Estimated tax payments and quarterly cadence (where applicable)</li>
                  <li>Recordkeeping practices that reduce errors and stress at filing time</li>
                  <li>Expense awareness—understanding categories that may apply to aviation professionals</li>
                </ul>
              </div>
              <div className="mt-8">
                <InlineCta
                  title="Need a 1099 tax estimate?"
                  body="A quick, professional estimate can clarify quarterly exposure and reduce surprises."
                  ctaLabel="View the 1099 Tax Estimate service"
                  href="/financial-services#services"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                Financial Planning Considerations in Aviation Careers
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  Aviation careers can include irregular income patterns, training cycles, and transitions between roles.
                  The most valuable planning is often simple: understanding cash flow, managing training and certification
                  costs, and setting a conservative tax reserve.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Budgeting for flight training, certifications, and recurrent costs</li>
                  <li>Planning for income volatility (contract work, seasonal demand, transitions)</li>
                  <li>Preparing documentation and timelines well before filing season</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Common Tax Questions</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  The right questions tend to be consistent: deductions, notices, contractor taxes, and what to do now to
                  make filing season clean.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>What deductions apply to my situation and what documentation matters?</li>
                  <li>How should I handle a notice or verification request?</li>
                  <li>What does “estimated tax” mean for contractors and independent professionals?</li>
                  <li>How can I reduce complexity before filing season?</li>
                </ul>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <InlineCta
                  title="Received an IRS letter?"
                  body="Get a plain-language review and clear next steps."
                  ctaLabel="IRS Letter Review"
                  href="/services/irs_letter_review"
                />
                <InlineCta
                  title="Want a deduction check?"
                  body="A focused review of common aviation-related categories—no gimmicks."
                  ctaLabel="Pilot Deduction Check"
                  href="/services/pilot_deduction_check"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">
                Support for Military, Veterans, and First Responders
              </h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  Special pricing is available for eligible military and first responder clients. We present this as a
                  respectful benefit—not a marketing gimmick—and keep scope and expectations clear.
                </p>
                <p className="text-xs text-ink-500">
                  TODO(eligibility): Define verification process and documentation requirements before launch.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">When to Get Professional Help</h2>
              <div className="mt-4 space-y-4 text-sm leading-relaxed text-ink-600">
                <p>
                  Professional support is most valuable when the cost of a mistake is high or the situation is unclear.
                  That typically includes notices, estimated-tax uncertainty, and full-filing needs with multiple income
                  sources.
                </p>
              </div>
              <div className="mt-8">
                <InlineCta
                  title="Need full filing support?"
                  body="We offer full-service U.S. filing for qualified clients, with clear engagement terms."
                  ctaLabel="Start with Financial Services"
                  href="/financial-services#full-filing"
                />
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">FAQ</h2>
              <dl className="mt-6 space-y-6">
                <div className="card card-pad">
                  <dt className="text-sm font-semibold text-ink-900">Do you support clients outside my state?</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-600">
                    AirTax Financial provides U.S.-focused support. Multi-state needs can be discussed during intake to
                    confirm scope.
                  </dd>
                </div>
                <div className="card card-pad">
                  <dt className="text-sm font-semibold text-ink-900">Do you offer Aviator Network discounts?</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-600">
                    Aviator Network promotional redemption is planned. If you have a code, use the redemption page to
                    begin.
                  </dd>
                </div>
                <div className="card card-pad">
                  <dt className="text-sm font-semibold text-ink-900">Is this legal or CPA advice?</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ink-600">
                    We do not present legal advice on this site. For complex matters, clients may need an attorney or
                    qualified tax professional. Engagement terms are confirmed in writing.
                  </dd>
                </div>
              </dl>
            </section>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <div className="card card-pad">
              <div className="eyebrow">Next steps</div>
              <h2 className="text-lg font-semibold tracking-tight text-ink-900 mt-3">Start with a focused service.</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                If you want clarity without unnecessary complexity, begin with one of the micro-services.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link className="btn-primary" href="/financial-services#services">
                  View services
                </Link>
                <Link className="btn-secondary" href="/about">
                  About AirTax Financial
                </Link>
              </div>
            </div>

            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">Scope note</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                This resource is educational and U.S.-focused. It is not individualized legal or tax advice.
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

