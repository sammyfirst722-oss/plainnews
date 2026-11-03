import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const { create } = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('stripe', () => ({
  default: class {
    checkout = { sessions: { create } }
  },
}))

import { POST } from '@/app/api/stripe/checkout/route'

function call(body: unknown, headers: Record<string, string> = {}) {
  return POST(
    new NextRequest('http://localhost/api/stripe/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'https://plainnews.vercel.app', ...headers },
      body: JSON.stringify(body),
    })
  )
}

describe('POST /api/stripe/checkout', () => {
  const oldKey = process.env.STRIPE_SECRET_KEY
  beforeEach(() => {
    create.mockReset()
    create.mockResolvedValue({ url: 'https://checkout.stripe.test/pay/cs_test_x' })
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
  })
  afterEach(() => {
    if (oldKey === undefined) delete process.env.STRIPE_SECRET_KEY
    else process.env.STRIPE_SECRET_KEY = oldKey
  })

  it('sells the monthly plan at $2.99 and tags the session as plainnews', async () => {
    const res = await call({ plan: 'monthly' })
    expect(res.status).toBe(200)
    expect((await res.json()).checkoutUrl).toContain('checkout.stripe.test')
    const arg = create.mock.calls[0][0]
    expect(arg.mode).toBe('subscription')
    expect(arg.metadata.app).toBe('plainnews')
    expect(arg.line_items[0].price_data.unit_amount).toBe(299)
    expect(arg.line_items[0].price_data.recurring.interval).toBe('month')
    expect(arg.success_url).toContain('session_id={CHECKOUT_SESSION_ID}')
  })

  it('sells the lifetime plan at $19.99 as a one-time payment (also the default)', async () => {
    for (const body of [{ plan: 'lifetime' }, {}]) {
      create.mockClear()
      const res = await call(body)
      expect(res.status).toBe(200)
      const arg = create.mock.calls[0][0]
      expect(arg.mode).toBe('payment')
      expect(arg.metadata.app).toBe('plainnews')
      expect(arg.line_items[0].price_data.unit_amount).toBe(1999)
    }
  })

  it('does not sell the gift pass or any unknown plan (nothing delivers a gift)', async () => {
    for (const plan of ['gift', 'weekly', 'free', '']) {
      const res = await call({ plan })
      expect(res.status).toBe(400)
    }
    expect(create).not.toHaveBeenCalled()
  })

  it('refuses card checkout inside the Android app (flag from the page)', async () => {
    const res = await call({ plan: 'monthly', isTwa: true })
    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.error).toBe('google_play_billing_required')
    expect(data.message).not.toMatch(/restore/i)
    expect(create).not.toHaveBeenCalled()
  })

  it('refuses card checkout inside the Android app (headers set by the app)', async () => {
    expect((await call({ plan: 'lifetime' }, { 'x-requested-with': 'app.vercel.plainnews.twa' })).status).toBe(403)
    expect((await call({ plan: 'lifetime' }, { referer: 'android-app://app.vercel.plainnews.twa/' })).status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it('answers 503 when Stripe is not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY
    const res = await call({ plan: 'lifetime' })
    expect(res.status).toBe(503)
    expect(create).not.toHaveBeenCalled()
  })
})
