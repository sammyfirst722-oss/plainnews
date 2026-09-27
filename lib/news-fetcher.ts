import { XMLParser } from 'fast-xml-parser'
import { NewsStory, NewsCategory, PlainWord } from './types'
import { INITIAL_STORIES } from './stories-data'
import {
  getArchivedStories,
  saveArchivedStories,
  getPersistedMonthlySpend,
  savePersistedMonthlySpend,
} from './storage'

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
    categoryLabel: 'Money & Life',
    fallbackImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
  },
  {
    url: 'https://www.consumer.ftc.gov/blog/rss',
    sourceName: 'FTC Scam Alerts',
    category: 'money',
    categoryLabel: 'Scam & Consumer Alerts',
    fallbackImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
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
    url: 'https://www.nasa.gov/news-release/feed/',
    sourceName: 'NASA Space & Science',
    category: 'tech',
    categoryLabel: 'Space & Discoveries',
    fallbackImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
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
    url: 'https://phys.org/rss-feed/',
    sourceName: 'Phys.org Discoveries',
    category: 'living',
    categoryLabel: 'Science & Everyday Nature',
    fallbackImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
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

export function createFallbackBreakdown(title: string, summary: string, category: NewsCategory) {
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

// Monthly spend guard for paid AI fallback
export interface MonthlySpendStatus {
  month: string
  calls: number
  estimatedSpendUsd: number
  capUsd: number
  capReached: boolean
}

let monthlySpend = {
  month: new Date().toISOString().slice(0, 7),
  calls: 0,
  estimatedSpendUsd: 0,
}

export function getMonthlySpendCapUsd(): number {
  const envVal = process.env.OPENROUTER_MONTHLY_SPEND_CAP_USD
  if (envVal) {
    const parsed = parseFloat(envVal)
    if (!isNaN(parsed) && parsed >= 0) return parsed
  }
  return 5.0 // Safe default $5.00/month cap
}

export function getMonthlySpendStatus(): MonthlySpendStatus {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const persisted = getPersistedMonthlySpend()
  if (persisted.month === currentMonth) {
    monthlySpend = persisted
  } else {
    monthlySpend = { month: currentMonth, calls: 0, estimatedSpendUsd: 0 }
    savePersistedMonthlySpend(monthlySpend)
  }
  const capUsd = getMonthlySpendCapUsd()
  return {
    month: monthlySpend.month,
    calls: monthlySpend.calls,
    estimatedSpendUsd: monthlySpend.estimatedSpendUsd,
    capUsd,
    capReached: monthlySpend.estimatedSpendUsd >= capUsd,
  }
}

export function resetMonthlySpendForTesting(spendUsd = 0, calls = 0): void {
  monthlySpend = {
    month: new Date().toISOString().slice(0, 7),
    calls,
    estimatedSpendUsd: spendUsd,
  }
  savePersistedMonthlySpend(monthlySpend)
}

export function clearAiCacheForTesting(): void {
  aiCache = {}
}

const MODEL_PRICING: Record<string, { promptPerMillion: number; completionPerMillion: number }> = {
  'google/gemma-4-26b-a4b-it': { promptPerMillion: 0.0675, completionPerMillion: 0.225 },
  'meta-llama/llama-3.1-8b-instruct': { promptPerMillion: 0.05, completionPerMillion: 0.08 },
  'openai/gpt-4o-mini': { promptPerMillion: 0.15, completionPerMillion: 0.60 },
  default: { promptPerMillion: 0.15, completionPerMillion: 0.60 },
}

function calculateCostUsd(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING.default
  return (promptTokens * pricing.promptPerMillion + completionTokens * pricing.completionPerMillion) / 1_000_000
}

interface OpenRouterResultData {
  simplifiedTitle?: string
  bigPicture?: string
  whatHappened?: string[]
  whyItMatters?: string
  plainWords?: PlainWord[]
  usage?: {
    prompt_tokens?: number
    completion_tokens?: number
    total_tokens?: number
  }
}

async function requestOpenRouter(
  model: string,
  apiKey: string,
  prompt: string,
  timeoutMs = 10000
): Promise<{ success: true; data: OpenRouterResultData } | { success: false; status?: number; error: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://plainnews.vercel.app',
        'X-Title': 'SimplyBigNews Reader',
      },
      body: JSON.stringify({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 1000,
        response_format: { type: 'json_object' },
      }),
    })
    clearTimeout(timeout)

    if (!res.ok) {
      const errorText = await res.text().catch(() => '')
      return {
        success: false,
        status: res.status,
        error: `HTTP ${res.status}: ${errorText || res.statusText}`,
      }
    }

    const data = await res.json()
    const rawContent = data.choices?.[0]?.message?.content || ''
    const cleanedJson = rawContent.replace(/```json/gi, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleanedJson)

    return {
      success: true,
      data: {
        simplifiedTitle: parsed.simplifiedTitle,
        bigPicture: parsed.bigPicture,
        whatHappened: Array.isArray(parsed.whatHappened) && parsed.whatHappened.length > 0 ? parsed.whatHappened : ['The main events were reviewed.'],
        whyItMatters: parsed.whyItMatters,
        plainWords: Array.isArray(parsed.plainWords) ? parsed.plainWords : [],
        usage: data.usage,
      },
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network or parse error',
    }
  }
}

export async function aiSimplifyStory(title: string, description: string, category: NewsCategory, link: string) {
  const hashKey = (title + link).slice(0, 100)
  const now = Date.now()
  if (aiCache[hashKey] && now - aiCache[hashKey].timestamp < AI_CACHE_TTL_MS) {
    return aiCache[hashKey].data
  }

  const freeApiKey = process.env.OPENROUTER_API_KEY
  const paidApiKey = process.env.OPENROUTER_PAID_API_KEY || freeApiKey

  if (!freeApiKey && !paidApiKey) {
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

  const freeModel = process.env.OPENROUTER_FREE_MODEL || 'google/gemma-4-26b-a4b-it:free'
  const fallbackPaidModel = process.env.OPENROUTER_FALLBACK_MODEL || 'google/gemma-4-26b-a4b-it'

  // Step 1: Attempt the primary free model if free API key is available
  if (freeApiKey) {
    const freeRes = await requestOpenRouter(freeModel, freeApiKey, prompt)
    if (freeRes.success) {
      const result = {
        simplifiedTitle: freeRes.data.simplifiedTitle || title,
        bigPicture: freeRes.data.bigPicture || 'Here is the key takeaway in plain English.',
        whatHappened: freeRes.data.whatHappened || ['The main events were reviewed.'],
        whyItMatters: freeRes.data.whyItMatters || 'Staying informed helps you make practical decisions.',
        plainWords: freeRes.data.plainWords || [],
      }
      aiCache[hashKey] = { data: result, timestamp: now }
      return result
    } else {
      console.warn(
        `[AI Simplification] Free model ${freeModel} failed (status: ${freeRes.status ?? 'network/timeout'}, error: ${freeRes.error}). Evaluating paid fallback...`
      )
    }
  }

  // Step 2: Attempt the cheap paid fallback model (if spend cap allows)
  if (paidApiKey) {
    const spendStatus = getMonthlySpendStatus()
    if (spendStatus.capReached) {
      console.warn(
        `[SpendGuard] Monthly spend cap reached ($${spendStatus.estimatedSpendUsd.toFixed(4)} >= $${spendStatus.capUsd.toFixed(2)} for ${spendStatus.month}). Blocking paid fallback to prevent unexpected charges. Falling back to deterministic breakdown.`
      )
      return createFallbackBreakdown(title, description, category)
    }

    console.info(
      `[AI Simplification] Retrying with paid fallback model ${fallbackPaidModel} (Current spend: $${spendStatus.estimatedSpendUsd.toFixed(4)} / $${spendStatus.capUsd.toFixed(2)})...`
    )

    const paidRes = await requestOpenRouter(fallbackPaidModel, paidApiKey, prompt)
    if (paidRes.success) {
      const promptTokens = paidRes.data.usage?.prompt_tokens ?? 600
      const completionTokens = paidRes.data.usage?.completion_tokens ?? 200
      const callCost = calculateCostUsd(fallbackPaidModel, promptTokens, completionTokens)

      monthlySpend.calls += 1
      monthlySpend.estimatedSpendUsd += callCost
      savePersistedMonthlySpend(monthlySpend)

      if (monthlySpend.estimatedSpendUsd >= spendStatus.capUsd) {
        console.warn(
          `[SpendGuard] Monthly spend cap reached after call ($${monthlySpend.estimatedSpendUsd.toFixed(4)} >= $${spendStatus.capUsd.toFixed(2)}). Subsequent paid calls will be blocked for ${spendStatus.month}.`
        )
      }

      const result = {
        simplifiedTitle: paidRes.data.simplifiedTitle || title,
        bigPicture: paidRes.data.bigPicture || 'Here is the key takeaway in plain English.',
        whatHappened: paidRes.data.whatHappened || ['The main events were reviewed.'],
        whyItMatters: paidRes.data.whyItMatters || 'Staying informed helps you make practical decisions.',
        plainWords: paidRes.data.plainWords || [],
      }
      aiCache[hashKey] = { data: result, timestamp: now }
      return result
    } else {
      console.error(
        `[AI Simplification] Paid fallback model ${fallbackPaidModel} also failed (status: ${paidRes.status ?? 'network/timeout'}, error: ${paidRes.error}). Falling back to deterministic breakdown.`
      )
    }
  }

  // Step 3: All AI options exhausted or blocked; fall back to deterministic breakdown
  return createFallbackBreakdown(title, description, category)
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
  const now = Date.now()

  // Return cache if fresh
  if (!forceRefresh && cachedStories.length > 0 && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedStories
  }

  // Cold start or fresh execution: seed from persistent storage
  if (!forceRefresh && cachedStories.length === 0) {
    const archived = getArchivedStories()
    if (archived && archived.length > 0) {
      cachedStories = archived
      lastFetchTime = now
      // Prevent making live paid API calls during static compilation
      if (process.env.NEXT_PHASE === 'phase-production-build') {
        return cachedStories
      }
    }
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

      if (!res.ok) return []

      const xmlText = await res.text()
      const parsed = parser.parse(xmlText)

      const channel = parsed?.rss?.channel || parsed?.feed
      if (!channel) return []

      let items = channel.item || channel.entry || []
      if (!Array.isArray(items)) items = [items]

      const feedStoriesRaw = []
      
      for (let i = 0; i < Math.min(items.length, 4); i++) {
        const item = items[i]
        feedStoriesRaw.push({ item, feed, index: i })
      }
      return feedStoriesRaw
    } catch {
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
  saveArchivedStories(uniqueStories)

  return cachedStories
}
