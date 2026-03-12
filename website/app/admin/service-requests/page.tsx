import type { Metadata } from 'next'
import { listRecentServiceRequests } from '../../../lib/serviceRequests'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Service Requests | AirTax Financial (Internal)',
  description: 'Internal view of recent service requests.',
}

export default async function ServiceRequestsAdminPage() {
  const rows = await listRecentServiceRequests(50)

  return (
    <main className="bg-white">
      <section className="border-b border-navy/10 bg-surface">
        <div className="container-shell py-10 sm:py-12">
          <h1 className="h2">Service requests</h1>
          <p className="mt-3 text-sm text-ink-600">
            Internal view. TODO(auth): Protect this route with authentication before exposing in production.
          </p>
        </div>
      </section>
      <section className="container-shell py-10">
        <div className="overflow-x-auto rounded-lg border border-navy/10 bg-white">
          <table className="min-w-full text-left text-xs">
            <thead className="border-b border-navy/10 bg-surface text-ink-600">
              <tr>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Stripe session</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-navy/5 last:border-0">
                  <td className="px-4 py-3 text-ink-600">{r.createdAt}</td>
                  <td className="px-4 py-3 text-ink-700">{r.serviceKey}</td>
                  <td className="px-4 py-3 text-ink-700">{r.customerName}</td>
                  <td className="px-4 py-3 text-ink-600">{r.email}</td>
                  <td className="px-4 py-3 text-ink-700">{r.paymentStatus}</td>
                  <td className="px-4 py-3 text-ink-500">{r.stripeSessionId ?? '—'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-ink-500" colSpan={6}>
                    No service requests recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

