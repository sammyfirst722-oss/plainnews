import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const { fetchLiveNews } = vi.hoisted(() => ({ fetchLiveNews: vi.fn() }))
vi.mock('@/lib/news-fetcher', () => ({ fetchLiveNews }))

import { GET } from '@/app/api/news/route'

function call(query: string, authorization?: string) {
  const headers: Record<string, string> = {}
  if (authorization !== undefined) headers.authorization = authorization
  return GET(new NextRequest('http://localhost/api/news' + query, { headers }))
}

describe('GET /api/news?refresh=true (a forced refresh costs paid AI rewrites)', () => {
  const oldSecret = process.env.CRON_SECRET
  beforeEach(() => {
    fetchLiveNews.mockReset()
    fetchLiveNews.mockResolvedValue([{ id: '1', category: 'us-world' }, { id: '2', category: 'tech' }])
    process.env.CRON_SECRET = 'top-secret-value'
  })
  afterEach(() => {
    if (oldSecret === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = oldSecret
  })

  it('a stranger asking for refresh=true gets the cached list, not a refresh', async () => {
    const res = await call('?refresh=true')
    expect(res.status).toBe(200)
    expect(fetchLiveNews).toHaveBeenCalledWith(false)
  })

  it('a wrong password does not force a refresh', async () => {
    await call('?refresh=true', 'Bearer not-the-secret')
    expect(fetchLiveNews).toHaveBeenCalledWith(false)
  })

  it('the cron secret does force a refresh', async () => {
    await call('?refresh=true', 'Bearer top-secret-value')
    expect(fetchLiveNews).toHaveBeenCalledWith(true)
  })

  it('the secret alone, without refresh=true, does not refresh', async () => {
    await call('', 'Bearer top-secret-value')
    expect(fetchLiveNews).toHaveBeenCalledWith(false)
  })

  it('when the secret is not set, "Bearer undefined" does NOT open the gate', async () => {
    delete process.env.CRON_SECRET
    await call('?refresh=true', 'Bearer undefined')
    expect(fetchLiveNews).toHaveBeenCalledWith(false)
    await call('?refresh=true', 'Bearer ')
    expect(fetchLiveNews).toHaveBeenLastCalledWith(false)
  })

  it('still filters by category', async () => {
    const res = await call('?category=tech')
    const data = await res.json()
    expect(data.count).toBe(1)
    expect(data.stories[0].id).toBe('2')
  })
})
