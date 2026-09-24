'use client'

import React, { useState } from 'react'
import { PlainRewriteResult } from '@/lib/plain-rewriter'
import { AudioPlayer } from './audio-player'
import {
  X,
  Sparkles,
  Loader2,
  CheckCircle2,
  Lightbulb,
  HelpCircle,
  BookOpen,
  ArrowRight,
} from 'lucide-react'

interface CustomRewriteModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CustomRewriteModal({ isOpen, onClose }: CustomRewriteModalProps) {
  const [headline, setHeadline] = useState('')
  const [articleText, setArticleText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<PlainRewriteResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleRewrite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!articleText.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          headline: headline.trim() || undefined,
          text: articleText.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to rewrite article.')
      }

      setResult(data.data)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error simplifying story.'
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setResult(null)
    setHeadline('')
    setArticleText('')
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[92vh] flex flex-col bg-card border-2 border-border/90 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b-2 border-border/80 bg-card/95 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-foreground">
                Translate Any Story to Plain English
              </h2>
              <p className="text-xs text-muted-foreground font-medium">
                Converts dense or confusing articles into simple, everyday words
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl border-2 border-border/80 text-muted-foreground hover:text-foreground transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 sm:px-8 py-6 space-y-6">
          {!result ? (
            <form onSubmit={handleRewrite} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1.5">
                  Headline (Optional)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Fed policy shift impacts mortgage-backed securities"
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-muted-foreground mb-1.5">
                  Paste The Article or Paragraph Text *
                </label>
                <textarea
                  required
                  rows={6}
                  value={articleText}
                  onChange={(e) => setArticleText(e.target.value)}
                  placeholder="Paste any confusing paragraphs, financial news, medical updates, or legal announcements here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-border bg-background text-sm text-foreground focus:outline-hidden focus:border-primary resize-y"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-destructive/10 border-2 border-destructive/30 text-destructive text-xs font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || !articleText.trim()}
                className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm shadow-md hover:opacity-90 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Translating into Plain English...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Simplify into Simple Words</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Plain Title */}
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Plain English Translation
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-foreground">
                  {result.simplifiedTitle}
                </h3>
              </div>

              {/* Audio Reader */}
              <AudioPlayer
                title={result.simplifiedTitle}
                textToRead={`${result.bigPicture} Here is what happened: ${result.whatHappened.join(
                  ' Next: '
                )} Why it matters: ${result.whyItMatters}`}
              />

              {/* Big Picture */}
              <div className="p-4 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30">
                <div className="flex items-center gap-2 mb-2 font-black text-xs text-emerald-700 dark:text-emerald-300">
                  <Lightbulb className="w-4 h-4" /> THE BIG PICTURE
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground">
                  {result.bigPicture}
                </p>
              </div>

              {/* What Happened */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                  What Happened (In 3 Simple Points)
                </h4>
                {result.whatHappened.map((pt, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-xl bg-card border-2 border-border/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-foreground">{pt}</p>
                  </div>
                ))}
              </div>

              {/* Why It Matters */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
                <div className="flex items-center gap-2 mb-2 font-black text-xs text-amber-800 dark:text-amber-300">
                  <HelpCircle className="w-4 h-4" /> WHY IT MATTERS TO YOU (40+ FOCUS)
                </div>
                <p className="text-sm text-foreground">{result.whyItMatters}</p>
              </div>

              {/* Plain Words */}
              {result.plainWords && result.plainWords.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black uppercase tracking-wider text-muted-foreground">
                    Plain Word Helper
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {result.plainWords.map((pw, i) => (
                      <div key={i} className="p-2.5 rounded-lg border-2 border-border/80 bg-muted/40">
                        <span className="font-extrabold text-xs text-foreground block">{pw.word}</span>
                        <span className="text-xs text-muted-foreground block">{pw.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 text-xs font-bold rounded-xl border-2 border-border hover:bg-muted text-foreground"
                >
                  Translate Another Story
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
