import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, HardDrive, Mail, EyeOff } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | PlainNews',
  description: 'How PlainNews collects, uses, and protects your information and preferences.',
}

const UPDATED = 'September 24, 2026'
const CONTACT = 'sammyfirst722@gmail.com'

export default function PrivacyPage() {
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
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Last updated: {UPDATED}</p>

        <div className="space-y-6 text-sm leading-relaxed text-muted-foreground">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">1. Overview</h2>
            <p>
              SimplyBigNews (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is built to deliver calm, simple,
              jargon-free news in clear everyday words. We are committed to complete privacy and
              do not sell your personal data or track your reading habits across third-party websites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-emerald-600" /> 2. Information We Do NOT Collect
            </h2>
            <p>
              We do not require account registration or login to read news. We do not collect your
              name, phone number, location, or biometric data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-emerald-600" /> 3. Local Storage Preferences
            </h2>
            <p>
              Your saved articles, preferred font size, and reading mode (Light, Sepia, Night) are
              saved locally on your device via browser localStorage. You can clear this data at any
              time by clearing your browser cache.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2">4. Audio Reading (Text-to-Speech)</h2>
            <p>
              Our listen-aloud audio player runs entirely locally on your device using your browser&apos;s
              built-in speech synthesizer. No audio recordings are transmitted to or stored on our
              servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-600" /> 5. Contact Us
            </h2>
            <p>
              If you have any questions about this Privacy Policy, please email us directly at:{' '}
              <a
                href={`mailto:${CONTACT}`}
                className="font-bold text-primary underline underline-offset-2"
              >
                {CONTACT}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
