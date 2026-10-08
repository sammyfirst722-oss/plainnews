'use client'

import Link from 'next/link'
import React, { useState, useEffect, useMemo } from 'react'
import { NewsStory, NewsCategory, TextSize } from '@/lib/types'
import { TextSizeController } from './text-size-controller'
import { StoryDetailModal } from './story-detail-modal'
import { AudioPlayer } from './audio-player'
import { DailyBriefingSignup } from './daily-briefing-signup'
import { SpotTheFake } from './spot-the-fake'
import { WaterCooler } from './water-cooler'
import { AdBanner } from './ad-banner'
import { VipModal } from './vip-modal'
import NewsMap from './news-map'
import {
  NewsIqHeaderPill,
  NewsIqDailyChallengeCard,
  NewsIqScorecardModal,
  rewardGlobalNewsIqXp,
} from './news-iq'
import { formatStateName } from '@/lib/location-extractor'
import { toast } from 'sonner'
import {
  Newspaper,
  Crown,
  Search,
  RotateCw,
  MapPin,
  Bookmark,
  Clock,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Share2,
  BookOpen,
  Filter,
  Radio,
  Flame,
  Star,
  Award,
} from 'lucide-react'

interface PlainNewsClientProps {
  initialStories: NewsStory[]
}

const CATEGORY_ROWS: { id: NewsCategory | 'saved'; label: string; icon: string }[][] = [
  // Row 1: The Mega Trends & Mainstream Wire
  [
    { id: 'all', label: 'Top Trending', icon: '🔥' },
    { id: 'us-world', label: 'US & World', icon: '⚡' },
    { id: 'tech', label: 'AI & Tech', icon: '🤖' },
    { id: 'money', label: 'Money & Markets', icon: '💰' },
  ],
  // Row 2: Entertainment, Sports, Science & Health
  [
    { id: 'entertainment', label: 'Pop Culture', icon: '🎬' },
    { id: 'sports', label: 'Sports & Records', icon: '🏆' },
    { id: 'science', label: 'Space & Science', icon: '🚀' },
    { id: 'health', label: 'Health & Wellness', icon: '🩺' },
  ],
  // Row 3: Uplifting, Viral & Personal
  [
    { id: 'viral', label: 'Wild & Viral', icon: '🌟' },
    { id: 'good-news', label: 'Good News', icon: '☀️' },
    { id: 'living', label: 'Everyday Life', icon: '🏡' },
    { id: 'saved', label: 'Saved Stories', icon: '🔖' },
  ],
]

