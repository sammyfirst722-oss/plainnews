import fs from 'node:fs'
import path from 'node:path'

export type GuideCategory =
  | 'Social Security & Retirement'
  | 'Medicare & Health'
  | 'Scams & Fraud Safety'
  | 'Money & Taxes'

export interface EvergreenGuide {
  title: string
  slug: string
  bigPicture: string
  whatYouNeedToKnow: string[]
  commonMistakesToAvoid: string[]
  actionSteps: string[]
  category: GuideCategory
  categoryIcon: string
  readTimeMinutes: number
}

function categorizeSlug(slug: string): { category: GuideCategory; icon: string } {
  const s = slug.toLowerCase()
  if (s.includes('social-security') || s.includes('401k') || s.includes('va-healthcare')) {
    return { category: 'Social Security & Retirement', icon: '🏛️' }
  }
  if (s.includes('medicare') || s.includes('prescription') || s.includes('long-term-care')) {
    return { category: 'Medicare & Health', icon: '🩺' }
  }
  if (s.includes('scam') || s.includes('freeze') || s.includes('fake-bank')) {
    return { category: 'Scams & Fraud Safety', icon: '🛡️' }
  }
  return { category: 'Money & Taxes', icon: '💰' }
}

const GUIDES_DIR = path.join(process.cwd(), 'data', 'evergreen-guides')

export function getAllGuides(): EvergreenGuide[] {
  try {
    if (!fs.existsSync(GUIDES_DIR)) return []
    const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith('.json'))
    const guides: EvergreenGuide[] = []

    for (const file of files) {
      try {
        const fullPath = path.join(GUIDES_DIR, file)
        const raw = fs.readFileSync(fullPath, 'utf-8')
        const data = JSON.parse(raw)
        const { category, icon } = categorizeSlug(data.slug || file.replace('.json', ''))
        const wordCount = (
          (data.title || '') +
          ' ' +
          (data.bigPicture || '') +
          ' ' +
          (data.whatYouNeedToKnow || []).join(' ') +
          ' ' +
          (data.actionSteps || []).join(' ')
        ).split(/\s+/).length

        guides.push({
          title: data.title,
          slug: data.slug || file.replace('.json', ''),
          bigPicture: data.bigPicture || '',
          whatYouNeedToKnow: data.whatYouNeedToKnow || [],
          commonMistakesToAvoid: data.commonMistakesToAvoid || [],
          actionSteps: data.actionSteps || [],
          category,
          categoryIcon: icon,
          readTimeMinutes: Math.max(2, Math.round(wordCount / 130)), // Senior reading pace ~130 wpm
        })
      } catch (err) {
        console.error(`Failed to parse guide ${file}:`, err)
      }
    }

    return guides.sort((a, b) => a.title.localeCompare(b.title))
  } catch (err) {
    console.error('Failed to read guides directory:', err)
    return []
  }
}

export function getGuideBySlug(slug: string): EvergreenGuide | null {
  try {
    const cleanSlug = slug.toLowerCase().trim()
    const filePath = path.join(GUIDES_DIR, `${cleanSlug}.json`)
    if (!fs.existsSync(filePath)) return null

    const raw = fs.readFileSync(filePath, 'utf-8')
    const data = JSON.parse(raw)
    const { category, icon } = categorizeSlug(data.slug || cleanSlug)
    const wordCount = (
      (data.title || '') +
      ' ' +
      (data.bigPicture || '') +
      ' ' +
      (data.whatYouNeedToKnow || []).join(' ') +
      ' ' +
      (data.actionSteps || []).join(' ')
    ).split(/\s+/).length

    return {
      title: data.title,
      slug: data.slug || cleanSlug,
      bigPicture: data.bigPicture || '',
      whatYouNeedToKnow: data.whatYouNeedToKnow || [],
      commonMistakesToAvoid: data.commonMistakesToAvoid || [],
      actionSteps: data.actionSteps || [],
      category,
      categoryIcon: icon,
      readTimeMinutes: Math.max(2, Math.round(wordCount / 130)),
    }
  } catch {
    return null
  }
}
