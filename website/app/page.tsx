import Link from 'next/link'

export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-primary-600/20 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight text-primary-900">
            AirTax Financial
          </Link>
          <nav className="flex items-center gap-8">
            <Link href="#services" className="text-sm font-medium text-primary-700 hover:text-accent-500 transition-colors">
              Services
            </Link>
            <Link href="#contact" className="text-sm font-medium text-primary-700 hover:text-accent-500 transition-colors">
              Contact
            </Link>
            <Link
              href="#contact"
              className="rounded-md bg-primary-900 px-4 py-2 text-sm font-medium text-white hover:bg-primary-800 transition-colors"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-24 sm:pt-40 sm:pb-32">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-accent-500">
              Tax & Financial Services for Aviation Professionals
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-primary-900 sm:text-5xl lg:text-6xl">
              Navigate Tax Season with Confidence
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-primary-600">
              Professional preparation and e-filing of U.S. federal returns. Built for pilots, flight instructors, and aviation professionals who expect precision.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-md bg-primary-900 px-6 py-3 text-base font-medium text-white hover:bg-primary-800 transition-colors"
              >
                Schedule a Discovery Call
              </Link>
              <Link
                href="#services"
                className="inline-flex items-center justify-center rounded-md border border-primary-300 px-6 py-3 text-base font-medium text-primary-800 hover:bg-primary-50 transition-colors"
              >
                View Services
              </Link>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section id="services" className="border-t border-primary-200 bg-primary-50/50 py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
                Services
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-600">
                Specialized tax and financial support for aviation professionals and U.S. taxpayers.
              </p>
            </div>
            <div className="mt-16 grid gap-8 sm:grid-cols-2">
              <div className="rounded-xl border border-primary-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-primary-900">
                  Individual Tax Filing
                </h3>
                <p className="mt-3 text-primary-600">
                  Professional preparation and e-filing of U.S. federal returns. W-2, 1099, multi-income. Optimized for pilots and flight instructors.
                </p>
                <p className="mt-4 text-sm font-medium text-accent-500">
                  From $249 · Aviator Network discount available
                </p>
                <Link
                  href="#contact"
                  className="mt-6 inline-block text-sm font-medium text-primary-800 hover:text-accent-500 transition-colors"
                >
                  Get started →
                </Link>
              </div>
              <div className="rounded-xl border border-primary-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-primary-900">
                  IRS Letter Assistance
                </h3>
                <p className="mt-3 text-primary-600">
                  Understand and respond to IRS notices—CP2000, verification requests, refund delays. Guided support when you need it.
                </p>
                <p className="mt-4 text-sm font-medium text-primary-600">
                  Year-round support
                </p>
                <Link
                  href="#contact"
                  className="mt-6 inline-block text-sm font-medium text-primary-800 hover:text-accent-500 transition-colors"
                >
                  Discuss your situation →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="contact" className="py-24">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight text-primary-900 sm:text-4xl">
              Ready to Get Started?
            </h2>
            <p className="mt-4 text-lg text-primary-600">
              Schedule a discovery call or reach out to discuss your tax needs.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="mailto:contact@airtaxfinancial.com"
                className="inline-flex items-center rounded-md bg-primary-900 px-6 py-3 text-base font-medium text-white hover:bg-primary-800 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-primary-200 bg-primary-900 py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="text-white font-semibold">AirTax Financial</div>
            <nav className="flex gap-8 text-sm">
              <Link href="#services" className="text-primary-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="#contact" className="text-primary-300 hover:text-white transition-colors">
                Contact
              </Link>
            </nav>
          </div>
          <p className="mt-8 text-center text-sm text-primary-400">
            © {new Date().getFullYear()} AirTax Financial. Professional tax preparation for aviation professionals.
          </p>
        </div>
      </footer>
    </>
  )
}