export function PlainNewsClient({ initialStories }: PlainNewsClientProps) {
  const [stories, setStories] = useState<NewsStory[]>(initialStories)
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory | 'saved'>('all')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStory, setSelectedStory] = useState<NewsStory | null>(null)
  const [textSize, setTextSize] = useState<TextSize>('standard')
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [language, setLanguage] = useState<'en' | 'es'>('en')
  const [isVipModalOpen, setIsVipModalOpen] = useState(false)
  const [isNewsIqModalOpen, setIsNewsIqModalOpen] = useState(false)
  const [isVip, setIsVip] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<string>('Just now')
  const [readStoryIds, setReadStoryIds] = useState<string[]>([])

  // Load saved bookmarks and VIP status
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        const stateParam = params.get('state')?.toLowerCase()
        if (stateParam) {
          setSelectedState(stateParam)
        }
        if (
          params.get('upgraded') === 'true' ||
          params.get('tester') === 'true' ||
          params.get('email')?.toLowerCase() === 'sammyfirstplaystore@gmail.com'
        ) {
          localStorage.setItem('simplybignews_vip', 'true')
          setIsVip(true)
        } else {
          setIsVip(localStorage.getItem('simplybignews_vip') === 'true')
        }
      }
      const saved = localStorage.getItem('plainnews_bookmarks')
      if (saved) {
        setBookmarkedIds(JSON.parse(saved))
      }
    } catch {}
  }, [])

  useEffect(() => {
    const handleVipChange = () => {
      try {
        setIsVip(localStorage.getItem('simplybignews_vip') === 'true')
      } catch {}
    }
    window.addEventListener('simplybignews_vip_changed', handleVipChange)
    return () => window.removeEventListener('simplybignews_vip_changed', handleVipChange)
  }, [])

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem('plainnews_bookmarks', JSON.stringify(next))
      } catch {}
      return next
    })
  }

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

  const handleStoryRead = (story: NewsStory) => {
    setSelectedStory(story)
    if (!readStoryIds.includes(story.id)) {
      setReadStoryIds((prev) => [...prev, story.id])
      rewardGlobalNewsIqXp(10, 'Reading Story in Plain English')
      toast.success('+10 XP towards News IQ!', {
        description: 'Keep reading to boost your daily News IQ score.',
      })
    }
  }

  const handleStateSelect = (state: string | null) => {
    setSelectedState(state)
    if (state) {
      toast.info(`Filtered wire to ${formatStateName(state)}`, {
        description: 'Showing verified local & regional reports.',
      })
    }
  }

  // Filter stories by category, search, and state
  const filteredStories = useMemo(() => {
    return stories.filter((story) => {
      if (selectedCategory === 'saved') {
        if (!bookmarkedIds.includes(story.id)) return false
      } else if (selectedCategory !== 'all' && story.category !== selectedCategory) {
        return false
      }

      if (selectedState) {
        if (!story.state || story.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = story.simplifiedTitle.toLowerCase().includes(q)
        const matchesOrig = story.title.toLowerCase().includes(q)
        const matchesSummary = story.bigPicture.toLowerCase().includes(q)
        const matchesState = story.state?.toLowerCase().includes(q)
        if (!matchesTitle && !matchesOrig && !matchesSummary && !matchesState) return false
      }

      return true
    })
  }, [stories, selectedCategory, selectedState, searchQuery, bookmarkedIds])

  // Top spotlight story
  const spotlightStory = filteredStories[0] || stories[0]
  const remainingStories = filteredStories.slice(1)

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

  const headlineClass =
    textSize === 'xlarge'
      ? 'text-2xl sm:text-3xl font-black'
      : textSize === 'large'
      ? 'text-xl sm:text-2xl font-black'
      : 'text-lg sm:text-xl font-black'

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
          {/* Brand Logo & Editorial Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-red-600 text-white flex items-center justify-center shadow-md border-2 border-blue-400 shrink-0">
              <Newspaper className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-masthead font-black text-xl sm:text-2xl tracking-tight text-foreground">
                  SimplyBigNews
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white border border-red-500">
                  50-State Radar
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-semibold hidden sm:block">One Nation - One Truth - One Location</p>
            </div>
          </div>

          {/* Controls: News IQ Pill, VIP, Translate, Text Size */}
          <div className="flex items-center gap-2 sm:gap-3">
            <NewsIqHeaderPill onOpenModal={() => setIsNewsIqModalOpen(true)} />

            {isVip ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-blue-600/15 text-blue-800 dark:text-blue-300 border-2 border-blue-600/30 text-xs font-black">
                <Crown className="w-3.5 h-3.5 fill-current text-blue-600" />
                <span>VIP Supporter</span>
              </span>
            ) : (
              <button
                onClick={() => setIsVipModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-red-600/15 to-blue-600/15 hover:from-red-600/25 hover:to-blue-600/25 text-foreground border-2 border-red-600/30 text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
                title="Support SimplyBigNews and remove ads ($2.99/mo)"
              >
                <Crown className="w-3.5 h-3.5 fill-current text-red-600" />
                <span className="hidden sm:inline">Go VIP ($2.99)</span>
                <span className="sm:hidden">VIP</span>
              </button>
            )}

            <button
              onClick={() => setLanguage((l) => (l === 'en' ? 'es' : 'en'))}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-card border-2 border-border/80 hover:border-blue-500/50 text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
              title="Switch Language (English / Español)"
            >
              <span>{language === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}</span>
            </button>

            <TextSizeController textSize={textSize} setTextSize={setTextSize} />
          </div>
        </div>
      </header>

      {/* =================================================================== */}
      {/* GRAND AMERICAN NEWSPAPER MASTHEAD                                   */}
      {/* =================================================================== */}
      <div className="border-b-4 border-primary/20 bg-gradient-to-b from-blue-900/5 via-background to-background py-5 sm:py-7">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs font-black uppercase tracking-widest text-muted-foreground">
            <span>★ ★ ★</span>
            <span>The All-American 50-State Plain Newsroom</span>
            <span>★ ★ ★</span>
          </div>

          <h1 className="font-masthead text-3xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight text-balance">
            SIMPLY BIG NEWS
          </h1>

          <p className="font-fancy text-sm sm:text-base text-muted-foreground font-medium max-w-2xl mx-auto text-balance">
            The day\\'s biggest news rewritten into calm, everyday English. Centered around live regional reports across all 50 states.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs font-bold text-muted-foreground">
            <span className="text-foreground font-extrabold">{todayFormatted.date}</span>
            <span>•</span>
            <span className="text-blue-600 dark:text-blue-400 font-extrabold uppercase tracking-wider">
              {todayFormatted.edition}
            </span>
            <span>•</span>
            <span>Updated {lastRefreshed}</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg border border-border/80 hover:bg-muted font-bold text-foreground text-[11px] active:scale-95 transition-all cursor-pointer ml-1"
            >
              <RotateCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-8">
        {/* =================================================================== */}
        {/* CENTERPIECE HERO: 50-STATE INTERACTIVE NEWS RADAR                   */}
        {/* =================================================================== */}
        <section id="news-map-hero">
          <NewsMap
            stories={stories}
            onStoryClick={handleStoryRead}
            selectedState={selectedState}
            onSelectState={handleStateSelect}
            onRewardXp={rewardGlobalNewsIqXp}
          />
        </section>

        {/* =================================================================== */}
        {/* CATEGORY SELECTOR PILLS (3 ROWS)                                    */}
        {/* =================================================================== */}
        <div className="space-y-2.5 bg-card/70 border-2 border-border/80 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-muted-foreground px-1">
            <span className="flex items-center gap-2 text-foreground font-black text-xs sm:text-sm">
              <span>Trending Channels</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-600/30">
                Live
              </span>
            </span>
            <span className="text-[11px] font-bold text-muted-foreground">
              Filter by topic
            </span>
          </div>

          <div className="space-y-2">
            {CATEGORY_ROWS.map((row, rowIndex) => (
              <div key={rowIndex} className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {row.map((cat) => {
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
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs sm:text-sm font-black border-2 whitespace-nowrap transition-all cursor-pointer ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                          : 'bg-card text-foreground border-border/80 hover:border-blue-500/50 hover:bg-muted/40'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
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
            placeholder="Search news by topic, state, Social Security, company, health..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border-2 border-border/80 bg-card text-sm text-foreground focus:outline-hidden focus:border-blue-600 shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* =================================================================== */}
        {/* ACTIVE STATE WIRE BANNER (WHEN USER FILTERED TO A STATE)            */}
        {/* =================================================================== */}
        {selectedState && (
          <div className="p-4 sm:p-5 rounded-3xl border-2 border-red-600/40 bg-gradient-to-r from-red-600/15 via-card to-blue-600/15 flex flex-wrap items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-2xl bg-red-600 text-white shadow-sm">
                <MapPin className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-masthead text-base sm:text-lg font-black text-foreground uppercase">
                    {formatStateName(selectedState)} News Wire
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
                    {filteredStories.length} Dispatches
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  Showing local dispatches verified for {formatStateName(selectedState)} residents.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleStateSelect(null)}
              className="px-4 py-2 rounded-xl bg-card border-2 border-border/80 hover:bg-muted font-bold text-xs text-foreground transition-all cursor-pointer shadow-xs"
            >
              ← Clear Filter & Return to All 50 States
            </button>
          </div>
        )}

        {/* =================================================================== */}
        {/* SPOTLIGHT / TOP STORY CARD                                          */}
        {/* =================================================================== */}
        {spotlightStory && selectedCategory !== 'saved' && !searchQuery && (
          <div className="bg-card border-2 border-blue-600/60 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1 rounded-bl-2xl bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider">
              ★ #1 Trending Wire Story
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Image banner */}
              <div className="lg:col-span-5 relative aspect-video sm:aspect-4/3 rounded-2xl overflow-hidden border-2 border-border/80">
                <img
                  src={spotlightStory.imageUrl}
                  alt={spotlightStory.simplifiedTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-black/75 text-white backdrop-blur-xs">
                    {spotlightStory.categoryLabel}
                  </span>
                  {spotlightStory.state && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-red-600 text-white shadow-xs">
                      📍 {formatStateName(spotlightStory.state)}
                    </span>
                  )}
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
                  onClick={() => handleStoryRead(spotlightStory)}
                  className="font-fancy text-2xl sm:text-3xl lg:text-4xl font-black text-foreground hover:text-blue-600 leading-tight cursor-pointer transition-colors text-balance"
                >
                  {spotlightStory.simplifiedTitle}
                </h2>

                <div className="p-3.5 rounded-2xl bg-blue-600/10 border-2 border-blue-600/30">
                  <p className="text-sm font-semibold text-foreground text-pretty">
                    <span className="font-extrabold text-blue-700 dark:text-blue-300 mr-1.5">
                      THE GIST:
                    </span>
                    {spotlightStory.bigPicture}
                  </p>
                </div>

                {/* Actions: Listen & Read */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    onClick={() => handleStoryRead(spotlightStory)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
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
                    className={`p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                      bookmarkedIds.includes(spotlightStory.id)
                        ? 'bg-blue-600/20 text-blue-950 dark:text-blue-200 border-blue-600'
                        : 'border-border/80 text-muted-foreground hover:text-foreground'
                    }`}
                    title="Bookmark Story"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarkedIds.includes(spotlightStory.id) ? 'fill-current text-blue-600' : ''
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DAILY RETENTION HOOK 1: NEWS IQ DAILY CHALLENGE */}
        {!searchQuery && selectedCategory === 'all' && !selectedState && (
          <NewsIqDailyChallengeCard onOpenScorecard={() => setIsNewsIqModalOpen(true)} />
        )}

        {/* DAILY RETENTION HOOK 2: SPOT THE FAKE HEADLINE */}
        {!searchQuery && selectedCategory === 'all' && !selectedState && (
          <SpotTheFake onOpenVipModal={() => setIsVipModalOpen(true)} />
        )}

        {/* HIGH-CPM DISPLAY AD BANNER / VIP HOOK */}
        <AdBanner onOpenVipModal={() => setIsVipModalOpen(true)} slot="top" />

        {/* DAILY RETENTION HOOK 3: WATER COOLER 60-SEC DEBATE */}
        {!searchQuery && selectedCategory === 'all' && !selectedState && (
          <WaterCooler />
        )}

        {/* =================================================================== */}
        {/* STORIES FEED GRID                                                  */}
        {/* =================================================================== */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-masthead text-base sm:text-lg font-black uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <span>{selectedState ? `${formatStateName(selectedState)} Dispatches` : 'Latest News Stories'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted font-bold text-foreground">
                {filteredStories.length}
              </span>
            </h3>
          </div>

          {filteredStories.length === 0 ? (
            <div className="p-12 text-center bg-card border-2 border-border/80 rounded-3xl space-y-3">
              <div className="text-4xl">📰</div>
              <h4 className="font-masthead text-lg font-bold">No dispatches found</h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                {selectedCategory === 'saved'
                  ? 'You have not saved any stories yet. Tap the bookmark icon on any article to save it for later.'
                  : selectedState
                  ? `No breaking reports specifically tagged for ${formatStateName(selectedState)} right now. Click below to view all 50 states.`
                  : 'Try searching with different words or reset the category filter.'}
              </p>
              {selectedState && (
                <button
                  onClick={() => handleStateSelect(null)}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                >
                  Return to All 50 States
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {(selectedCategory === 'saved' || searchQuery || selectedState ? filteredStories : remainingStories).map(
                (story) => {
                  const isSaved = bookmarkedIds.includes(story.id)
                  const audioScript = `${story.bigPicture} First: ${story.whatHappened.join(
                    ' Next: '
                  )} Why it matters: ${story.whyItMatters}`

                  return (
                    <article
                      key={story.id}
                      className="flex flex-col bg-card border-2 border-border/90 hover:border-blue-600/70 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl transition-all duration-200 group"
                    >
                      {/* Card Thumbnail Image */}
                      {story.imageUrl && (
                        <div
                          onClick={() => handleStoryRead(story)}
                          className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-border/60 mb-3.5 cursor-pointer"
                        >
                          <img
                            src={story.imageUrl}
                            alt={story.simplifiedTitle}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            loading="lazy"
                          />
                          <div className="absolute top-2 left-2 flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-black/75 text-white backdrop-blur-xs">
                              {story.categoryLabel}
                            </span>
                            {story.state && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleStateSelect(story.state!)
                                }}
                                className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-red-600 text-white shadow-xs cursor-pointer hover:bg-red-500 transition-colors"
                              >
                                📍 {formatStateName(story.state)}
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Meta: Source & Time */}
                      <div className="flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-muted-foreground mb-3">
                        <span className="px-2.5 py-1 rounded-xl bg-muted text-foreground font-black text-xs uppercase tracking-wide">
                          {story.source}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-foreground/80">
                          <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          {story.timeAgo}
                        </span>
                      </div>

                      {/* Simplified Headline in Fancy Serif */}
                      <h4
                        onClick={() => handleStoryRead(story)}
                        className={`font-fancy ${headlineClass} text-foreground group-hover:text-blue-600 transition-colors cursor-pointer mb-3 leading-snug tracking-tight text-balance`}
                      >
                        {story.simplifiedTitle}
                      </h4>

                      {/* Summary */}
                      <p className={`${cardBodyClass} text-muted-foreground flex-1 mb-4 text-pretty`}>
                        {story.bigPicture}
                      </p>

                      {/* Card Bottom Controls */}
                      <div className="flex items-center justify-between pt-4 border-t-2 border-border/70 gap-2">
                        <AudioPlayer compact title={story.simplifiedTitle} textToRead={audioScript} />

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleBookmark(story.id)}
                            className={`p-2 rounded-xl border-2 transition-all cursor-pointer ${
                              isSaved
                                ? 'bg-blue-600/20 text-blue-950 dark:text-blue-200 border-blue-600'
                                : 'border-border/80 text-muted-foreground hover:text-foreground'
                            }`}
                            title={isSaved ? 'Remove Bookmark' : 'Save Story'}
                          >
                            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current text-blue-600' : ''}`} />
                          </button>

                          <Link
                            href={`/story/${story.slug}`}
                            className="p-2 rounded-xl border-2 border-border/80 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Open Story Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleStoryRead(story)}
                            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black shadow-md active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <span>Read</span>
                            <ChevronRight className="w-4 h-4" />
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
      {/* FOOTER & COMPLIANCE LINKS                                           */}
      {/* =================================================================== */}
      <footer className="mt-20 border-t-2 border-border/60 py-8 px-4 text-center text-xs text-muted-foreground">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-masthead font-black text-foreground">SimplyBigNews</span>
            <span>&copy; {new Date().getFullYear()} • One Nation - One Truth - One Location</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <a href="/privacy" className="hover:text-blue-600 hover:underline">
              Privacy Policy
            </a>
            <span className="text-border">•</span>
            <a href="/terms" className="hover:text-blue-600 hover:underline">
              Terms of Service
            </a>
            <span className="text-border">•</span>
            <a href="/account-deletion" className="hover:text-blue-600 hover:underline">
              Data &amp; Privacy Choices
            </a>
            <span className="text-border">•</span>
            <a href="mailto:sammyfirst722@gmail.com" className="hover:text-blue-600 hover:underline">
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

      <NewsIqScorecardModal
        isOpen={isNewsIqModalOpen}
        onClose={() => setIsNewsIqModalOpen(false)}
      />

      <VipModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        onVipSuccess={() => setIsVip(true)}
      />
    </div>
  )
}



