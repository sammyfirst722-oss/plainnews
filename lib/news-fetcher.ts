import { XMLParser } from 'fast-xml-parser'
import * as Sentry from '@sentry/nextjs'
import { NewsStory, NewsCategory, PlainWord } from './types'
import { INITIAL_STORIES } from './stories-data'

interface FeedSource {
  url: string
  sourceName: string
  category: NewsCategory
  categoryLabel: string
  fallbackImage: string
}

const RSS_FEEDS: FeedSource[] = [
  {
    url: 'https://feeds.npr.org/1017/rss.xml',
    sourceName: 'NPR Economy',
    category: 'money',
    categoryLabel: 'Money & Retirement',
    fallbackImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  },
  {
    url: 'https://feeds.npr.org/1128/rss.xml',
    sourceName: 'NPR Health',
    category: 'health',
    categoryLabel: 'Health & Wellness',
    fallbackImage: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    url: 'https://feeds.npr.org/1019/rss.xml',
    sourceName: 'NPR Technology',
    category: 'tech',
    categoryLabel: 'Tech Made Simple',
    fallbackImage: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?auto=format&fit=crop&w=800&q=80',
  },
  {
    url: 'https://feeds.npr.org/1001/rss.xml',
    sourceName: 'NPR News',
    category: 'us-world',
    categoryLabel: 'US & World',
    fallbackImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
  },
  {
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
    sourceName: 'BBC World',
    category: 'us-world',
    categoryLabel: 'US & World',
    fallbackImage: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
  },
  {
    url: 'https://www.goodnewsnetwork.org/feed/',
    sourceName: 'Good News Network',
    category: 'good-news',
    categoryLabel: 'Good News',
    fallbackImage: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
  },
]

// In-memory cache for fast sub-50ms responses
let cachedStories: NewsStory[] = []
let lastFetchTime = 0
const CACHE_TTL_MS = 5 * 60 * 1000 // 5 minutes

// In-memory cache for AI simplifications (separate longer-lived)
const AI_CACHE_TTL_MS = 30 * 60 * 1000 // 30 minutes
let aiCache: Record<string, { data: ReturnType<typeof createFallbackBreakdown>; timestamp: number }> = {}

