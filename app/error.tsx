'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full p-6 sm:p-8 bg-card rounded-2xl border-2 border-border/80 shadow-sm space-y-4">
        <h2 className="text-2xl font-black text-primary">Something went wrong</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We encountered an unexpected issue while loading this page. Our team has been notified.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity cursor-pointer"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border-2 border-border font-bold hover:bg-muted transition-colors inline-flex items-center justify-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
