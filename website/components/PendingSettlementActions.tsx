'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Entry = {
  id: string
  preparerId: string
  preparerName: string
  consultationId: string
  stripeSessionId: string | null
  type: 'CREDIT_PENDING' | 'HOLD'
  amountCents: number
  description: string
  occurredAt: string
}

type Props = {
  entries: Entry[]
}

function formatDollars(cents: number) {
  return (cents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  })
}

function maskId(id: string) {
  if (!id || id.length <= 10) return id
  return `${id.slice(0, 8)}…`
}

export function PendingSettlementActions({ entries }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [releaseFor, setReleaseFor] = useState<string | null>(null)
  const [resolveFor, setResolveFor] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [performedBy, setPerformedBy] = useState('')
  const [error, setError] = useState('')

  const doAction = async (
    endpoint: string,
    body: Record<string, unknown>,
    id: string,
  ) => {
    const payload = { ...body, performedBy: performedBy.trim() }
    setError('')
    setLoading(id)
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Action failed')
        return
      }
      setReleaseFor(null)
      setResolveFor(null)
      setReason('')
      router.refresh()
    } finally {
      setLoading(null)
    }
  }

  const handleRelease = (entry: Entry) => {
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }
    if (!performedBy.trim()) {
      setError('Performed by is required for audit')
      return
    }
    doAction(
      '/api/admin/settlement/release-pending',
      { entryId: entry.id, reason: reason.trim() },
      entry.id,
    )
  }

  const handleResolve = (entry: Entry) => {
    if (!reason.trim()) {
      setError('Reason is required')
      return
    }
    if (!performedBy.trim()) {
      setError('Performed by is required for audit')
      return
    }
    doAction(
      '/api/admin/settlement/resolve-hold',
      { entryId: entry.id, reason: reason.trim() },
      entry.id,
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="performedBy" className="text-[11px] font-medium text-ink-600">
          Performed by (audit):
        </label>
        <input
          id="performedBy"
          type="text"
          value={performedBy}
          onChange={(e) => setPerformedBy(e.target.value)}
          className="rounded border border-navy/15 px-2 py-1 text-[11px] w-32"
          placeholder="Required (e.g. admin@example.com)"
        />
      </div>
      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {error}
        </p>
      )}
      {entries.length === 0 ? (
        <p className="text-xs text-ink-500">No pending settlements.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li
              key={e.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-navy/10 bg-surface px-3 py-2 text-xs"
            >
              <div>
                <span className="font-mono text-ink-600">{maskId(e.id)}</span>
                <span className="ml-2 font-medium text-ink-700">{e.preparerName}</span>
                <span className="ml-2 text-ink-500">
                  {e.type === 'CREDIT_PENDING' ? 'Pending' : 'Hold'}
                </span>
                <span className="ml-2 font-semibold text-ink-800">
                  {formatDollars(e.amountCents)}
                </span>
                {e.consultationId && (
                  <span className="ml-2 text-ink-500">
                    consultation {maskId(e.consultationId)}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {e.type === 'CREDIT_PENDING' && (
                  <>
                    {releaseFor === e.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="Reason (required)"
                          className="rounded border border-navy/15 px-2 py-1 text-[11px] w-40"
                          value={reason}
                          onChange={(ev) => setReason(ev.target.value)}
                        />
                        <button
                          type="button"
                          className="rounded border border-navy/20 bg-navy px-2 py-1 text-[11px] font-medium text-white"
                          disabled={!!loading}
                          onClick={() => handleRelease(e)}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="rounded border border-navy/20 px-2 py-1 text-[11px]"
                          onClick={() => {
                            setReleaseFor(null)
                            setReason('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="rounded border border-navy/20 px-2 py-1 text-[11px] font-medium text-ink-700"
                        disabled={!!loading}
                        onClick={() => setReleaseFor(e.id)}
                      >
                        Release
                      </button>
                    )}
                  </>
                )}
                {e.type === 'HOLD' && (
                  <>
                    {resolveFor === e.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          placeholder="Reason (required)"
                          className="rounded border border-navy/15 px-2 py-1 text-[11px] w-40"
                          value={reason}
                          onChange={(ev) => setReason(ev.target.value)}
                        />
                        <button
                          type="button"
                          className="rounded border border-navy/20 bg-navy px-2 py-1 text-[11px] font-medium text-white"
                          disabled={!!loading}
                          onClick={() => handleResolve(e)}
                        >
                          Confirm
                        </button>
                        <button
                          type="button"
                          className="rounded border border-navy/20 px-2 py-1 text-[11px]"
                          onClick={() => {
                            setResolveFor(null)
                            setReason('')
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="rounded border border-navy/20 px-2 py-1 text-[11px] font-medium text-ink-700"
                        disabled={!!loading}
                        onClick={() => setResolveFor(e.id)}
                      >
                        Resolve hold
                      </button>
                    )}
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
