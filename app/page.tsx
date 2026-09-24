import { fetchLiveNews } from '@/lib/news-fetcher'
import { PlainNewsClient } from '@/components/plainnews-client'

export const revalidate = 300 // Revalidate every 5 minutes

export default async function HomePage() {
  const initialStories = await fetchLiveNews(false)

  return <PlainNewsClient initialStories={initialStories} />
}
