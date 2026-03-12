import type { Metadata } from 'next'
import './globals.css'
import { SiteFooter } from '../components/SiteFooter'
import { SiteHeader } from '../components/SiteHeader'

export const metadata: Metadata = {
  title: 'AirTax Financial | Premium Tax Support for Aviation Professionals',
  description:
    'A boutique tax and financial services brand built for pilots and aviation professionals. Calm, structured support for filing, notices, and essential tax guidance in the United States.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-ink-800 antialiased">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
