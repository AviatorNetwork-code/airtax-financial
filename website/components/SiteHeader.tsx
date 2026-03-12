import Link from 'next/link'

const nav = [
  { href: '/financial-services', label: 'Services' },
  { href: '/financial-services-tax-information-pilots-aviation-employees', label: 'Resources' },
  { href: '/about', label: 'About' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/90 backdrop-blur">
      <div className="container-shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="text-[15px] font-semibold tracking-tight text-navy">AirTax Financial</span>
          <span className="hidden text-[11px] font-medium tracking-[0.14em] text-ink-500 sm:inline">
            Navigate Tax Season with Confidence
          </span>
        </Link>

        <nav className="hidden items-center gap-8 sm:flex" aria-label="Primary">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-ink-700 hover:text-navy">
              {item.label}
            </Link>
          ))}
          <Link href="/financial-services#get-started" className="btn-primary px-4 py-2">
            Get Started
          </Link>
        </nav>

        <Link href="/financial-services#get-started" className="btn-primary px-4 py-2 sm:hidden">
          Get Started
        </Link>
      </div>
    </header>
  )
}

