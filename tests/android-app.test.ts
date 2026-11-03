import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { isAndroidApp } from '@/lib/android-app'

function fakeBrowser(opts: { referrer?: string; standalone?: boolean; ua?: string; digitalGoods?: boolean; stored?: boolean }) {
  const store: Record<string, string> = opts.stored ? { sbn_android_app: '1' } : {}
  vi.stubGlobal('window', {
    sessionStorage: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => {
        store[k] = v
      },
    },
    matchMedia: () => ({ matches: !!opts.standalone }),
    ...(opts.digitalGoods ? { getDigitalGoodsService: () => ({}) } : {}),
  })
  vi.stubGlobal('document', { referrer: opts.referrer ?? '' })
  vi.stubGlobal('navigator', { userAgent: opts.ua ?? 'Mozilla/5.0 (Windows NT 10.0)' })
  return store
}

describe('isAndroidApp (are we inside the Google Play app?)', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('is false on the server (no window)', () => {
    expect(isAndroidApp()).toBe(false)
  })

  it('is false for a normal desktop browser', () => {
    fakeBrowser({})
    expect(isAndroidApp()).toBe(false)
  })

  it('is false for an ordinary Android phone browser tab', () => {
    fakeBrowser({ ua: 'Mozilla/5.0 (Linux; Android 14) Chrome/124', standalone: false })
    expect(isAndroidApp()).toBe(false)
  })

  it('is true when the Play app opened the page (android-app:// referrer), and remembers it', () => {
    const store = fakeBrowser({ referrer: 'android-app://app.vercel.plainnews.twa/' })
    expect(isAndroidApp()).toBe(true)
    expect(store.sbn_android_app).toBe('1')
  })

  it('stays true on later pages that no longer have the referrer', () => {
    fakeBrowser({ referrer: '', stored: true })
    expect(isAndroidApp()).toBe(true)
  })

  it('is true for an installed Android app window (standalone + Android)', () => {
    fakeBrowser({ standalone: true, ua: 'Mozilla/5.0 (Linux; Android 14)' })
    expect(isAndroidApp()).toBe(true)
  })

  it('is true when Google Play billing is available in the page', () => {
    fakeBrowser({ digitalGoods: true })
    expect(isAndroidApp()).toBe(true)
  })
})
