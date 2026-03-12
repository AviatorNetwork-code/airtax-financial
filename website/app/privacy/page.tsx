import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy | AirTax Financial',
  description: 'Privacy Policy for AirTax Financial and airtaxfinancial.com.',
}

export default function PrivacyPage() {
  return (
    <main className="bg-white">
      <section className="bg-surface border-b border-navy/10">
        <div className="container-shell py-14 sm:py-18">
          <div className="max-w-3xl">
            <div className="eyebrow">Legal</div>
            <h1 className="h1 mt-4">Privacy Policy</h1>
            <p className="lead mt-6">
              This page provides a structured placeholder privacy policy. It should be reviewed and finalized before
              launch.
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-16">
        <div className="max-w-3xl space-y-10">
          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">What We Collect</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              We may collect contact information you submit (such as name and email) and any information you provide as
              part of an intake or service request.
            </p>
            <p className="mt-3 text-xs text-ink-500">
              TODO(privacy): Define categories of tax information, file uploads, analytics data, and cookie usage.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">How We Use Information</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Information is used to respond to inquiries, deliver requested services, and improve the client experience.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Sharing</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              We do not sell personal information. We may share information with service providers required to operate
              the site and deliver services, subject to appropriate safeguards.
            </p>
            <p className="mt-3 text-xs text-ink-500">
              TODO(privacy): List providers (hosting, email, forms, payment processors) and legal bases.
            </p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Security</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              We aim to use reasonable administrative and technical controls to protect information, but no system is
              perfect. Clients should follow secure submission instructions when provided.
            </p>
            <p className="mt-3 text-xs text-ink-500">TODO(security): Define upload/retention policies and encryption.</p>
          </div>

          <div className="card card-pad">
            <h2 className="text-lg font-semibold text-ink-900">Your Choices</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              You may contact us to request access, correction, or deletion where applicable.
            </p>
            <p className="mt-3 text-xs text-ink-500">TODO(privacy): Add state privacy rights language as applicable.</p>
          </div>

          <div className="text-sm text-ink-600">
            <Link className="link" href="/terms">
              Terms of Service
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

