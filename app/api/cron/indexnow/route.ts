import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const INDEXNOW_KEY = 'f7b3a192c8104ebfae9231dbfe862d14'
const DEFAULT_HOST = 'plainnews.vercel.app'

export async function GET(req: NextRequest) {
  // Verify Vercel Cron Secret if configured
  const authHeader = req.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const host = req.headers.get('host') || DEFAULT_HOST

    const urls = [
      `https://${host}/`,
      `https://${host}/sitemap.xml`,
      `https://${host}/robots.txt`,
      `https://${host}/privacy`,
      `https://${host}/terms`,
    ]

    const payload = {
      host,
      key: INDEXNOW_KEY,
      keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }

    const response = await fetch('https://api.indexnow.org/IndexNow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify(payload),
    })

    const success = response.status >= 200 && response.status < 300

    return NextResponse.json({
      success,
      submittedUrls: urls.length,
      status: response.status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('[Graveyard Shift IndexNow PlainNews Error]:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown cron error',
      },
      { status: 500 }
    )
  }
}
