'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body className="min-h-screen flex items-center justify-center p-4 bg-gray-50 text-gray-900 font-sans">
        <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-lg border border-gray-200 text-center space-y-4">
          <h2 className="text-2xl font-black text-emerald-700">Something went wrong</h2>
          <p className="text-sm text-gray-600">
            An unexpected error occurred. Our team has been alerted and is looking into it.
          </p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
