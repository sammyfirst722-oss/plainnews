import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getSubscribers } from '@/lib/storage'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const email = url.searchParams.get('email')

  if (!email) {
    return new Response(
      `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;">
        <h2>Unsubscribe from SimplyBigNews</h2>
        <p>To unsubscribe, please enter your email below:</p>
        <form method="POST"><input type="email" name="email" required style="padding:10px;font-size:16px;border-radius:8px;border:1px solid #ccc;"/>
        <button type="submit" style="padding:10px 20px;background:#059669;color:white;border:none;border-radius:8px;font-weight:bold;margin-left:8px;cursor:pointer;">Unsubscribe</button></form>
      </body></html>`,
      { headers: { 'Content-Type': 'text/html' } }
    )
  }

  handleUnsubscribe(email)

  return new Response(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;">
      <h2>You have been unsubscribed.</h2>
      <p>You will no longer receive the 2-Minute Daily Briefing.</p>
      <a href="/" style="color:#059669;font-weight:bold;">Return to SimplyBigNews</a>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}

export async function POST(request: Request) {
  let email = ''
  const contentType = request.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const body = await request.json().catch(() => ({}))
    email = body.email || ''
  } else {
    const formData = await request.formData().catch(() => null)
    email = (formData?.get('email') as string) || ''
  }

  if (email) {
    handleUnsubscribe(email)
  }

  return new Response(
    `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:50px;">
      <h2>You have been unsubscribed.</h2>
      <p>${email ? `<strong>${email}</strong> has been removed from our list.` : 'You have been removed.'}</p>
      <a href="/" style="color:#059669;font-weight:bold;">Return to SimplyBigNews</a>
    </body></html>`,
    { headers: { 'Content-Type': 'text/html' } }
  )
}

function handleUnsubscribe(email: string) {
  try {
    const clean = email.trim().toLowerCase()
    const subscribers = getSubscribers()
    const filtered = subscribers.filter((s) => s.email.toLowerCase() !== clean)
    // Save to storage
    const dir = path.join(process.cwd(), 'data')
    const filePath = path.join(fs.existsSync(dir) ? dir : '/tmp/plainnews-data', 'subscribers.json')
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[Unsubscribe] Failed:', err)
  }
}
