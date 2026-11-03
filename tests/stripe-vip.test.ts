import { describe, it, expect } from 'vitest'
import { checkVipSession } from '@/lib/stripe-vip'

const NOW = 1_800_000_000
const good = {
  mode: 'payment',
  status: 'complete',
  payment_status: 'paid',
  created: NOW - 60,
  metadata: { app: 'plainnews', plan: 'lifetime' },
}

describe('checkVipSession (server proof that SimplyBigNews VIP was really bought)', () => {
  it('accepts a paid lifetime session for this app', () => {
    expect(checkVipSession(good, NOW)).toEqual({ ok: true, plan: 'lifetime' })
  })

  it('accepts a completed, paid subscription session for this app', () => {
    expect(checkVipSession({ ...good, mode: 'subscription' }, NOW)).toEqual({ ok: true, plan: 'monthly' })
  })

  it('rejects a missing session', () => {
    expect(checkVipSession(null, NOW)).toEqual({ ok: false, reason: 'session_not_found' })
    expect(checkVipSession(undefined, NOW)).toEqual({ ok: false, reason: 'session_not_found' })
  })

  it('rejects an unpaid or unfinished session', () => {
    expect(checkVipSession({ ...good, payment_status: 'unpaid' }, NOW)).toEqual({ ok: false, reason: 'not_paid' })
    expect(checkVipSession({ ...good, status: 'open', payment_status: 'unpaid' }, NOW)).toEqual({ ok: false, reason: 'not_complete' })
    expect(checkVipSession({ ...good, status: 'expired' }, NOW)).toEqual({ ok: false, reason: 'not_complete' })
  })

  it('rejects a paid session that belongs to another app (all apps share one Stripe account)', () => {
    expect(checkVipSession({ ...good, metadata: { app: 'snapchef' } }, NOW)).toEqual({ ok: false, reason: 'wrong_app' })
    expect(checkVipSession({ ...good, metadata: { productType: 'letter' } }, NOW)).toEqual({ ok: false, reason: 'wrong_app' })
    expect(checkVipSession({ ...good, metadata: null }, NOW)).toEqual({ ok: false, reason: 'wrong_app' })
  })

  it('rejects an old session, and one with no creation time', () => {
    expect(checkVipSession({ ...good, created: NOW - 25 * 60 * 60 }, NOW)).toEqual({ ok: false, reason: 'session_expired' })
    expect(checkVipSession({ ...good, created: undefined }, NOW)).toEqual({ ok: false, reason: 'session_expired' })
  })

  it('rejects an unsupported mode', () => {
    expect(checkVipSession({ ...good, mode: 'setup' }, NOW)).toEqual({ ok: false, reason: 'unsupported_mode' })
  })
})
