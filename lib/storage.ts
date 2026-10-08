import fs from 'fs'
import path from 'path'
import { put, get, list } from '@vercel/blob'
import { NewsStory } from './types'
import { INITIAL_STORIES } from './stories-data'
import fiftyStateStoriesFallback from '@/data/fifty_states_stories.json'

export interface PersistedSpend {
  month: string
  calls: number
  estimatedSpendUsd: number
}

export interface Subscriber {
  email: string
  subscribedAt: string
}

const STORIES_FILE = 'stories-archive.json'
const SPEND_FILE = 'spend-tracker.json'
const SUBSCRIBERS_FILE = 'subscribers.json'

// In-memory memory store to serve instant sync reads across requests within the lambda
let inMemoryStories: NewsStory[] = [
  ...INITIAL_STORIES,
  ...(fiftyStateStoriesFallback as NewsStory[]),
]
let inMemorySpend: PersistedSpend | null = null
let inMemorySubscribers: Subscriber[] = []
let isInitialized = false

function getDataDirectory(): string {
  const localDir = path.join(process.cwd(), 'data')
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true })
    }
    const testFile = path.join(localDir, '.write-test')
    fs.writeFileSync(testFile, 'ok')
    fs.unlinkSync(testFile)
    return localDir
  } catch {
    const tmpDir = path.join('/tmp', 'plainnews-data')
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true })
      } catch {
        return '/tmp'
      }
    }
    return tmpDir
  }
}

function getLocalFilePath(filename: string): string {
  return path.join(getDataDirectory(), filename)
}

function hasBlobConfig(): boolean {
  return !!(process.env.BLOB_READ_WRITE_TOKEN || (process.env.BLOB_STORE_ID && process.env.VERCEL_OIDC_TOKEN))
}

/**
 * Async background flush to Vercel Blob
 */
export async function persistToBlob(filename: string, data: any): Promise<void> {
  if (!hasBlobConfig()) return

  try {
    await put(filename, JSON.stringify(data, null, 2), {
      access: 'private',
      addRandomSuffix: false,
    })
  } catch (err: any) {
    console.warn(`[Storage] Blob persist failed for ${filename}:`, err.message)
  }
}

/**
 * Async fetch from Vercel Blob
 */
export async function fetchFromBlob<T>(filename: string): Promise<T | null> {
  if (!hasBlobConfig()) return null

  try {
    const { blobs } = await list()
    const target = blobs.find((b) => b.pathname === filename)
    if (!target) return null

    const res = await get(target.url, { access: 'private' })
    if (!res || !res.stream) return null

    const parsed = await new Response(res.stream).json()
    return parsed as T
  } catch (err: any) {
    console.warn(`[Storage] Blob fetch failed for ${filename}:`, err.message)
    return null
  }
}

/**
 * Ensures in-memory cache is seeded from local file or Vercel Blob on startup
 */
export async function initializeStorage(): Promise<void> {
  if (isInitialized) return
  isInitialized = true

  // 1. Try local disk first
  try {
    const subFile = getLocalFilePath(SUBSCRIBERS_FILE)
    if (fs.existsSync(subFile)) {
      const data = JSON.parse(fs.readFileSync(subFile, 'utf8'))
      if (Array.isArray(data)) inMemorySubscribers = data
    }

    const spendFile = getLocalFilePath(SPEND_FILE)
    if (fs.existsSync(spendFile)) {
      const data = JSON.parse(fs.readFileSync(spendFile, 'utf8'))
      if (data && data.month) inMemorySpend = data
    }

    const storiesFile = getLocalFilePath(STORIES_FILE)
    if (fs.existsSync(storiesFile)) {
      const data = JSON.parse(fs.readFileSync(storiesFile, 'utf8'))
      if (Array.isArray(data) && data.length > 0) inMemoryStories = data
    }
  } catch (err) {
    console.warn('[Storage] Local seed failed:', err)
  }

  // 2. Overlay from Vercel Blob if running on Vercel
  if (hasBlobConfig()) {
    try {
      const [remoteSubs, remoteSpend, remoteStories] = await Promise.all([
        fetchFromBlob<Subscriber[]>(SUBSCRIBERS_FILE),
        fetchFromBlob<PersistedSpend>(SPEND_FILE),
        fetchFromBlob<NewsStory[]>(STORIES_FILE),
      ])

      if (remoteSubs && Array.isArray(remoteSubs) && remoteSubs.length >= inMemorySubscribers.length) {
        inMemorySubscribers = remoteSubs
      }
      if (remoteSpend && remoteSpend.month) {
        inMemorySpend = remoteSpend
      }
      if (remoteStories && Array.isArray(remoteStories) && remoteStories.length > 0) {
        inMemoryStories = remoteStories
      }
    } catch (err) {
      console.warn('[Storage] Remote blob sync failed:', err)
    }
  }
}

