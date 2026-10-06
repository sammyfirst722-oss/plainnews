export type NewsCategory =
  | 'all'
  | 'money'
  | 'health'
  | 'us-world'
  | 'tech'
  | 'living'
  | 'good-news'
  | 'entertainment'
  | 'sports'
  | 'science'
  | 'viral'

export interface PlainWord {
  word: string
  meaning: string
}

export interface NewsStory {
  id: string
  slug: string
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
  trendingScore?: number
  // News Map location fields
  state?: string | null
  city?: string | null
  coordinates?: [number, number] | null // [longitude, latitude]
}

export type TextSize = 'standard' | 'large' | 'xlarge'
export type ReadingMode = 'light' | 'sepia' | 'dark'

export interface NewsIqQuestion {
  id: string
  question: string
  category: 'national' | 'economy' | 'tech' | 'world' | 'map'
  categoryLabel: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface NewsIqProfile {
  score: number
  level: number
  levelTitle: string
  xp: number
  nextLevelXp: number
  streak: number
  questionsAnswered: number
  questionsCorrect: number
  lastPlayedDate: string
  percentile: number
}
