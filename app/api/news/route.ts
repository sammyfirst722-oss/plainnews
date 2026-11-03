import { NextRequest, NextResponse } from 'next/server'
import { fetchLiveNews } from '@/lib/news-fetcher'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category') || 'all'
    // Forcing a refresh triggers many paid AI rewrites, so only a caller holding the cron secret may do it.
    // Everyone else gets the cached list, which refreshes itself when its timer runs out.
    const cronSecret = process.env.CRON_SECRET
    const isTrustedCaller = !!cronSecret && req.headers.get('authorization') === `Bearer ${cronSecret}`
    const forceRefresh = searchParams.get('refresh') === 'true' && isTrustedCaller

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
    const message = err instanceof Error ? err.message : 'Failed to fetch news'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
