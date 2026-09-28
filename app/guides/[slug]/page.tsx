import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllGuides, getGuideBySlug } from '@/lib/guides'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ListChecks,
  Share2,
} from 'lucide-react'

interface GuidePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const guides = getAllGuides()
  return guides.map((g) => ({
    slug: g.slug,
  }))
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    return {
      title: 'Guide Not Found | SimplyBigNews',
    }
  }

  const title = `${guide.title} | SimplyBigNews Plain-English Guides`
  const description = guide.bigPicture

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
    alternates: {
      canonical: `https://plainnews.vercel.app/guides/${guide.slug}`,
    },
  }
}

export default async function SingleGuidePage({ params }: GuidePageProps) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)

  if (!guide) {
    notFound()
  }

  // Schema.org Article structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.bigPicture,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://plainnews.vercel.app/guides/${guide.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'SimplyBigNews',
      url: 'https://plainnews.vercel.app',
    },
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-3">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border-2 border-border/80 hover:bg-muted font-black text-sm text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All Senior Guides</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-bold text-muted-foreground hover:text-foreground"
          >
            Today&apos;s News
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        {/* Breadcrumb nav */}
        <nav className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span>/</span>
          <Link href="/guides" className="hover:text-foreground">
            Guides
          </Link>
          <span>/</span>
          <span className="text-foreground">{guide.category}</span>
        </nav>

        {/* Title & Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              {guide.categoryIcon} {guide.category}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{guide.readTimeMinutes} min plain read</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight text-balance">
            {guide.title}
          </h1>
        </div>

        {/* The Big Picture / Gist */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/30 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-black text-sm uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" />
            <span>The Big Picture in Plain Words</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground leading-relaxed">
            {guide.bigPicture}
          </p>
        </div>

        {/* What You Need to Know */}
        {guide.whatYouNeedToKnow.length > 0 && (
          <section className="bg-card border-2 border-border/80 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <span>What You Need to Know</span>
            </h2>
            <div className="space-y-3">
              {guide.whatYouNeedToKnow.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-muted/30 border border-border/60 text-base font-medium text-foreground leading-relaxed"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Common Mistakes to Avoid */}
        {guide.commonMistakesToAvoid.length > 0 && (
          <section className="bg-card border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <span>Common Mistakes &amp; Traps to Avoid</span>
            </h2>
            <div className="space-y-3">
              {guide.commonMistakesToAvoid.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-base font-semibold text-foreground leading-relaxed"
                >
                  <span className="text-amber-600 dark:text-amber-400 font-black text-lg shrink-0">⚠️</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Steps Checklist */}
        {guide.actionSteps.length > 0 && (
          <section className="bg-card border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 space-y-4">
            <h2 className="text-xl sm:text-2xl font-black text-foreground flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-emerald-600" />
              <span>Simple Steps to Take Today</span>
            </h2>
            <div className="space-y-3">
              {guide.actionSteps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-base font-bold text-foreground leading-relaxed"
                >
                  <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Footer Navigation */}
        <div className="pt-6 border-t-2 border-border/80 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-muted hover:bg-muted/80 font-black text-sm text-foreground transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Browse More Senior Guides</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-sm transition-all"
          >
            <span>Read Today&apos;s News</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