function cleanHtml(raw: string = ''): string {
  return raw
    .replace(/<[^>]*>?/gm, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function timeSince(dateString: string): string {
  const date = new Date(dateString)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (isNaN(seconds) || seconds < 0) return 'Just now'
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function createFallbackBreakdown(title: string, summary: string, category: NewsCategory) {
  const cleanTitle = cleanHtml(title)
  const cleanSummary = cleanHtml(summary)

  // Split into sentences
  const sentences = cleanSummary
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 15)

  const bigPicture =
    sentences[0] || `Here is a clear summary of recent developments regarding ${cleanTitle.toLowerCase()}.`

  const whatHappened = [
    sentences[1] || `Key officials and experts are reviewing recent updates to keep the public informed.`,
    sentences[2] || `The situation affects everyday services, pricing, and community guidelines.`,
    sentences[3] || `More details will be shared as new verified information becomes available.`,
  ]

  let whyItMatters = 'Understanding this news helps you plan your weekly schedule, budget, and family priorities.'
  if (category === 'money') {
    whyItMatters = 'Changes in economic policy and market trends directly influence your groceries, mortgage rates, and retirement savings.'
  } else if (category === 'health') {
    whyItMatters = 'Staying informed on wellness and medical updates helps you make better decisions with your doctor and protect your family.'
  } else if (category === 'tech') {
    whyItMatters = 'Knowing how new technology works makes everyday gadgets easier to use while keeping your personal information safe from scams.'
  } else if (category === 'good-news') {
    whyItMatters = 'Positive community stories remind us of the kindness, progress, and resilience happening across our country every day.'
  }

  const plainWords = [
    { word: 'Summary', meaning: 'A short, simple recap of the main points without confusing details.' },
    { word: 'Developments', meaning: 'New events or changes that just happened.' },
  ]

  return {
    simplifiedTitle: cleanTitle.length > 70 ? cleanTitle.slice(0, 67) + '...' : cleanTitle,
    bigPicture,
    whatHappened,
    whyItMatters,
    plainWords,
  }
}

async function aiSimplifyStory(title: string, description: string, category: NewsCategory, link: string) {
  const hashKey = (title + link).slice(0, 100)
  const now = Date.now()
  if (aiCache[hashKey] && now - aiCache[hashKey].timestamp < AI_CACHE_TTL_MS) {
    return aiCache[hashKey].data
  }

  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
  if (!OPENROUTER_API_KEY) {
    return createFallbackBreakdown(title, description, category)
  }

  const prompt = `You are an expert news editor and educator specializing in writing for adults aged 40+ at an 8th-grade school reading level.
Your goal is to make the news clear, calm, and easy to understand without confusing jargon, hyperbolic panic, or partisan spin.

ARTICLE HEADLINE: "${title}"
ARTICLE TEXT:
"""
${description.slice(0, 3000)}
"""

Please rewrite this news story into simple, plain English at an 8th-grade reading level.
Return ONLY valid JSON matching this exact structure:
{
  "simplifiedTitle": "Short, clear title in plain English (under 65 characters)",
  "bigPicture": "One clear sentence explaining the main point simply.",
  "whatHappened": [
    "First simple fact about what happened in everyday words.",
    "Second key detail or background point.",
    "Third outcome or what happens next."
  ],
  "whyItMatters": "Two sentences explaining the practical impact on everyday life, money, health, safety, or family for adults aged 40+.",
  "plainWords": [
    {"word": "Jargon Term 1", "meaning": "Simple everyday definition"}
  ]
}`

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 10000)
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-26b-a4b-it:free',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      }),
    })
    clearTimeout(timeout)
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      Sentry.captureMessage(
        `OpenRouter API error (HTTP ${res.status}): ${errorText || res.statusText}`,
        {
          level: 'error',
          tags: { service: 'openrouter', operation: 'aiSimplifyStory', category },
          extra: { title, link, status: res.status, errorText },
        }
      )
      return createFallbackBreakdown(title, description, category)
    }
    
    const data = await res.json()
    const rawContent = data.choices?.[0]?.message?.content || ''
    const cleanedJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanedJson)
    
    const result = {
      simplifiedTitle: parsed.simplifiedTitle || title,
      bigPicture: parsed.bigPicture || 'Here is the key takeaway in plain English.',
      whatHappened: Array.isArray(parsed.whatHappened) && parsed.whatHappened.length > 0 ? parsed.whatHappened : ['The main events were reviewed.'],
      whyItMatters: parsed.whyItMatters || 'Staying informed helps you make practical decisions.',
      plainWords: Array.isArray(parsed.plainWords) ? parsed.plainWords : [],
    }
    
    aiCache[hashKey] = { data: result, timestamp: now }
    return result
  } catch (err) {
    Sentry.captureException(err, {
      tags: { service: 'openrouter', operation: 'aiSimplifyStory', category },
      extra: { title, link },
    })
    return createFallbackBreakdown(title, description, category)
  }
}

function generateSlug(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 80)
}

// Concurrency utility
async function processWithConcurrency<T>(tasks: (() => Promise<T>)[], limit: number): Promise<PromiseSettledResult<T>[]> {
  const results: PromiseSettledResult<T>[] = [];
  let i = 0;
  const exec = async () => {
    while (i < tasks.length) {
      const taskIndex = i++;
      try {
        const value = await tasks[taskIndex]();
        results[taskIndex] = { status: 'fulfilled', value };
      } catch (reason) {
        results[taskIndex] = { status: 'rejected', reason };
      }
    }
  };
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => exec());
  await Promise.all(workers);
  return results;
}

