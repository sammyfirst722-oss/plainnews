import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, FileText, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | PlainNews',
  description: 'Terms and conditions for using PlainNews.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-muted/30 text-foreground py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto bg-card border-2 border-border rounded-3xl p-6 sm:p-10 shadow-xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to PlainNews
        </Link>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: September 24, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Agreement to Terms</h2>
            <p>
              By accessing PlainNews, you agree to these Terms of Service. If you disagree with any
              part, you may discontinue use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">2. Editorial &amp; News Disclaimer</h2>
            <p>
              PlainNews provides simplified educational summaries of current news events at an
              8th-grade reading level. While we strive for accuracy, summaries are for informational
              purposes only and do not constitute legal, medical, or financial advice. Readers are
              encouraged to refer to original primary sources linked on each article for complete
              transcripts and full details.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" /> 3. Support &amp; Feedback
            </h2>
            <p>
              For inquiries or feedback, contact us at{' '}
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
