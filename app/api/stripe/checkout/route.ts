import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

function isAndroidTwa(req: NextRequest, bodyIsTwa?: boolean): boolean {
  if (bodyIsTwa) return true
  const xRequestedWith = (req.headers.get('x-requested-with') || '').toLowerCase()
  if (xRequestedWith.includes('plainnews') || xRequestedWith.includes('twa')) return true
  const referer = (req.headers.get('referer') || '').toLowerCase()
  if (referer.includes('android-app://')) return true
  return false
}

export async function POST(req: NextRequest) {
  try {
    const { plan = 'lifetime', isTwa = false } = await req.json().catch(() => ({}))

    // Google Play Policy 3.1 Guard: Disallow external Stripe credit card checkout inside Android app
    if (isAndroidTwa(req, isTwa)) {
      return NextResponse.json(
        {
          error: 'google_play_billing_required',
          message: 'In-app digital purchases on Android must use Google Play Store billing. Please restore your purchase with your email or use the website.',
          isAndroidApp: true,
        },
        { status: 403 }
      )
    }

    const rawKey = process.env.STRIPE_SECRET_KEY || ''
    const stripeKey = rawKey.trim().replace(/[\r\n"']/g, '')

    if (!stripeKey) {
      return NextResponse.json(
        { error: 'Stripe checkout is not configured yet.' },
        { status: 503 }
      )
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2024-04-10' as any,
    })

    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const lineItems =
      plan === 'monthly'
        ? [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'SimplyBigNews VIP Supporter (Monthly)',
                  description: 'Ad-Free Reading, Unlimited AI 8th-Grade News Simplifier, Morning Audio Briefing',
                },
                unit_amount: 299, // $2.99
                recurring: {
                  interval: 'month' as const,
                },
              },
              quantity: 1,
            },
          ]
        : [
            {
              price_data: {
                currency: 'usd',
                product_data: {
                  name: 'SimplyBigNews VIP Lifetime Pass',
                  description: 'Pay once, enjoy SimplyBigNews Ad-Free & Unlimited AI forever',
                },
                unit_amount: 1999, // $19.99
              },
              quantity: 1,
            },
          ]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: plan === 'monthly' ? 'subscription' : 'payment',
      line_items: lineItems,
      success_url: `${origin}/?upgraded=true`,
      cancel_url: `${origin}/?canceled=true`,
    })

    return NextResponse.json({ checkoutUrl: session.url })
  } catch (err: any) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
