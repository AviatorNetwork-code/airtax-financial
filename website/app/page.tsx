export default function Home() {
  return (
    <main>
      <section className="border-b border-navy/10 bg-surface">
        <div className="container-shell py-16 sm:py-24">
          <div className="max-w-3xl">
            <div className="eyebrow">Premium U.S. tax support • Aviation-aware</div>
            <h1 className="h1 mt-4">
              Calm, structured tax support for pilots and working professionals.
            </h1>
            <p className="lead mt-6 max-w-2xl">
              AirTax Financial provides professional tax preparation and focused paid services for IRS notices,
              estimated taxes, and deduction guidance—designed for aviation professionals and independent contractors in
              the United States.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" href="/financial-services">
                View Services
              </a>
              <a className="btn-secondary" href="/about">
                About AirTax Financial
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-shell py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="eyebrow">What we do</div>
              <h2 className="h2 mt-4">Practical services with a premium standard.</h2>
              <p className="lead mt-4">
                A disciplined process, clear scope, and a professional tone—without salesy gimmicks.
              </p>
            </div>
            <div className="grid gap-6 lg:col-span-7 sm:grid-cols-2">
              <div className="card card-pad">
                <div className="text-sm font-semibold text-ink-900">Individual Tax Filing</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  U.S. federal filing built for W-2 and 1099 income, with aviation-aware support where relevant.
                </p>
                <div className="mt-5 text-xs font-medium text-ink-500">Starting at $249</div>
              </div>
              <div className="card card-pad">
                <div className="text-sm font-semibold text-ink-900">IRS Letter Assistance</div>
                <p className="mt-3 text-sm leading-relaxed text-ink-600">
                  Plain-language review of notices and structured next-step guidance.
                </p>
                <div className="mt-5 text-xs font-medium text-ink-500">Year-round</div>
              </div>
              <div className="card card-pad sm:col-span-2">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-sm font-semibold text-ink-900">Micro-services</div>
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">
                      Simple paid services for estimates, notice reviews, and deduction checks—designed for fast,
                      professional outcomes.
                    </p>
                  </div>
                  <a href="/financial-services#services" className="link text-sm">
                    Explore →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
