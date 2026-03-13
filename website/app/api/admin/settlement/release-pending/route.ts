import { NextResponse } from 'next/server'
import { requireInternalAuth } from '../../../../../lib/internalAuth'
import { manualReleasePending } from '../../../../../lib/preparerBalances'

type Body = { entryId?: string; reason?: string; performedBy?: string }

export async function POST(request: Request) {
  const authError = requireInternalAuth(request)
  if (authError) return authError

  try {
    const body = (await request.json().catch(() => ({}))) as Body
    const { entryId, reason, performedBy } = body

    const performedByTrimmed = performedBy?.trim()
    if (!entryId || !reason?.trim()) {
      return NextResponse.json(
        { error: 'Missing entryId or reason' },
        { status: 400 },
      )
    }
    if (!performedByTrimmed) {
      return NextResponse.json(
        { error: 'performedBy is required for audit. Provide the actor identifier (e.g. admin email).' },
        { status: 400 },
      )
    }

    const result = await manualReleasePending(entryId, {
      reason: reason.trim(),
      performedBy: performedByTrimmed,
    })

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Error manually releasing pending', err)
    return NextResponse.json(
      { error: 'Unable to perform manual release' },
      { status: 500 },
    )
  }
}
