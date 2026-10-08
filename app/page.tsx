import { fetchLiveNews } from '@/lib/news-fetcher'
import { PlainNewsClient } from '@/components/plainnews-client'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function HomePage() {
  const initialStories = await fetchLiveNews(false)

  return <PlainNewsClient initialStories={initialStories} />
}
