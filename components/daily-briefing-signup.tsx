'use client'

import React, { useState } from 'react'
import { Mail, CheckCircle, ArrowRight, Loader2 } from 'lucide-react'

interface DailyBriefingSignupProps {
  variant?: 'card' | 'inline'
}

export function DailyBriefingSignup({ variant = 'card' }: DailyBriefingSignupProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setMessage(
          data.alreadySubscribed
            ? "You're already subscribed! Watch for tomorrow's briefing at 7:00 AM."
            : "You're all set! Tomorrow's 2-minute briefing will land in your inbox at 7:00 AM."
        )
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Could not connect. Please check your internet connection.')
    }
  }

  if (variant === 'inline') {
    return (
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-teal-500/10 border-2 border-emerald-500/20 text-foreground">
        <div className="flex items-center gap-2 mb-2 font-black text-sm text-emerald-700 dark:text-emerald-400">
          <Mail className="w-4 h-4" /> THE 2-MINUTE MORNING BRIEFING
        </div>
        <p className="text-sm sm:text-base font-semibold mb-4 text-pretty">
          Want the day&apos;s most interesting news explained in plain English like this? Delivered free at 7:00 AM.
        </p>

        {status === 'success' ? (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/20 text-emerald-800 dark:text-emerald-200 text-sm font-bold">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={status === 'loading'}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-border/80 bg-background text-sm font-medium focus:outline-none focus:border-emerald-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm inline-flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 shadow-sm"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Subscribe Free</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}
        {status === 'error' && <p className="mt-2 text-xs text-rose-500 font-semibold">{message}</p>}
      </div>
    )
  }

  return (
    <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-800 text-white shadow-xl shadow-emerald-950/20 text-center space-y-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-100 text-xs font-black uppercase tracking-wider">
        <Mail className="w-3.5 h-3.5" /> Free Daily Newsletter
      </div>
      <h2 className="text-2xl sm:text-3xl font-black text-balance">
        Get The 2-Minute Morning Briefing
      </h2>
      <p className="max-w-xl mx-auto text-emerald-100 text-sm sm:text-base leading-relaxed text-pretty">
        The day&apos;s most interesting news and discoveries, broken down into plain, everyday English. No jargon, no drama, and no 20-paragraph walls of text. Delivered free to your inbox at 7:00 AM.
      </p>

      {status === 'success' ? (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-white/20 backdrop-blur-md text-white font-bold text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-5 h-5 shrink-0 text-emerald-200" />
          <span>{message}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-2 pt-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            disabled={status === 'loading'}
            className="flex-1 px-4 py-3 rounded-2xl text-slate-900 bg-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:opacity-50 shadow-inner"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-6 py-3 rounded-2xl bg-slate-900 text-white hover:bg-slate-800 font-black text-sm inline-flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 shadow-md"
          >
            {status === 'loading' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Get Free Briefing</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-xs text-rose-200 font-bold">{message}</p>
      )}

      <p className="text-xs text-emerald-200/80 pt-1">
        Zero spam. Unsubscribe anytime with 1 click.
      </p>
    </div>
  )
}
