'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { EvergreenGuide, GuideCategory } from '@/lib/guides'
import {
  BookOpen,
  Search,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react'

interface GuidesClientProps {
  guides: EvergreenGuide[]
}

const CATEGORY_TABS: { id: GuideCategory | 'All'; label: string; icon: string }[] = [
  { id: 'All', label: 'All Guides', icon: '📚' },
  { id: 'Social Security & Retirement', label: 'Social Security', icon: '🏛️' },
  { id: 'Medicare & Health', label: 'Medicare & Health', icon: '🩺' },
  { id: 'Scams & Fraud Safety', label: 'Scam Safety', icon: '🛡️' },
  { id: 'Money & Taxes', label: 'Money & Taxes', icon: '💰' },
]

export function GuidesClient({ guides }: GuidesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory | 'All'>('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredGuides = useMemo(() => {
    return guides.filter((guide) => {
      if (selectedCategory !== 'All' && guide.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesTitle = guide.title.toLowerCase().includes(q)
        const matchesSummary = guide.bigPicture.toLowerCase().includes(q)
        const matchesPoints = guide.whatYouNeedToKnow.some((p) => p.toLowerCase().includes(q))
        if (!matchesTitle && !matchesSummary && !matchesPoints) return false
      }
      return true
    })
  }, [guides, selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-border/80 hover:bg-muted font-black text-sm text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Today&apos;s News</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Senior Life &amp; Money Guides
            </span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="border-b-2 border-border/60 bg-muted/20 py-10 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-500/30">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>20 Plain-English Senior Guides</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground text-balance">
            Clear, Calm Explanations for Real Everyday Life
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            No jargon. No confusing legal terms. Just simple answers to your biggest questions about Social Security, Medicare, scams, and family money.
          </p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 pt-8 space-y-8">
        {/* Search */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides (e.g. COLA, Medicare Part B, credit freeze, scams)..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-border/80 bg-card text-base text-foreground focus:outline-hidden focus:border-primary shadow-sm"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id
            const count =
              tab.id === 'All'
                ? guides.length
                : guides.filter((g) => g.category === tab.id).length

            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-extrabold border-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-102'
                    : 'bg-card text-foreground border-border/80 hover:border-primary/50'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Guide Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGuides.map((guide) => (
            <article
              key={guide.slug}
              className="flex flex-col bg-card border-2 border-border/80 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all group"
            >
              <div className="flex items-center justify-between gap-2 text-xs font-bold text-muted-foreground mb-3">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted text-foreground">
                  <span>{guide.categoryIcon}</span>
                  <span>{guide.category}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{guide.readTimeMinutes} min</span>
                </span>
              </div>

              <h2 className="text-xl font-black text-foreground group-hover:text-emerald-600 transition-colors mb-3 leading-snug">
                <Link href={`/guides/${guide.slug}`}>
                  {guide.title}
                </Link>
              </h2>

              <p className="text-sm text-muted-foreground flex-1 mb-6 leading-relaxed">
                {guide.bigPicture}
              </p>

              <div className="pt-4 border-t-2 border-border/60 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {guide.actionSteps.length} Action Steps
                </span>

                <Link
                  href={`/guides/${guide.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-black shadow-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  <span>Read Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredGuides.length === 0 && (
          <div className="text-center py-16 bg-card border-2 border-border/80 rounded-3xl space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="text-lg font-bold">No guides matched your search</h3>
            <p className="text-xs text-muted-foreground">Try a different keyword or reset the category filter.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
              }}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
