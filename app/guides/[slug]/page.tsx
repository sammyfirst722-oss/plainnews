import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { getPublishedGuide, getPublishedGuides } from '@/lib/guides'

interface PageProps {
  params: Promise<{ slug: string }>
}

// Only reviewed guides exist. Anything else is a 404.
export const dynamicParams = false

export async function generateStaticParams() {
  return getPublishedGuides().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const g = getPublishedGuide(slug)
  if (!g) return { title: 'Guide not found — SimplyBigNews' }
  return {
    title: `${g.title} — SimplyBigNews`,
    description: g.bigPicture,
    alternates: { canonical: `https://plainnews.vercel.app/guides/${g.slug}` },
    openGraph: { title: g.title, description: g.bigPicture, type: 'article' },
  }
}

function Section({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <section className="space-y-3 pt-4 border-t-2 border-border/60">
      <h2 className="text-xl font-black">{title}</h2>
      <Tag className={`space-y-2.5 pl-5 ${ordered ? 'list-decimal' : 'list-disc'} marker:text-blue-600`}>
        {items.map((t, i) => (
          <li key={i} className="text-base sm:text-lg leading-relaxed text-pretty">
            {t}
          </li>
        ))}
      </Tag>
    </section>
  )
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params
  const g = getPublishedGuide(slug)
  if (!g || !g.reviewed) notFound()

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-16 sm:h-20 flex items-center">
          <Link href="/guides" className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>All Guides</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12 space-y-6">
        <h1 className="font-fancy text-2xl sm:text-4xl font-black text-balance">{g.title}</h1>
        <p className="text-base sm:text-lg leading-relaxed font-semibold text-pretty">{g.bigPicture}</p>
        <Section title="What you need to know" items={g.whatYouNeedToKnow} />
        <Section title="Common mistakes to avoid" items={g.commonMistakesToAvoid} />
        <Section title="What to do next" items={g.actionSteps} ordered />

        <section className="space-y-2 pt-4 border-t-2 border-border/60">
          <h2 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            Sources we checked (reviewed {g.reviewed.on})
          </h2>
          <ul className="space-y-1">
            {g.reviewed.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-bold underline underline-offset-4 hover:text-primary"
                >
                  <span>{s.label}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground pt-2">
            General information, not legal, tax or medical advice. Rules change, so confirm with the official source or a
            licensed professional before you act.
          </p>
        </section>
      </main>
    </div>
  )
}
