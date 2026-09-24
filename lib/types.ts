export type NewsCategory =
  | 'all'
  | 'money'
  | 'health'
  | 'us-world'
  | 'tech'
  | 'living'
  | 'good-news'

export interface PlainWord {
  word: string
  meaning: string
}

export interface NewsStory {
  id: string
  title: string
  simplifiedTitle: string
  source: string
  sourceUrl: string
  pubDate: string
  timeAgo: string
  category: NewsCategory
  categoryLabel: string
  imageUrl: string
  originalSummary: string
  bigPicture: string
  whatHappened: string[]
  whyItMatters: string
  plainWords: PlainWord[]
  readTimeMinutes: number
  isBookmarked?: boolean
  likesCount?: number
}

export type TextSize = 'standard' | 'large' | 'xlarge'
export type ReadingMode = 'light' | 'sepia' | 'dark'
