import { describe, it, expect, vi, beforeEach } from 'vitest'

// Never touch the real subscriber file: fake the disk and the subscriber list.
const { writeFileSync, getSubscribers } = vi.hoisted(() => ({
  writeFileSync: vi.fn(),
  getSubscribers: vi.fn(),
}))
vi.mock('fs', () => ({
  default: { existsSync: vi.fn(() => true), writeFileSync },
  existsSync: vi.fn(() => true),
  writeFileSync,
}))
vi.mock('@/lib/storage', () => ({ getSubscribers }))

import { GET, POST } from '@/app/api/unsubscribe/route'

const HOSTILE = '<script>alert(1)</script>"><img src=x onerror=alert(2)>'

beforeEach(() => {
  writeFileSync.mockReset()
  getSubscribers.mockReset()
  getSubscribers.mockReturnValue([{ email: 'a@example.com' }, { email: 'B@Example.com' }, { email: 'c@example.com' }])
})

describe('unsubscribe page', () => {
  it('never prints the visitor-supplied email into the HTML (form post)', async () => {
    const form = new URLSearchParams({ email: HOSTILE })
    const res = await POST(new Request('http://localhost/api/unsubscribe', { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form }))
    const html = await res.text()
    expect(res.status).toBe(200)
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
    expect(html).not.toContain(HOSTILE)
  })

  it('never prints the visitor-supplied email into the HTML (json post)', async () => {
    const res = await POST(new Request('http://localhost/api/unsubscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: HOSTILE }) }))
    const html = await res.text()
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
  })

  it('never prints the email from the address bar (GET)', async () => {
    const res = await GET(new Request('http://localhost/api/unsubscribe?email=' + encodeURIComponent(HOSTILE)))
    const html = await res.text()
    expect(html).not.toContain('<script')
    expect(html).not.toContain('onerror')
    expect(html).toContain('unsubscribed')
  })

  it('serves a plain form when no email is given', async () => {
    const res = await GET(new Request('http://localhost/api/unsubscribe'))
    expect(await res.text()).toContain('<form')
  })

  it('removes only the matching address, ignoring upper/lower case and spaces', async () => {
    await POST(new Request('http://localhost/api/unsubscribe', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email: '  b@example.COM ' }) }))
    expect(writeFileSync).toHaveBeenCalledTimes(1)
    const saved = JSON.parse(writeFileSync.mock.calls[0][1])
    expect(saved.map((s: { email: string }) => s.email)).toEqual(['a@example.com', 'c@example.com'])
  })
})
