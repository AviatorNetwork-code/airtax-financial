'use client'

import { useState } from 'react'
import type { ServiceKey } from '../lib/services'

type Props = {
  serviceKey: ServiceKey
  stripeSessionId?: string
}

export function ServiceIntakeForm({ serviceKey, stripeSessionId }: Props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/service-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceKey,
          name,
          email,
          phone,
          message,
          stripeSessionId,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Unable to submit request.')
        setSubmitting(false)
        return
      }
      setSubmitted(true)
      setSubmitting(false)
    } catch {
      setError('Unable to submit request.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
      <label className="grid gap-2 text-sm">
        <span className="text-ink-700">Full name</span>
        <input
          className="rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy/40"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-ink-700">Email</span>
        <input
          className="rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy/40"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="grid gap-2 text-sm">
        <span className="text-ink-700">Phone (optional)</span>
        <input
          className="rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy/40"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </label>
      <label className="grid gap-2 text-sm sm:col-span-2">
        <span className="text-ink-700">Brief summary</span>
        <textarea
          className="min-h-[140px] rounded-md border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-navy/40"
          placeholder="A short description of what you need and relevant context."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </label>

      {/* Document upload scaffold */}
      <label className="grid gap-2 text-sm sm:col-span-2">
        <span className="text-ink-700">Supporting documents (optional)</span>
        <input
          type="file"
          multiple
          className="rounded-md border border-dashed border-navy/20 bg-surface px-4 py-3 text-sm text-ink-600"
        />
        <span className="text-[11px] text-ink-500">
          TODO(storage): Implement secure upload to encrypted storage with limited retention. Do not rely on basic file
          uploads in production.
        </span>
      </label>

      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary" disabled={submitting || submitted}>
          {submitted ? 'Request submitted' : submitting ? 'Submitting…' : 'Submit request'}
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
        {!error && submitted && (
          <p className="text-xs text-ink-500">Thank you — we will review your request and follow up.</p>
        )}
      </div>
    </form>
  )
}

