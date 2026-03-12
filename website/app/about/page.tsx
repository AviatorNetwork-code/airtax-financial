import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About AirTax Financial',
  description:
    'A modern financial services brand built for clarity, trust, and specialized support for aviation professionals and U.S. taxpayers.',
}

const values = [
  {
    title: 'Clarity',
    body: 'Clear scope, plain-language guidance, and a disciplined process.',
  },
  {
    title: 'Trust',
    body: 'Measured communication and conservative, professional standards.',
  },
  {
    title: 'Professionalism',
    body: 'A premium service experience without gimmicks or hype language.',
  },
  {
    title: 'Confidentiality',
    body: 'Respect for personal information and structured handling expectations.',
  },
  {
    title: 'Industry understanding',
    body: 'Aviation-aware context—presented subtly, intelligently, and respectfully.',
  },
]

export default function AboutPage() {
  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="eyebrow">About</div>
            <h1 className="h1 mt-4">About AirTax Financial</h1>
            <p className="lead mt-6">
              A modern financial services brand built for clarity, trust, and specialized support.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7 space-y-10">
            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Why AirTax Financial exists</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Many tax experiences feel generic—optimized for volume, not understanding. Aviation professionals and
                specialized workers often face unique schedules, income structures, and documentation realities. AirTax
                Financial was created to offer a more structured, more professional experience: clear scope, calm
                communication, and disciplined execution.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                We remain aviation-aware, but finance-first. The objective is simple: help clients make clean decisions,
                reduce unnecessary risk, and move forward with confidence.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Mission</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Our mission is to provide clear, trustworthy, and highly professional tax and financial support for
                pilots, aviation professionals, military families, and working individuals who value structure,
                confidentiality, and competent service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold tracking-tight text-ink-900">Vision</h2>
              <p className="mt-4 text-sm leading-relaxed text-ink-600">
                Our vision is to become a trusted financial brand for specialized professional communities by combining
                modern digital service, disciplined execution, and a deep respect for the people we serve.
              </p>
            </section>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <div className="card card-pad">
              <div className="eyebrow">Values</div>
              <div className="mt-5 space-y-4">
                {values.map((v) => (
                  <div key={v.title} className="rounded-md border border-navy/10 bg-white p-5">
                    <div className="text-sm font-semibold text-ink-900">{v.title}</div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">{v.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card card-pad">
              <div className="text-sm font-semibold text-ink-900">Next step</div>
              <p className="mt-3 text-sm leading-relaxed text-ink-600">
                Start with a focused service, or discuss full filing needs with clear scope and expectations.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link className="btn-primary" href="/financial-services">
                  View Services
                </Link>
                <Link className="btn-secondary" href="/financial-services#get-started">
                  Contact
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

