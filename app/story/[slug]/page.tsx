import React from 'react'
import { Metadata } from 'next'
import { fetchLiveNews } from '@/lib/news-fetcher'
import { getStoryBySlug } from '@/lib/storage'
import { DailyBriefingSignup } from '@/components/daily-briefing-signup'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, HelpCircle, Lightbulb, ExternalLink, Share2, MapPin } from 'lucide-react'
import { formatStateName } from '@/lib/location-extractor'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function resolveStory(slug: string) {
  let story = getStoryBySlug(slug)
  if (!story) {
    const stories = await fetchLiveNews(false)
    story = stories.find((s) => s.slug === slug) || null
  }
  return story
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await resolveStory(slug)

  if (!story) {
    return {
      title: 'Story Not Found — SimplyBigNews',
    }
  }

  return {
    title: `${story.simplifiedTitle} — SimplyBigNews`,
    description: story.bigPicture,
    openGraph: {
      title: story.simplifiedTitle,
      description: story.bigPicture,
      type: 'article',
      images: [story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'],
    },
    twitter: {
      card: 'summary_large_image',
      title: story.simplifiedTitle,
      description: story.bigPicture,
      images: [story.imageUrl || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80'],
    },
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params
  const story = await resolveStory(slug)

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background text-foreground text-center">
        <h1 className="font-masthead text-3xl font-black text-red-600 mb-4">Story no longer available</h1>
        <p className="text-muted-foreground mb-8">We could not find the article you are looking for.</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-500 transition-colors">
          Return to Home
        </Link>
      </div>
    )
  }

  const titleClass = 'font-fancy text-2xl sm:text-3xl lg:text-4xl font-black text-balance'
  const bodyClass = 'text-base sm:text-lg leading-relaxed text-pretty'

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to News</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12 space-y-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600/15 text-blue-700 dark:text-blue-300 border border-blue-600/30">
              {story.categoryLabel}
            </span>
            {story.state && (
              <Link
                href={`/?state=${story.state}#news-map-hero`}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-600 hover:bg-red-500 text-white shadow-xs transition-colors"
                title="View on 50-State USA Radar Map"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{formatStateName(story.state)} • View On Map</span>
              </Link>
            )}
            <span className="text-sm text-muted-foreground font-semibold">
              {story.source} • {story.timeAgo}
            </span>
          </div>
          <h1 className={titleClass}>{story.simplifiedTitle}</h1>
        </div>

        {story.imageUrl && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border-2 border-border/70 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.imageUrl}
              alt={story.simplifiedTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-5 sm:p-6 rounded-2xl bg-blue-600/10 border-2 border-blue-600/30">
          <div className="flex items-center gap-2 mb-3 font-black text-sm text-blue-700 dark:text-blue-300">
            <Lightbulb className="w-5 h-5" /> THE BIG PICTURE
          </div>
          <p className={`${bodyClass} font-semibold`}>
            {story.bigPicture}
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            What Happened (In 3 Simple Points)
          </h2>
          <div className="space-y-3">
            {story.whatHappened.map((point, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 rounded-2xl bg-card border-2 border-border/80 shadow-2xs">
                <div className="mt-0.5 rounded-full bg-blue-600/20 p-1 text-blue-600 dark:text-blue-400 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <p className={bodyClass}>{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 rounded-2xl bg-red-600/10 border-2 border-red-600/30">
          <div className="flex items-center gap-2 mb-3 font-black text-sm text-red-700 dark:text-red-300">
            <HelpCircle className="w-5 h-5" /> WHY IT MATTERS — EVERYDAY TAKEAWAY
          </div>
          <p className={bodyClass}>{story.whyItMatters}</p>
        </div>

        {story.plainWords && story.plainWords.length > 0 && (
          <div className="space-y-4 pt-4 border-t-2 border-border/60">
            <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
              Plain Word Helper
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {story.plainWords.map((pw, i) => (
                <div key={i} className="p-4 rounded-xl border-2 border-border/80 bg-muted/40">
                  <span className="font-extrabold text-base block mb-1">{pw.word}</span>
                  <span className="text-sm text-muted-foreground">{pw.meaning}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="pt-2">
          <DailyBriefingSignup variant="inline" />
        </div>

        <div className="pt-8 pb-12 text-center">
          <a
            href={story.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground underline underline-offset-4"
          >
            <span>Read original reporting at {story.source}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </main>
    </div>
  )
}
