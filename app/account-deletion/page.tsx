import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, Trash2, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Data & Privacy Choices | SimplyBigNews',
  description: 'How to clear your SimplyBigNews reading history and stored preferences.',
}

export default function AccountDeletionPage() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto bg-card border-2 border-border rounded-3xl p-6 sm:p-10 shadow-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to SimplyBigNews
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center text-red-500">
            <Trash2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Your Data Choices</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 24, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <p>
            SimplyBigNews does not create remote user profiles or retain personal data on servers. You have
            complete control over your stored preferences.
          </p>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Local Device Data</h2>
            <p>
              Your bookmarked stories, text size preferences, and reading themes are stored only on
              your local device. You can erase all saved data at any moment by clearing your browser
              cookies and site storage, or selecting &quot;Clear App Data&quot; in your phone settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" /> 2. Help &amp; Support
            </h2>
            <p>
              If you have any questions, reach out to our team at:{' '}
              <a
                href="mailto:sammyfirst722@gmail.com"
                className="font-bold text-primary underline underline-offset-2"
              >
                sammyfirst722@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
