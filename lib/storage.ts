import fs from 'fs'
import path from 'path'
import { NewsStory } from './types'
import { INITIAL_STORIES } from './stories-data'

export interface PersistedSpend {
  month: string
  calls: number
  estimatedSpendUsd: number
}

export interface Subscriber {
  email: string
  subscribedAt: string
}

function getDataDirectory(): string {
  // Try local project data dir first (local dev / build)
  const localDir = path.join(process.cwd(), 'data')
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true })
    }
    // Test write permission
    const testFile = path.join(localDir, '.write-test')
    fs.writeFileSync(testFile, 'ok')
    fs.unlinkSync(testFile)
    return localDir
  } catch {
    // In serverless production where process.cwd() is read-only, use /tmp
    const tmpDir = path.join('/tmp', 'plainnews-data')
    if (!fs.existsSync(tmpDir)) {
      try {
        fs.mkdirSync(tmpDir, { recursive: true })
      } catch {
        // Fallback to /tmp directly
        return '/tmp'
      }
    }
    return tmpDir
  }
}

const STORIES_FILE = 'stories-archive.json'
const SPEND_FILE = 'spend-tracker.json'
const SUBSCRIBERS_FILE = 'subscribers.json'

function getFilePath(filename: string): string {
  return path.join(getDataDirectory(), filename)
}

// ---------------- STORIES ARCHIVE ----------------

export function getArchivedStories(): NewsStory[] {
  const filePath = getFilePath(STORIES_FILE)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('[Storage] Failed to read archived stories:', err)
  }
  return INITIAL_STORIES
}

export function saveArchivedStories(newStories: NewsStory[]): void {
  if (!newStories || newStories.length === 0) return

  const filePath = getFilePath(STORIES_FILE)
  try {
    const existing = getArchivedStories()
    const map = new Map<string, NewsStory>()

    // Existing stories first
    for (const story of existing) {
      if (story.slug) map.set(story.slug, story)
    }

    // New stories overwrite / prepend
    for (const story of newStories) {
      if (story.slug) map.set(story.slug, story)
    }

    // Convert back to array, keep up to 200 stories
    const combined = Array.from(map.values()).slice(0, 200)
    fs.writeFileSync(filePath, JSON.stringify(combined, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[Storage] Failed to save archived stories:', err)
  }
}

export function getStoryBySlug(slug: string): NewsStory | null {
  const stories = getArchivedStories()
  const found = stories.find((s) => s.slug === slug)
  if (found) return found

  // Fallback to initial stories
  const initial = INITIAL_STORIES.find((s) => s.slug === slug)
  return initial || null
}

// ---------------- MONTHLY SPEND PERSISTENCE ----------------

export function getPersistedMonthlySpend(): PersistedSpend {
  const currentMonth = new Date().toISOString().slice(0, 7)
  const defaultSpend: PersistedSpend = { month: currentMonth, calls: 0, estimatedSpendUsd: 0 }
  const filePath = getFilePath(SPEND_FILE)

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed: PersistedSpend = JSON.parse(content)
      if (parsed && parsed.month === currentMonth) {
        return parsed
      }
    }
  } catch (err) {
    console.warn('[Storage] Failed to read spend file:', err)
  }

  return defaultSpend
}

export function savePersistedMonthlySpend(spend: PersistedSpend): void {
  const filePath = getFilePath(SPEND_FILE)
  try {
    fs.writeFileSync(filePath, JSON.stringify(spend, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[Storage] Failed to save spend file:', err)
  }
}

// ---------------- SUBSCRIBERS ----------------

export function getSubscribers(): Subscriber[] {
  const filePath = getFilePath(SUBSCRIBERS_FILE)
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8')
      const parsed = JSON.parse(content)
      if (Array.isArray(parsed)) return parsed
    }
  } catch (err) {
    console.warn('[Storage] Failed to read subscribers:', err)
  }
  return []
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

  const filePath = getFilePath(SUBSCRIBERS_FILE)
  try {
    fs.writeFileSync(filePath, JSON.stringify(subscribers, null, 2), 'utf-8')
  } catch (err) {
    console.warn('[Storage] Failed to save subscriber:', err)
  }

  return { success: true, alreadySubscribed: false, total: subscribers.length }
}
