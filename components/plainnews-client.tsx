'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { NewsStory, NewsCategory, TextSize } from '@/lib/types'
import { TextSizeController } from './text-size-controller'
import { StoryDetailModal } from './story-detail-modal'
import { CustomRewriteModal } from './custom-rewrite-modal'
import { AudioPlayer } from './audio-player'
import {
  Newspaper,
  Sparkles,
  Search,
  RotateCw,
  Bookmark,
  Volume2,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  BookOpen,
  Filter,
} from 'lucide-react'

interface PlainNewsClientProps {
  initialStories: NewsStory[]
}

const CATEGORIES: { id: NewsCategory | 'saved'; label: string; icon: string }[] = [
  { id: 'all', label: 'All Stories', icon: '📰' },
  { id: 'money', label: 'Money & Retirement', icon: '💰' },
  { id: 'health', label: 'Health & Wellness', icon: '🩺' },
  { id: 'us-world', label: 'US & World', icon: '🌍' },
  { id: 'tech', label: 'Tech Made Simple', icon: '💡' },
  { id: 'living', label: 'Home & Living', icon: '🏡' },
  { id: 'good-news', label: 'Good News', icon: '☀️' },
  { id: 'saved', label: 'Saved Stories', icon: '🔖' },
]

export function PlainNewsClient({ initialStories }: PlainNewsClientProps) {
  const [stories, setStories] = useState<NewsStory[]>(initialStories)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'saved'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStory, setSelectedStory] = useState<NewsStory | null>(null)
  const [textSize, setTextSize] = useState<TextSize>('standard')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isRewriteModalOpen, setIsRewriteModalOpen] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now')

  // Load saved bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('plainnews_bookmarks')
      if (saved) {
        setBookmarkedIds(JSON.parse(saved))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Persist bookmarks
  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem('plainnews_bookmarks', JSON.stringify(next))
      } catch {}
      return next
    })
  }

  // Refresh live news feeds
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/news?refresh=true')
      const data = await res.json()
      if (data.success && Array.isArray(data.stories)) {
        setStories(data.stories)
        setLastRefreshed('Just now')
      }
    } catch (err) {
      console.error('Refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }

  // Filter stories by category and search
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (selectedCategory === 'saved') {
        if (!bookmarkedIds.includes(story.id)) return false
      } else if (selectedCategory !== 'all' && story.category !== selectedCategory) {
        return false
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = story.simplifiedTitle.toLowerCase().includes(q)
        const matchesOrig = story.title.toLowerCase().includes(q)
        const matchesSummary = story.bigPicture.toLowerCase().includes(q)
        if (!matchesTitle && !matchesOrig && !matchesSummary) return false
      }

      return true
    })
  }, [stories, selectedCategory, searchQuery, bookmarkedIds])

  // Top spotlight story
  const spotlightStory = filteredStories[0] || initialStories[0]
  const remainingStories = filteredStories.slice(1)

  // Current formatted date and edition
  const todayFormatted = useMemo(() => {
    const d = new Date()
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
    const hour = d.getHours()
    const edition = hour < 12 ? 'Morning Edition' : hour < 17 ? 'Afternoon Edition' : 'Evening Edition'
    return {
      date: d.toLocaleDateString('en-US', options),
      edition,
    }
  }, [])

  // Font size multiplier classes
  const headlineClass =
    textSize === 'xlarge'
      ? 'text-xl sm:text-2xl font-black'
      : textSize === 'large'
      ? 'text-lg sm:text-xl font-black'
      : 'text-base sm:text-lg font-bold'

  const cardBodyClass =
    textSize === 'xlarge'
      ? 'text-base sm:text-lg leading-relaxed'
      : textSize === 'large'
      ? 'text-sm sm:text-base leading-relaxed'
      : 'text-xs sm:text-sm leading-relaxed'

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
      {/* =================================================================== */}
      {/* TOP HEADER / APP BAR                                                */}
      {/* =================================================================== */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-md border-2 border-emerald-400 shrink-0">
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-xl sm:text-2xl tracking-tight text-foreground">
                  SimplyBigNews
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  Zero Fluff
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium hidden sm:block">
                Clear, calm news in simple everyday words • Tailored for everyday life
              </p>
            </div>
          </div>

          {/* Controls: Text Size, Reading Theme, Translate Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsRewriteModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary border-2 border-primary/30 text-xs font-extrabold shadow-2xs transition-all active:scale-95"
              title="Translate any confusing news text into plain English"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Translate Any Article</span>
              <span className="md:hidden">Translate</span>
            </button>

            <TextSizeController textSize={textSize} setTextSize={setTextSize} />
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* EDITION BANNER & LIVE STATUS                                       */}
      {/* =================================================================== */}
      <div className="border-b-2 border-border/60 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-foreground">{todayFormatted.date}</span>
            <span className="text-border">•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {todayFormatted.edition}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span>Updated: {lastRefreshed}</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border-2 border-border/70 hover:bg-muted font-bold text-foreground text-[11px] active:scale-95 transition-all"
            >
              <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-primary' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        {/* =================================================================== */}
        {/* CATEGORY SELECTOR PILLS                                             */}
        {/* =================================================================== */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            const count =
              cat.id === 'saved'
                ? bookmarkedIds.length
                : cat.id === 'all'
                ? stories.length
                : stories.filter((s) => s.category === cat.id).length

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-extrabold border-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102'
                    : 'bg-card text-foreground border-border/80 hover:border-primary/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* =================================================================== */}
        {/* SEARCH BAR                                                          */}
        {/* =================================================================== */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news by topic, company, Social Security, health tips..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-border/80 bg-card text-sm text-foreground focus:outline-hidden focus:border-primary shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* =================================================================== */}
        {/* SPOTLIGHT / TOP STORY CARD                                          */}
        {/* =================================================================== */}
        {spotlightStory && selectedCategory !== 'saved' && !searchQuery && (
          <div className="bg-card border-2 border-emerald-500/40 rounded-3xl p-5 sm:p-7 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-emerald-600 text-white text-[11px] font-black uppercase tracking-wider">
              Top Story
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Image banner */}
              <div className="lg:col-span-5 relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden border-2 border-border/80">
                <img
                  src={spotlightStory.imageUrl}
                  alt={spotlightStory.simplifiedTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-black/75 text-white backdrop-blur-xs">
                    {spotlightStory.categoryLabel}
                  </span>
                </div>
              </div>

              {/* Text & Takeaway */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                  <span className="font-extrabold text-foreground">{spotlightStory.source}</span>
                  <span>•</span>
                  <span>{spotlightStory.timeAgo}</span>
                  <span>•</span>
                  <span>{spotlightStory.readTimeMinutes} min read</span>
                </div>

                <h2
                  onClick={() => setSelectedStory(spotlightStory)}
                  className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground hover:text-emerald-600 cursor-pointer transition-colors text-balance"
                >
                  {spotlightStory.simplifiedTitle}
                </h2>

                <div className="p-3.5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30">
                  <p className="text-sm font-semibold text-foreground text-pretty">
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-300 mr-1.5">
                      THE GIST:
                    </span>
                    {spotlightStory.bigPicture}
                  </p>
                </div>

                {/* Actions: Listen & Read */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => setSelectedStory(spotlightStory)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-md hover:opacity-90 active:scale-95 transition-all"
                  >
                    <span>Read in Plain English</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <AudioPlayer
                    compact
                    title={spotlightStory.simplifiedTitle}
                    textToRead={`${spotlightStory.bigPicture} What happened: ${spotlightStory.whatHappened.join(
                      ' '
                    )} Why it matters: ${spotlightStory.whyItMatters}`}
                  />

                  <button
                    onClick={() => toggleBookmark(spotlightStory.id)}
                    className={`p-2.5 rounded-xl border-2 transition-all ${
                      bookmarkedIds.includes(spotlightStory.id)
                        ? 'bg-amber-500/20 text-amber-950 dark:text-amber-200 border-amber-500'
                        : 'border-border/80 text-muted-foreground hover:text-foreground'
                    }`}
                    title="Bookmark Story"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedIds.includes(spotlightStory.id) ? 'fill-current' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* STORIES FEED GRID                                                  */}
        {/* =================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span>Latest News Stories</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-bold text-foreground">
                {filteredStories.length}
              </span>
            </h3>
          </div>

          {filteredStories.length === 0 ? (
            <div className="p-12 text-center bg-card border-2 border-border/80 rounded-3xl space-y-3">
              <div className="text-4xl">📰</div>
              <h4 className="text-lg font-bold">No stories found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {selectedCategory === 'saved'
                  ? 'You have not saved any stories yet. Tap the bookmark icon on any article to save it for later.'
                  : 'Try searching with different words or reset the category filter.'}
              </p>
              {selectedCategory === 'saved' && (
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
                >
                  Browse Today&apos;s Stories
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(selectedCategory === 'saved' || searchQuery ? filteredStories : remainingStories).map(
                (story) => {
                  const isSaved = bookmarkedIds.includes(story.id)
                  const audioScript = `${story.bigPicture} First: ${story.whatHappened.join(
                    ' Next: '
                  )} Why it matters: ${story.whyItMatters}`

                  return (
                    <article
                      key={story.id}
                      className="flex flex-col bg-card border-2 border-border/80 rounded-3xl p-5 shadow-2xs hover:shadow-md hover:border-emerald-500/50 transition-all group"
                    >
                      {/* Card Thumbnail Image */}
                      {story.imageUrl && (
                        <div
                          onClick={() => setSelectedStory(story)}
                          className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-border/60 mb-3.5 cursor-pointer"
                        >
                          <img
                            src={story.imageUrl}
                            alt={story.simplifiedTitle}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-black/75 text-white backdrop-blur-xs">
                              {story.categoryLabel}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Meta: Source & Time */}
                      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground font-semibold mb-2">
                        <span>{story.source}</span>
                        <span>{story.timeAgo}</span>
                      </div>

                      {/* Simplified Headline */}
                      <h4
                        onClick={() => setSelectedStory(story)}
                        className={`${headlineClass} text-foreground group-hover:text-emerald-600 transition-colors cursor-pointer mb-2.5 text-balance`}
                      >
                        {story.simplifiedTitle}
                      </h4>

                      {/* The Big Picture Summary snippet */}
                      <p className={`${cardBodyClass} text-muted-foreground flex-1 mb-4 text-pretty`}>
                        {story.bigPicture}
                      </p>

                      {/* Card Bottom Controls */}
                      <div className="flex items-center justify-between pt-3 border-t-2 border-border/60 gap-2">
                        <AudioPlayer compact title={story.simplifiedTitle} textToRead={audioScript} />

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleBookmark(story.id)}
                            className={`p-1.5 rounded-xl border-2 transition-all ${
                              isSaved
                                ? 'bg-amber-500/20 text-amber-950 dark:text-amber-200 border-amber-500'
                                : 'border-border/80 text-muted-foreground hover:text-foreground'
                            }`}
                            title={isSaved ? 'Remove Bookmark' : 'Save Story'}
                          >
                            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                          </button>

                          <button
                            onClick={() => setSelectedStory(story)}
                            className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-2xs hover:opacity-90 active:scale-95 transition-all flex items-center gap-1"
                          >
                            <span>Read</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                }
              )}
            </div>
          )}
        </div>
      </main>

      {/* =================================================================== */}
      {/* FOOTER & GOOGLE PLAY COMPLIANCE LINKS                              */}
      {/* =================================================================== */}
      <footer className="mt-20 border-t-2 border-border/60 py-8 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-foreground">SimplyBigNews</span>
            <span>&copy; {new Date().getFullYear()} • Clear, Everyday News</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <a href="/privacy" className="hover:text-emerald-500 hover:underline">
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a href="/terms" className="hover:text-emerald-500 hover:underline">
              Terms of Service
            </a>
            <span className="text-border">•</span>
            <a href="/account-deletion" className="hover:text-emerald-500 hover:underline">
              Data &amp; Privacy Choices
            </a>
            <span className="text-border">•</span>
            <a href="mailto:sammyfirst722@gmail.com" className="hover:text-emerald-500 hover:underline">
              Feedback &amp; Inquiries
            </a>
          </div>
        </div>
      </footer>

      {/* =================================================================== */}
      {/* MODALS                                                              */}
      {/* =================================================================== */}
      <StoryDetailModal
        story={selectedStory}
        onClose={() => setSelectedStory(null)}
        textSize={textSize}
        isBookmarked={selectedStory ? bookmarkedIds.includes(selectedStory.id) : false}
        onToggleBookmark={toggleBookmark}
      />

      <CustomRewriteModal
        isOpen={isRewriteModalOpen}
        onClose={() => setIsRewriteModalOpen(false)}
      />
    </div>
  )
}