// ---------------- STORIES ARCHIVE ----------------

export function getArchivedStories(): NewsStory[] {
  const filePath = getLocalFilePath(STORIES_FILE)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryStories = parsed
        return parsed
      }
    }
  } catch {}

  return inMemoryStories.length > 0 ? inMemoryStories : INITIAL_STORIES
}

export function saveArchivedStories(newStories: NewsStory[]): void {
  if (!newStories || newStories.length === 0) return

  const map = new Map<string, NewsStory>()
  for (const story of inMemoryStories) {
    if (story.slug) map.set(story.slug, story)
  }
  for (const story of newStories) {
    if (story.slug) map.set(story.slug, story)
  }

  const combined = Array.from(map.values()).slice(0, 200)
  inMemoryStories = combined

  // Write local
  try {
    fs.writeFileSync(getLocalFilePath(STORIES_FILE), JSON.stringify(combined, null, 2), 'utf-8')
  } catch {}

  // Flush to Vercel Blob in background
  persistToBlob(STORIES_FILE, combined).catch(() => {})
}

export function getStoryBySlug(slug: string): NewsStory | null {
  const stories = getArchivedStories()
  const found = stories.find((s) => s.slug === slug)
  if (found) return found
  return INITIAL_STORIES.find((s) => s.slug === slug) || null
}

// ---------------- MONTHLY SPEND PERSISTENCE ----------------

export function getPersistedMonthlySpend(): PersistedSpend {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const defaultSpend: PersistedSpend = { month: currentMonth, calls: 0, estimatedSpendUsd: 0 }

  if (inMemorySpend && inMemorySpend.month === currentMonth) {
    return inMemorySpend
  }

  const filePath = getLocalFilePath(SPEND_FILE)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed: PersistedSpend = JSON.parse(content)
      if (parsed && parsed.month === currentMonth) {
        inMemorySpend = parsed
        return parsed
      }
    }
  } catch {}

  inMemorySpend = defaultSpend
  return defaultSpend
}

export function savePersistedMonthlySpend(spend: PersistedSpend): void {
  inMemorySpend = spend

  // Write local
  try {
    fs.writeFileSync(getLocalFilePath(SPEND_FILE), JSON.stringify(spend, null, 2), 'utf-8')
  } catch {}

  // Flush to Vercel Blob in background
  persistToBlob(SPEND_FILE, spend).catch(() => {})
}

// ---------------- SUBSCRIBERS ----------------

export function getSubscribers(): Subscriber[] {
  const filePath = getLocalFilePath(SUBSCRIBERS_FILE)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) {
        inMemorySubscribers = parsed
        return parsed
      }
    }
  } catch {}

  return inMemorySubscribers
}

export function addSubscriber(email: string): { success: boolean; alreadySubscribed: boolean; total: number } {
  const cleanEmail = email.trim().toLowerCase()
  const subscribers = getSubscribers()

  const existing = subscribers.find((s) => s.email.toLowerCase() === cleanEmail)
  if (existing) {
    return { success: true, alreadySubscribed: true, total: subscribers.length }
  }

  subscribers.push({
    email: cleanEmail,
    subscribedAt: new Date().toISOString(),
  })
  inMemorySubscribers = subscribers

  // Write local
  try {
    fs.writeFileSync(getLocalFilePath(SUBSCRIBERS_FILE), JSON.stringify(subscribers, null, 2), 'utf-8')
  } catch {}

  // Flush to Vercel Blob in background
  persistToBlob(SUBSCRIBERS_FILE, subscribers).catch(() => {})

  return { success: true, alreadySubscribed: false, total: subscribers.length }
}
