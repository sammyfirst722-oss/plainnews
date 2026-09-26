import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const hasOpenRouter = !!process.env.OPENROUTER_API_KEY
  const hasPaidBackup = !!process.env.OPENROUTER_PAID_API_KEY || hasOpenRouter

  const isHealthy = hasOpenRouter

  const healthData = {
    status: isHealthy ? 'healthy' : 'degraded',
    app: 'SimplyBigNews',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    checks: {
      openrouterConfigured: hasOpenRouter,
      paidBackupAvailable: hasPaidBackup,
      monthlySpendCap: process.env.OPENROUTER_MONTHLY_SPEND_CAP_USD || '5.00',
    },
    version: '1.0.0',
  }

  return NextResponse.json(healthData, {
    status: isHealthy ? 200 : 503,
  })
}
