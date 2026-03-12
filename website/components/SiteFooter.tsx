import Link from 'next/link'

const columns = [
  {
    title: 'Services',
    links: [
      { href: '/financial-services', label: 'Financial Services' },
      { href: '/financial-services#services', label: 'Micro-services' },
      { href: '/financial-services#full-filing', label: 'Full Tax Filing' },
      { href: '/aviator-redeem', label: 'Aviator Network Redemption' },
    ],
  },
  {
    title: 'Financial Resources',
    links: [
      {
        href: '/financial-services-tax-information-pilots-aviation-employees',
        label: 'Tax information for pilots',
      },
    ],
  },
  {
    title: 'About',
    links: [
      { href: '/about', label: 'About AirTax Financial' },
      { href: '/financial-services#get-started', label: 'Contact' },
    ],
  },
  {
    title: 'Terms',
    links: [
      { href: '/terms', label: 'Terms of Service' },
      { href: '/privacy', label: 'Privacy Policy' },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-white">
      <div className="container-shell py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="text-base font-semibold tracking-tight">AirTax Financial</div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/70">
              Navigate Tax Season with Confidence.
            </p>

            <div className="mt-6 space-y-1 text-sm text-white/70">
              <div>
                <a className="hover:text-white" href="https://airtaxfinancial.com">
                  airtaxfinancial.com
                </a>
              </div>
              <div>
                <a className="hover:text-white" href="https://northbridgeventuregroup.com">
                  northbridgeventuregroup.com
                </a>
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="lg:col-span-1">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-white/60">{col.title}</div>
              <ul className="mt-4 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/80 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-xs leading-relaxed text-white/60">
          <p>
            AirTax Financial is a service brand operated by Northbridge Venture Group LLC, a Florida limited liability
            company.
          </p>
          <p className="mt-2">© 2026 Northbridge Venture Group LLC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

