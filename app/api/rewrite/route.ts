import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { rewriteArticleToPlainEnglish } from '@/lib/plain-rewriter'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { text, headline } = body

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Article text is required.' },
        { status: 400 }
      )
    }

    const result = await rewriteArticleToPlainEnglish(text, headline)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (err: unknown) {
    Sentry.captureException(err, {
      tags: { route: 'api/rewrite' },
    })
    const message = err instanceof Error ? err.message : 'Rewriting error'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
