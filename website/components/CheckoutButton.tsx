'use client'

import { useState } from 'react'
import type { ServiceKey } from '../lib/services'

type Props = {
  serviceKey: ServiceKey
}

export function CheckoutButton({ serviceKey }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    if (loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceKey }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error ?? 'Unable to start payment.')
        setLoading(false)
        return
      }
      const data = (await res.json()) as { url?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Unable to start payment.')
        setLoading(false)
      }
    } catch {
      setError('Unable to start payment.')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={handleClick} className="btn-primary w-full" disabled={loading}>
        {loading ? 'Redirecting…' : 'Continue to payment'}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

