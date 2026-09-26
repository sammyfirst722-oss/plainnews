import { NextResponse } from 'next/server'
import { getArchivedStories, getSubscribers } from '@/lib/storage'
import { fetchLiveNews } from '@/lib/news-fetcher'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  return handleBriefing(request)
}

export async function POST(request: Request) {
  return handleBriefing(request)
}

async function handleBriefing(request: Request) {
  try {
    // Optional cron secret protection
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // In production with CRON_SECRET configured, require auth
      const url = new URL(request.url)
      const queryKey = url.searchParams.get('key')
      if (queryKey !== cronSecret) {
        return NextResponse.json({ error: 'Unauthorized cron request' }, { status: 401 })
      }
    }

    // Get stories
    let stories = getArchivedStories()
    if (!stories || stories.length === 0) {
      stories = await fetchLiveNews(false)
    }

    // Top 3 stories
    const topStories = stories.slice(0, 3)
    const subscribers = getSubscribers()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://plainnews.vercel.app'
    const todayFormatted = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })

    // Build plain text and HTML email
    const subject = `SimplyBigNews: 2-Minute Daily Briefing for ${todayFormatted}`

    const htmlStories = topStories
      .map(
        (story, index) => `
        <div style="margin-bottom: 28px; padding: 20px; border-radius: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; font-weight: 800; color: #059669; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px;">
            Story #${index + 1} • ${story.categoryLabel}
          </div>
          <h2 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 12px 0; line-height: 1.3;">
            ${story.simplifiedTitle}
          </h2>
          <div style="padding: 12px; background-color: #ecfdf5; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 14px;">
            <strong style="color: #065f46; font-size: 13px;">THE BIG PICTURE:</strong>
            <p style="margin: 4px 0 0 0; color: #064e3b; font-size: 15px; line-height: 1.4;">${story.bigPicture}</p>
          </div>
          <ul style="margin: 0 0 14px 0; padding-left: 20px; color: #334155; font-size: 14px; line-height: 1.6;">
            ${story.whatHappened.map((pt) => `<li style="margin-bottom: 6px;">${pt}</li>`).join('')}
          </ul>
          <div style="font-size: 13px; color: #64748b; margin-bottom: 12px;">
            <strong>Why it matters:</strong> ${story.whyItMatters}
          </div>
          <a href="${appUrl}/story/${story.slug}" style="display: inline-block; font-size: 13px; font-weight: 700; color: #059669; text-decoration: none;">
            Read full story & listen aloud →
          </a>
        </div>
      `
      )
      .join('')

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 20px 0; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #059669 0%, #0f766e 100%); padding: 32px 24px; text-align: center; color: #ffffff;">
            <h1 style="margin: 0; font-size: 26px; font-weight: 900; letter-spacing: -0.02em;">SimplyBigNews</h1>
            <p style="margin: 8px 0 0 0; font-size: 14px; color: #a7f3d0; font-weight: 600;">The 2-Minute Morning Briefing</p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #ecfdf5;">${todayFormatted}</p>
          </div>
          <div style="padding: 24px;">
            <p style="font-size: 15px; color: #334155; line-height: 1.5; margin-top: 0;">
              Good morning! Here are the 3 most interesting and important news stories today, broken down into plain, everyday English.
            </p>
            ${htmlStories}
          </div>
          <div style="padding: 20px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.5;">
            <p style="margin: 0 0 6px 0;">You are receiving this because you subscribed to the SimplyBigNews 2-Minute Daily Briefing.</p>
            <p style="margin: 0 0 6px 0;">Sammy First LLC • 1209 Orange St, Wilmington, DE 19801</p>
            <p style="margin: 0;"><a href="${appUrl}/api/unsubscribe" style="color: #64748b; text-decoration: underline;">Unsubscribe anytime</a></p>
          </div>
        </div>
      </body>
      </html>
    `

    // Check if Resend or email provider key is configured
    const resendApiKey = process.env.RESEND_API_KEY
    let sendResult = { sentCount: 0, status: 'mock_preview_only' }

    if (resendApiKey && subscribers.length > 0) {
      // Send live batch via Resend API
      try {
        const emailAddresses = subscribers.map((s) => s.email)
        const res = await fetch('https://api.resend.com/emails/batch', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            emailAddresses.map((to) => ({
              from: 'SimplyBigNews <daily@simplybignews.com>',
              to,
              subject,
              html: emailHtml,
            }))
          ),
        })

        if (res.ok) {
          sendResult = { sentCount: subscribers.length, status: 'sent_live' }
        } else {
          console.error('[Daily Briefing] Resend API error:', await res.text())
          sendResult = { sentCount: 0, status: 'provider_error' }
        }
      } catch (err) {
        console.error('[Daily Briefing] Failed to send emails:', err)
        sendResult = { sentCount: 0, status: 'network_error' }
      }
    }

    return NextResponse.json({
      success: true,
      date: todayFormatted,
      storiesIncluded: topStories.length,
      subscribersCount: subscribers.length,
      sendResult,
      preview: {
        subject,
        topStoryTitles: topStories.map((s) => s.simplifiedTitle),
      },
    })
  } catch (error) {
    console.error('[Daily Briefing] Cron failed:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
