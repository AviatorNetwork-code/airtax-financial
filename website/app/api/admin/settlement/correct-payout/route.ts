import { NextResponse } from 'next/server'
import { requireInternalAuth } from '../../../../../lib/internalAuth'
import { correctPayoutAmount } from '../../../../../lib/preparerBalances'

type Body = {
  preparerId?: string
  amountCents?: number
  reason?: string
  consultationId?: string
  performedBy?: string
}

export async function POST(request: Request) {
  const authError = requireInternalAuth(request)
  if (authError) return authError

  try {
    const body = (await request.json().catch(() => ({}))) as Body
    const { preparerId, amountCents, reason, consultationId, performedBy } = body

    const performedByTrimmed = performedBy?.trim()
    if (!preparerId || amountCents == null || !reason?.trim()) {
      return NextResponse.json(
        { error: 'Missing preparerId, amountCents, or reason' },
        { status: 400 },
      )
    }
    if (!performedByTrimmed) {
      return NextResponse.json(
        { error: 'performedBy is required for audit. Provide the actor identifier (e.g. admin email).' },
        { status: 400 },
      )
    }

    const result = await correctPayoutAmount(preparerId, Number(amountCents), {
      reason: reason.trim(),
      consultationId: consultationId?.trim() || undefined,
      performedBy: performedByTrimmed,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error correcting payout', err)
    return NextResponse.json(
      { error: 'Unable to correct payout' },
      { status: 500 },
    )
  }
}
