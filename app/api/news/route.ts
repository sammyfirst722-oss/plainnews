import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { fetchLiveNews } from '@/lib/news-fetcher'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || 'all'
    const forceRefresh = searchParams.get('refresh') === 'true'

    const allStories = await fetchLiveNews(forceRefresh)

    let filtered = allStories
    if (category !== 'all') {
      filtered = allStories.filter((s) => s.category === category)
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      timestamp: new Date().toISOString(),
      stories: filtered,
    })
  } catch (err: unknown) {
    Sentry.captureException(err, {
      tags: { route: 'api/news' },
    })
    const message = err instanceof Error ? err.message : 'Failed to fetch news'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
