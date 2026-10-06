import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// Initialize Redis connection
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// We can pass a specific state like ?state=tx, or have it cycle automatically
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get('state') || 'all';

  // Secure the cron job using a secret key
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    console.log(`[STATE WORKER] Waking up to process news for: ${stateCode.toUpperCase()}`);
    
    // Phase 1: Pull Local RSS Feeds for that state (Placeholder logic)
    const newStories = [
      {
        id: `local-${stateCode}-${Date.now()}`,
        title: `Local Update in ${stateCode.toUpperCase()}`,
        state: stateCode.toUpperCase(),
        city: 'Local City',
        pubDate: new Date().toISOString()
      }
    ];

    // Phase 2: Save directly into our new Upstash Redis Database
    for (const story of newStories) {
      await redis.lpush('simplybignews:live_stories', JSON.stringify(story));
    }
    
    // Keep list trimmed to top 2000 stories so it stays lightning fast
    await redis.ltrim('simplybignews:live_stories', 0, 1999);

    return NextResponse.json({
      success: true,
      message: `Processed ${newStories.length} local stories for ${stateCode.toUpperCase()}`,
    });
  } catch (error: any) {
    console.error('[STATE WORKER ERROR]', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
