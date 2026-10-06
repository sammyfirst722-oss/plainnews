'use client'

import React, { useState, useEffect } from 'react'
import { NewsStory, TextSize } from '@/lib/types'
import { AudioPlayer } from './audio-player'
import { formatStateName } from '@/lib/location-extractor'
import {
  X,
  Bookmark,
  Share2,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  Check,
  BookOpen,
  MapPin,
} from 'lucide-react'

interface StoryDetailModalProps {
  story: NewsStory | null
  onClose: () => void
  textSize: TextSize
  isBookmarked: boolean
  onToggleBookmark: (id: string) => void
}

export function StoryDetailModal({
  story,
  onClose,
  textSize,
  isBookmarked,
  onToggleBookmark,
}: StoryDetailModalProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])


  if (!story) return null

  const handleShare = async () => {
    const textToShare = `${story.simplifiedTitle}\n\n${story.bigPicture}\n\nRead in plain English on SimplyBigNews.`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: story.simplifiedTitle,
          text: textToShare,
          url: `${window.location.origin}/story/${story.slug}`,
        })
      } catch {
        copyToClipboard(textToShare)
      }
    } else {
      copyToClipboard(textToShare)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const titleClass =
    textSize === 'xlarge'
      ? 'text-2xl sm:text-3xl font-black'
      : textSize === 'large'
      ? 'text-xl sm:text-2xl font-black'
      : 'text-lg sm:text-xl font-extrabold'

  const bodyClass =
    textSize === 'xlarge'
      ? 'text-lg leading-relaxed'
      : textSize === 'large'
      ? 'text-base leading-relaxed'
      : 'text-sm leading-relaxed'

  const fullAudioScript = `${story.simplifiedTitle}. The big picture: ${
    story.bigPicture
  } What happened: ${story.whatHappened.join(' ')} Why it matters: ${story.whyItMatters}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl border-2 border-border/90 bg-card text-foreground shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 px-5 sm:px-8 py-3.5 border-b-2 border-border/80 bg-card/95 backdrop-blur-md flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-wide">
              {story.categoryLabel}
            </span>
            {story.state && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-600/15 text-red-700 dark:text-red-300 border border-red-600/30 font-black text-xs">
                <MapPin className="w-3 h-3 text-red-600" />
                <span>{formatStateName(story.state)}</span>
              </span>
            )}
            <span className="text-xs text-muted-foreground font-semibold hidden sm:inline">
              {story.source} • {story.timeAgo}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(story.id)}
              className={`p-2 rounded-xl border-2 transition-all ${
                isBookmarked
                  ? 'bg-blue-600/20 text-blue-950 dark:text-blue-200 border-blue-600'
                  : 'border-border/80 text-muted-foreground hover:text-foreground'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save for Later'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current text-blue-600' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border-2 border-border/80 text-muted-foreground hover:text-foreground transition-all"
              title="Share Story"
            >
              {copied ? <Check className="w-4 h-4 text-blue-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border-2 border-border/80 text-muted-foreground hover:text-foreground transition-all"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Plain English • 2 Min Read • +10 News IQ XP
            </div>
            <h1 className={`font-fancy ${titleClass} text-foreground text-balance`}>
              {story.simplifiedTitle}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground italic">
              Original Wire Headline: &quot;{story.title}&quot;
            </p>
          </div>

          <AudioPlayer title={story.simplifiedTitle} textToRead={fullAudioScript} />

          {story.imageUrl && (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-border/70 shadow-sm">
              <img
                src={story.imageUrl}
                alt={story.simplifiedTitle}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Section 1: The Big Picture */}
          <div className="p-4 sm:p-5 rounded-2xl bg-blue-600/10 border-2 border-blue-600/30">
            <div className="flex items-center gap-2 mb-2 font-black text-sm text-blue-700 dark:text-blue-300">
              <Lightbulb className="w-4 h-4" /> THE BIG PICTURE
            </div>
            <p className={`${bodyClass} font-semibold text-foreground text-pretty`}>
              {story.bigPicture}
            </p>
          </div>

          {/* Section 2: What Happened */}
          <div className="space-y-3">
            <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              What Happened (In 3 Simple Points)
            </h2>
            <div className="space-y-2.5">
              {story.whatHappened.map((point, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-card border-2 border-border/80 shadow-2xs"
                >
                  <div className="mt-0.5 rounded-full bg-blue-600/20 p-1 text-blue-600 dark:text-blue-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className={`${bodyClass} text-foreground text-pretty`}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Why It Matters (Universal Plain English Takeaway) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-red-600/10 border-2 border-red-600/30">
            <div className="flex items-center gap-2 mb-2 font-black text-sm text-red-700 dark:text-red-300">
              <HelpCircle className="w-4 h-4" /> WHY IT MATTERS — PLAIN ENGLISH TAKEAWAY
            </div>
            <p className={`${bodyClass} text-foreground text-pretty`}>{story.whyItMatters}</p>
          </div>

          {/* Section 4: Plain Words Helper */}
          {story.plainWords && story.plainWords.length > 0 && (
            <div className="space-y-3 pt-2">
              <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                Jargon Buster (Everyday Meanings)
              </h2>
              <div className="grid grid-cols-1 gap-2.5">
                {story.plainWords.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-muted/50 border-2 border-border/80 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2.5"
                  >
                    <span className="font-extrabold text-xs sm:text-sm text-foreground shrink-0 underline decoration-blue-500/50 underline-offset-4">
                      {item.word}:
                    </span>
                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                      {item.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Source Link */}
          <div className="pt-4 border-t-2 border-border/60 flex items-center justify-between text-xs text-muted-foreground">
            <span>Reported by {story.source}</span>
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-bold text-blue-600 hover:underline"
            >
              <span>Original Wire Source</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
