import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'

const { retrieve } = vi.hoisted(() => ({ retrieve: vi.fn() }))
vi.mock('stripe', () => ({
  default: class {
    checkout = { sessions: { retrieve } }
  },
}))

import { POST } from '@/app/api/stripe/verify-session/route'

const SESSION_ID = 'cs_test_a1B2c3D4e5F6g7H8i9J0'
let ipCounter = 0

function call(body: unknown, ip?: string) {
  const req = new NextRequest('http://localhost/api/stripe/verify-session', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-real-ip': ip ?? `10.0.0.${++ipCounter}` },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })
  return POST(req)
}

const paid = () => ({
  mode: 'payment',
  status: 'complete',
  payment_status: 'paid',
  created: Math.floor(Date.now() / 1000) - 30,
  metadata: { app: 'plainnews', plan: 'lifetime' },
})

describe('POST /api/stripe/verify-session', () => {
  const oldKey = process.env.STRIPE_SECRET_KEY
  beforeEach(() => {
    retrieve.mockReset()
    process.env.STRIPE_SECRET_KEY = 'sk_test_dummy'
  })
  afterEach(() => {
    if (oldKey === undefined) delete process.env.STRIPE_SECRET_KEY
    else process.env.STRIPE_SECRET_KEY = oldKey
  })

  it('turns VIP on only when Stripe says this app session is paid', async () => {
    retrieve.mockResolvedValue(paid())
    const res = await call({ sessionId: SESSION_ID })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true, plan: 'lifetime' })
    expect(retrieve).toHaveBeenCalledWith(SESSION_ID)
  })

  it('refuses ids that are not Stripe checkout session ids, without calling Stripe', async () => {
    for (const bad of ['', 'abc', 'cs_test_short', 'pi_12345678901234567890', 'cs_live_<script>alert(1)</script>', 123, null]) {
      const res = await call({ sessionId: bad })
      expect(res.status).toBe(400)
    }
    expect((await call('not json at all')).status).toBe(400)
    expect(retrieve).not.toHaveBeenCalled()
  })

  it('answers 503 and never unlocks when Stripe is not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY
    const res = await call({ sessionId: SESSION_ID })
    expect(res.status).toBe(503)
    expect((await res.json()).ok).toBe(false)
  })

  it('refuses an unpaid session', async () => {
    retrieve.mockResolvedValue({ ...paid(), payment_status: 'unpaid', status: 'open' })
    const res = await call({ sessionId: SESSION_ID })
    expect(res.status).toBe(402)
    expect((await res.json()).ok).toBe(false)
  })

  it('refuses a paid session from a different app', async () => {
    retrieve.mockResolvedValue({ ...paid(), metadata: { app: 'snapchef' } })
    const res = await call({ sessionId: SESSION_ID })
    expect(res.status).toBe(402)
    expect((await res.json()).reason).toBe('wrong_app')
  })

  it('refuses when Stripe has no such session (it throws)', async () => {
    retrieve.mockRejectedValue(new Error('No such checkout.session'))
    const res = await call({ sessionId: SESSION_ID })
    expect(res.status).toBe(402)
    expect((await res.json()).ok).toBe(false)
  })

  it('slows down one address that keeps guessing (21st request in an hour gets 429)', async () => {
    retrieve.mockResolvedValue({ ...paid(), payment_status: 'unpaid' })
    let last = 0
    for (let i = 0; i < 21; i++) last = (await call({ sessionId: SESSION_ID }, '192.0.2.99')).status
    expect(last).toBe(429)
  })
})
