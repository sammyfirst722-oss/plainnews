import { MetadataRoute } from 'next'
import { getPublishedGuides } from '@/lib/guides'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://plainnews.vercel.app'

  const guides = getPublishedGuides()
  const guidePages: MetadataRoute.Sitemap = guides.length
    ? [
        {
          url: `${baseUrl}/guides`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        },
        ...guides.map((g) => ({
          url: `${baseUrl}/guides/${g.slug}`,
          lastModified: g.reviewed ? new Date(g.reviewed.on) : new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        })),
      ]
    : []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    ...guidePages,
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
