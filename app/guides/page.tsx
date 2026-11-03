import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getPublishedGuides } from '@/lib/guides'

export const metadata: Metadata = {
  title: 'Plain-Words Guides — SimplyBigNews',
  description:
    'Money, health and safety topics explained in plain everyday words, with links to the official sources we checked.',
  alternates: { canonical: 'https://plainnews.vercel.app/guides' },
}

export default function GuidesIndexPage() {
  const guides = getPublishedGuides()
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <header className="sticky top-0 z-40 w-full border-b-2 border-border/80 bg-background/95 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 h-16 sm:h-20 flex items-center">
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-80">
            <ArrowLeft className="w-5 h-5" />
            <span>Back to News</span>
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 pt-8 sm:pt-12 space-y-6">
        <h1 className="font-fancy text-3xl sm:text-4xl font-black text-balance">Plain-Words Guides</h1>
        <p className="text-base sm:text-lg leading-relaxed text-muted-foreground">
          Big topics, short answers, no jargon. Each guide lists the official sources we checked and the date we checked them.
        </p>
        <ul className="space-y-3">
          {guides.map((g) => (
            <li key={g.slug}>
              <Link
                href={`/guides/${g.slug}`}
                className="block p-4 rounded-xl border-2 border-border/80 bg-muted/40 hover:border-primary/60 transition-colors"
              >
                <span className="font-extrabold text-lg block mb-1">{g.title}</span>
                <span className="text-sm text-muted-foreground">{g.bigPicture}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
