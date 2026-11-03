// Decides whether a Stripe Checkout Session is real proof that SimplyBigNews VIP was bought.
// Pure function (no network). All apps share one Stripe account, so metadata.app must match.

export const VIP_APP_ID = 'plainnews'
export const MAX_SESSION_AGE_SECONDS = 24 * 60 * 60

export interface VipSessionLike {
  mode?: string | null
  status?: string | null
  payment_status?: string | null
  created?: number
  metadata?: Record<string, string> | null
}

export type VipCheck = { ok: true; plan: 'monthly' | 'lifetime' } | { ok: false; reason: string }

export function checkVipSession(s: VipSessionLike | null | undefined, nowSeconds: number): VipCheck {
  if (!s) return { ok: false, reason: 'session_not_found' }
  if (s.metadata?.app !== VIP_APP_ID) return { ok: false, reason: 'wrong_app' }
  if (s.status !== 'complete') return { ok: false, reason: 'not_complete' }
  if (s.payment_status !== 'paid') return { ok: false, reason: 'not_paid' }
  if (s.mode !== 'payment' && s.mode !== 'subscription') return { ok: false, reason: 'unsupported_mode' }
  if (typeof s.created !== 'number' || nowSeconds - s.created > MAX_SESSION_AGE_SECONDS) {
    return { ok: false, reason: 'session_expired' }
  }
  return { ok: true, plan: s.mode === 'subscription' ? 'monthly' : 'lifetime' }
}
