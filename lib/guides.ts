import fs from 'fs'
import path from 'path'

export interface GuideSource {
  label: string
  url: string
}

export interface Guide {
  title: string
  slug: string
  bigPicture: string
  whatYouNeedToKnow: string[]
  commonMistakesToAvoid: string[]
  actionSteps: string[]
  // A guide is only public once a person has checked it against official sources.
  // Without this block the guide is NOT shown, NOT in the sitemap, and its URL returns 404.
  reviewed?: {
    on: string // YYYY-MM-DD
    sources: GuideSource[]
    note?: string
  }
}

const GUIDES_DIR = path.join(process.cwd(), 'data', 'evergreen-guides')

function loadAll(): Guide[] {
  let files: string[] = []
  try {
    files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.json'))
  } catch {
    return []
  }
  const guides: Guide[] = []
  for (const f of files) {
    try {
      guides.push(JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, f), 'utf-8')) as Guide)
    } catch {
      // skip a broken file instead of breaking the whole site
    }
  }
  return guides
}

export function isPublished(g: Guide): boolean {
  return !!g.reviewed && g.reviewed.sources.length > 0 && !!g.reviewed.on
}

export function getPublishedGuides(): Guide[] {
  return loadAll()
    .filter(isPublished)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getPublishedGuide(slug: string): Guide | null {
  return getPublishedGuides().find((g) => g.slug === slug) || null
}
