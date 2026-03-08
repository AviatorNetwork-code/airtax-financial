import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AirTax Financial | Tax & Financial Services for Aviation Professionals',
  description: 'Professional tax preparation and financial services for pilots, flight instructors, and aviation professionals. Navigate tax season with confidence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-white text-primary-800 antialiased">
        {children}
      </body>
    </html>
  )
}