export async function fetchLiveNews(forceRefresh = false): Promise<NewsStory[]> {
  try {
    const now = Date.now()

    // Return cache if fresh
    if (!forceRefresh && cachedStories.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
      return cachedStories
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })

    const fetchedStories: NewsStory[] = []

    // Fetch feeds in parallel with timeout
    const promises = RSS_FEEDS.map(async (feed) => {
      try {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 4000) // 4 sec timeout

        const res = await fetch(feed.url, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'PlainNews Reader/1.0 (plainnews.vercel.app)',
          },
          next: { revalidate: 300 },
        })
        clearTimeout(timeout)

        if (!res.ok) {
          Sentry.captureMessage(
            `RSS feed returned HTTP ${res.status}: ${feed.sourceName}`,
            {
              level: 'warning',
              tags: { source: feed.sourceName, category: feed.category },
              extra: { url: feed.url, status: res.status },
            }
          )
          return []
        }

        const xmlText = await res.text()
        const parsed = parser.parse(xmlText)

        const channel = parsed?.rss?.channel || parsed?.feed
        if (!channel) {
          Sentry.captureMessage(
            `RSS feed parse failed: No channel or feed root found for ${feed.sourceName}`,
            {
              level: 'warning',
              tags: { source: feed.sourceName, category: feed.category },
              extra: { url: feed.url },
            }
          )
          return []
        }

        let items = channel.item || channel.entry || []
        if (!Array.isArray(items)) items = [items]

        const feedStoriesRaw = []
        
        for (let i = 0; i < Math.min(items.length, 4); i++) {
          const item = items[i]
          feedStoriesRaw.push({ item, feed, index: i })
        }
        return feedStoriesRaw
      } catch (err) {
        Sentry.captureException(err, {
          tags: { source: feed.sourceName, category: feed.category, operation: 'rssFetch' },
          extra: { url: feed.url },
        })
        return []
      }
    })

    const feedResults = await Promise.allSettled(promises)
    
    const allRawStories: any[] = []
    feedResults.forEach((res) => {
      if (res.status === 'fulfilled' && res.value.length > 0) {
        allRawStories.push(...res.value)
      }
    })

    if (allRawStories.length === 0) {
      Sentry.captureMessage(
        'All RSS feeds returned empty results or failed to fetch. Falling back to foundation stories.',
        { level: 'error', tags: { pipeline: 'rss-fetcher' } }
      )
    }
    
    const aiTasks = allRawStories.map((raw) => async () => {
      const { item, feed, index } = raw
      const rawTitle = item.title?.['#text'] || item.title || 'Breaking Update'
      const rawDesc = item.description?.['#text'] || item.description || item.summary || ''
      const link = item.link?.['#text'] || item.link?.['@_href'] || item.link || '#'
      const pubDate = item.pubDate || item.published || new Date().toISOString()
      
      const cleanRawTitle = cleanHtml(rawTitle)
      const breakdown = await aiSimplifyStory(cleanRawTitle, cleanHtml(rawDesc), feed.category, typeof link === 'string' ? link : '#')

      let imageUrl = feed.fallbackImage
      if (item.enclosure?.['@_url']) {
        imageUrl = item.enclosure['@_url']
      } else if (item['media:content']?.['@_url']) {
        imageUrl = item['media:content']['@_url']
      }

      return {
        id: `rss-${feed.category}-${index}-${Date.now().toString(36)}`,
        slug: generateSlug(cleanRawTitle),
        title: cleanRawTitle,
        simplifiedTitle: breakdown.simplifiedTitle,
        source: feed.sourceName,
        sourceUrl: typeof link === 'string' ? link : '#',
        pubDate: new Date(pubDate).toISOString(),
        timeAgo: timeSince(pubDate),
        category: feed.category,
        categoryLabel: feed.categoryLabel,
        imageUrl,
        originalSummary: cleanHtml(rawDesc),
        bigPicture: breakdown.bigPicture,
        whatHappened: breakdown.whatHappened,
        whyItMatters: breakdown.whyItMatters,
        plainWords: breakdown.plainWords,
        readTimeMinutes: Math.max(1, Math.ceil(cleanHtml(rawDesc).split(' ').length / 130)),
      } as NewsStory
    })

    // Concurrency limit 3
    const finalResults = await processWithConcurrency(aiTasks, 3)
    finalResults.forEach(res => {
      if (res.status === 'fulfilled' && res.value) {
        fetchedStories.push(res.value)
      } else if (res.status === 'rejected') {
        Sentry.captureException(res.reason, {
          tags: { pipeline: 'ai-batch' },
        })
      }
    })

    // Merge live stories with our curated 40+ foundation
    const combined = [...fetchedStories, ...INITIAL_STORIES]

    // Remove duplicates by title
    const seen = new Set<string>()
    const uniqueStories: NewsStory[] = []

    for (const story of combined) {
      const key = story.title.toLowerCase().trim()
      if (!seen.has(key)) {
        seen.add(key)
        uniqueStories.push(story)
      }
    }

    // Sort by pubDate descending (newest first)
    uniqueStories.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

    cachedStories = uniqueStories
    lastFetchTime = now

    return cachedStories
  } catch (err) {
    Sentry.captureException(err, {
      tags: { operation: 'fetchLiveNews' },
    })
    return cachedStories.length > 0 ? cachedStories : INITIAL_STORIES
  }
}
