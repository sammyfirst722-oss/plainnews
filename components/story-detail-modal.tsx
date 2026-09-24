'use client'

import React, { useState, useEffect } from 'react'
import { NewsStory, TextSize } from '@/lib/types'
import { AudioPlayer } from './audio-player'
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
    const textToShare = `${story.simplifiedTitle}\n\n${story.bigPicture}\n\nRead more on SimplyBigNews.`
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: story.simplifiedTitle,
          text: textToShare,
          url: `${window.location.origin}/story/${story.slug}`,
        })
      } catch {
        // Fall back to copy
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

  // Text size classes
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
      : 'text-sm sm:text-base leading-relaxed'

  const fullAudioScript = `${story.bigPicture} First: ${story.whatHappened.join(' Next: ')} Why it matters: ${story.whyItMatters}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-card border-2 border-border/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Top Header Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b-2 border-border/80 bg-card/95 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-primary/10 text-primary border border-primary/20">
              {story.categoryLabel}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              {story.source} • {story.timeAgo}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(story.id)}
              className={`p-2 rounded-xl border-2 transition-all ${
                isBookmarked
                  ? 'bg-amber-500/20 text-amber-950 dark:text-amber-200 border-amber-500'
                  : 'border-border/80 text-muted-foreground hover:text-foreground'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save for Later'}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl border-2 border-border/80 text-muted-foreground hover:text-foreground transition-all"
              title="Share Story"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
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
          {/* Plain English Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2">
              <BookOpen className="w-3.5 h-3.5" /> 8th Grade Reading Level • Plain English
            </div>
            <h1 className={`${titleClass} text-foreground text-balance`}>
              {story.simplifiedTitle}
            </h1>
            <p className="mt-2 text-xs text-muted-foreground italic">
              Original Headline: &quot;{story.title}&quot;
            </p>
          </div>

          {/* Audio Player Bar */}
          <AudioPlayer title={story.simplifiedTitle} textToRead={fullAudioScript} />

          {/* Image Banner */}
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
          <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30">
            <div className="flex items-center gap-2 mb-2 font-black text-sm text-emerald-700 dark:text-emerald-300">
              <Lightbulb className="w-4 h-4" /> THE BIG PICTURE
            </div>
            <p className={`${bodyClass} font-semibold text-foreground text-pretty`}>
              {story.bigPicture}
            </p>
          </div>

          {/* Section 2: What Happened (In Plain Words) */}
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
                  <div className="mt-0.5 rounded-full bg-emerald-500/20 p-1 text-emerald-600 dark:text-emerald-400 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <p className={`${bodyClass} text-foreground text-pretty`}>{point}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Why It Matters to You */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
            <div className="flex items-center gap-2 mb-2 font-black text-sm text-amber-800 dark:text-amber-300">
              <HelpCircle className="w-4 h-4" /> WHY IT MATTERS TO YOU (40+ GUIDE)
            </div>
            <p className={`${bodyClass} text-foreground text-pretty`}>{story.whyItMatters}</p>
          </div>

          {/* Section 4: Plain Word Helper (Jargon Buster) */}
          {story.plainWords && story.plainWords.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
                Plain Word Helper
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {story.plainWords.map((pw, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border-2 border-border/80 bg-muted/40"
                  >
                    <span className="font-extrabold text-sm text-foreground block">
                      {pw.word}
                    </span>
                    <span className="text-xs text-muted-foreground leading-normal mt-0.5 block">
                      {pw.meaning}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Original Source Link */}
          <div className="pt-2 pb-4 text-center">
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              <span>Read original reporting at {story.source}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Modal Bottom Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between px-5 py-3.5 border-t-2 border-border/80 bg-card/95 backdrop-blur-md">
          <button
            onClick={() => onToggleBookmark(story.id)}
            className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5"
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
            {isBookmarked ? 'Saved to Bookmarks' : 'Save for Later'}
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-sm hover:opacity-90 active:scale-95 transition-all"
          >
            Done Reading
          </button>
        </div>
      </div>
    </div>
  )
}
