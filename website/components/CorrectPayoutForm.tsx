'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Preparer } from '../lib/preparerBalances'

type Props = {
  preparers?: Preparer[]
}

export function CorrectPayoutForm({ preparers = [] }: Props) {
  const router = useRouter()
  const [preparerId, setPreparerId] = useState('')
  const [amountCents, setAmountCents] = useState('')
  const [reason, setReason] = useState('')
  const [consultationId, setConsultationId] = useState('')
  const [performedBy, setPerformedBy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const cents = Math.round(parseFloat(amountCents) * 100)
    if (Number.isNaN(cents) || cents === 0) {
      setError('Enter a valid amount (e.g. 10.00 or -5.00)')
      return
    }
    if (!preparerId.trim() || !reason.trim()) {
      setError('Preparer and reason are required')
      return
    }
    if (!performedBy.trim()) {
      setError('Performed by is required for audit')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/settlement/correct-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preparerId: preparerId.trim(),
          amountCents: cents,
          reason: reason.trim(),
          consultationId: consultationId.trim() || undefined,
          performedBy: performedBy.trim(),
        }),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Correction failed')
        return
      }
      setPreparerId('')
      setAmountCents('')
      setReason('')
      setConsultationId('')
      setPerformedBy('')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs">
      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-2 py-1.5 text-red-700">
          {error}
        </p>
      )}
      <div>
        <label htmlFor="preparerId" className="block font-medium text-ink-700">
          Preparer
        </label>
        {preparers.length > 0 ? (
          <select
            id="preparerId"
            value={preparerId}
            onChange={(e) => setPreparerId(e.target.value)}
            className="mt-1 w-full rounded border border-navy/15 px-2 py-1.5 text-ink-800"
            required
          >
            <option value="">Select preparer</option>
            {preparers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.email})
              </option>
            ))}
          </select>
        ) : (
          <input
            id="preparerId"
            type="text"
            value={preparerId}
            onChange={(e) => setPreparerId(e.target.value)}
            className="mt-1 w-full rounded border border-navy/15 px-2 py-1.5"
            placeholder="preparer-uuid"
            required
          />
        )}
      </div>
      <div>
        <label htmlFor="amountCents" className="block font-medium text-ink-700">
          Amount (dollars, + or -)
        </label>
        <input
          id="amountCents"
          type="text"
          value={amountCents}
          onChange={(e) => setAmountCents(e.target.value)}
          className="mt-1 w-full rounded border border-navy/15 px-2 py-1.5"
          placeholder="10.00 or -5.00"
          required
        />
      </div>
      <div>
        <label htmlFor="reason" className="block font-medium text-ink-700">
          Reason (required for audit)
        </label>
        <input
          id="reason"
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 w-full rounded border border-navy/15 px-2 py-1.5"
          placeholder="e.g. Stripe refund; wrong fee recorded"
          required
        />
      </div>
      <div>
        <label htmlFor="consultationId" className="block font-medium text-ink-700">
          Consultation ID (optional)
        </label>
        <input
          id="consultationId"
          type="text"
          value={consultationId}
          onChange={(e) => setConsultationId(e.target.value)}
          className="mt-1 w-full rounded border border-navy/15 px-2 py-1.5"
          placeholder="consultation-uuid"
        />
      </div>
      <div>
        <label htmlFor="performedBy" className="block font-medium text-ink-700">
          Performed by (required for audit)
        </label>
        <input
          id="performedBy"
          type="text"
          value={performedBy}
          onChange={(e) => setPerformedBy(e.target.value)}
          className="mt-1 w-full rounded border border-navy/15 px-2 py-1.5"
          placeholder="e.g. admin@example.com"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-xs"
      >
        {loading ? '…' : 'Apply correction'}
      </button>
    </form>
  )
}
