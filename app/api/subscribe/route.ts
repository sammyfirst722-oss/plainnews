import { NextResponse } from 'next/server'
import { addSubscriber } from '@/lib/storage'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { email } = body

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    const result = addSubscriber(email.trim())

    return NextResponse.json({
      success: true,
      alreadySubscribed: result.alreadySubscribed,
      totalSubscribers: result.total,
      message: result.alreadySubscribed
        ? "You're already subscribed! Tomorrow's briefing lands at 7:00 AM."
        : "You're all set! Tomorrow's 2-minute briefing lands in your inbox at 7:00 AM.",
    })
  } catch (error) {
    console.error('[API Subscribe] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Could not complete subscription. Please try again.' },
      { status: 500 }
    )
  }
}
