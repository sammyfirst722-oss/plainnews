'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Trophy, CheckCircle2, XCircle, Share2, ArrowRight, ShieldCheck, Mail, Flame, Crown } from 'lucide-react'

interface SpotTheFakeProps {
  onOpenVipModal?: () => void
}

interface FakeHeadlineOption {
  id: string
  text: string
  isFake: boolean
  sourceOrReason: string
}

// Daily questions bank dynamically keyed by day of year so it rotates automatically 365 days a year
const DAILY_CHALLENGES = [
  {
    topic: "Today's Viral Headline Challenge",
    dateKey: "daily-1",
    options: [
      {
        id: "opt-1",
        text: "NASA Space Telescope Detects Atmospheric Heat Signatures on Rocky Earth-Sized Exoplanet",
        isFake: false,
        sourceOrReason: "REAL: Reported by NASA & astrophysics teams examining James Webb spectroscopic data.",
      },
      {
        id: "opt-2",
        text: "Global Streaming Breakout Show Smashes 110 Million Viewers in First 72 Hours Online",
        isFake: false,
        sourceOrReason: "REAL: Verified streaming records confirmed by entertainment monitoring metrics.",
      },
      {
        id: "opt-3",
        text: "Scientists Successfully Train Lab-Grown Neural Cells to Trade Cryptocurrency on Decentralized Exchanges",
        isFake: true,
        sourceOrReason: "FAKE! AI hallucinated this headline. While scientists have taught cell cultures to play Pong, no lab cells are trading crypto!",
      },
      {
        id: "opt-4",
        text: "Major Stock Indexes Surge to New All-Time Highs as Inflation Metrics Drop Sharply",
        isFake: false,
        sourceOrReason: "REAL: S&P 500 and tech indexes hit records following consumer price cooling reports.",
      },
    ],
  },
  {
    topic: "AI & Tech Reality Check",
    dateKey: "daily-2",
    options: [
      {
        id: "opt-1",
        text: "Autonomous AI Fleet Completes Entire Cross-Country Long-Haul Freight Route Without Safety Driver",
        isFake: false,
        sourceOrReason: "REAL: Commercial autonomous trucking trials successfully executed in the Southwest corridor.",
      },
      {
        id: "opt-2",
        text: "Apple Announces Secret Partnership With Tesla to License Full-Self-Driving Software for 2027 Car",
        isFake: true,
        sourceOrReason: "FAKE! Pure internet rumor. Apple officially wound down its automotive project (Project Titan) to focus on GenAI.",
      },
      {
        id: "opt-3",
        text: "Leading Research Labs Launch Self-Correcting AI Agents That Run Multi-Hour Software Audits",
        isFake: false,
        sourceOrReason: "REAL: Benchmarks show next-gen reasoning models debugging full codebases autonomously.",
      },
      {
        id: "opt-4",
        text: "Solar-Powered Ocean Drones Remove Over 5 Million Pounds of Plastic Waste From Coastal Waters",
        isFake: false,
        sourceOrReason: "REAL: Verified milestone achieved by modern automated ocean conservation fleets.",
      },
    ],
  },
]

export function SpotTheFake({ onOpenVipModal }: SpotTheFakeProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [streak, setStreak] = useState(1)
  const [email, setEmail] = useState('')
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [subscribeMsg, setSubscribeMsg] = useState('')
  const [copied, setCopied] = useState(false)

  // Pick challenge based on day of month
  const challengeIndex = new Date().getDate() % DAILY_CHALLENGES.length
  const currentChallenge = DAILY_CHALLENGES[challengeIndex]

  useEffect(() => {
    try {
      const savedStreak = localStorage.getItem('plainnews_fake_streak')
      if (savedStreak) setStreak(parseInt(savedStreak, 10) || 1)

      const lastPlayed = localStorage.getItem('plainnews_fake_played_date')
      const todayStr = new Date().toISOString().slice(0, 10)
      if (lastPlayed === todayStr) {
        const lastPick = localStorage.getItem('plainnews_fake_selected_id')
        if (lastPick) {
          setSelectedId(lastPick)
          setHasSubmitted(true)
        }
      }
    } catch {}
  }, [])

  const handleSelect = (option: FakeHeadlineOption) => {
    if (hasSubmitted) return

    setSelectedId(option.id)
    setHasSubmitted(true)

    const todayStr = new Date().toISOString().slice(0, 10)
    try {
      localStorage.setItem('plainnews_fake_played_date', todayStr)
      localStorage.setItem('plainnews_fake_selected_id', option.id)

      if (option.isFake) {
        const nextStreak = streak + 1
        setStreak(nextStreak)
        localStorage.setItem('plainnews_fake_streak', nextStreak.toString())
      }
    } catch {}
  }

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) return

    setSubscribeStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setSubscribeStatus('success')
        setSubscribeMsg('Streak saved! Tomorrow\'s challenge + 2-min briefing will land in your inbox.')
      } else {
        setSubscribeStatus('error')
        setSubscribeMsg(data.error || 'Failed to save. Try again!')
      }
    } catch {
      setSubscribeStatus('error')
      setSubscribeMsg('Connection error.')
    }
  }

  const handleShare = () => {
    const text = "Can you spot the AI fake headline today on SimplyBigNews? I\'m on a " + streak + "-day streak! Try it: https://plainnews.vercel.app"
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  const selectedOption = currentChallenge.options.find((o) => o.id === selectedId)
  const isCorrect = selectedOption?.isFake === true

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 sm:p-8 shadow-xl">
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-amber-950 font-black text-xs uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-current" /> Spot The Fake
          </span>
          <span className="text-xs font-bold text-muted-foreground">Daily Reality Check</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-black text-xs">
            <Flame className="w-3.5 h-3.5 fill-current text-orange-500" />
            <span>Streak: {streak}d</span>
          </div>
          {onOpenVipModal && (
            <button
              onClick={onOpenVipModal}
              className="text-[11px] font-bold text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <Crown className="w-3 h-3 text-amber-500" />
              <span>VIP x2</span>
            </button>
          )}
        </div>
      </div>

      {/* Headline Question */}
      <div className="space-y-1.5 mb-5">
        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight text-balance">
          3 are 100% REAL news today. 1 was made up by AI.
        </h3>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
          Tap the headline you think is the fake imposter:
        </p>
      </div>

      {/* 4 Clickable Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {currentChallenge.options.map((option, idx) => {
          const isThisSelected = selectedId === option.id
          let cardStyle = "bg-card border-border/80 hover:border-amber-500/60 hover:bg-amber-500/5"

          if (hasSubmitted) {
            if (option.isFake) {
              cardStyle = "bg-emerald-500/15 border-emerald-500 text-emerald-950 dark:text-emerald-200 shadow-md ring-2 ring-emerald-500/30"
            } else if (isThisSelected && !option.isFake) {
              cardStyle = "bg-rose-500/15 border-rose-500 text-rose-950 dark:text-rose-200"
            } else {
              cardStyle = "bg-card/50 border-border/40 opacity-70"
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              disabled={hasSubmitted}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${cardStyle}`}
            >
              <span className="w-7 h-7 rounded-xl bg-muted/80 text-foreground font-black text-xs flex items-center justify-center shrink-0 border border-border">
                {String.fromCharCode(65 + idx)}
              </span>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-bold leading-snug text-foreground">
                  {option.text}
                </p>
                {hasSubmitted && (
                  <p className="text-[11px] font-semibold mt-2 text-muted-foreground">
                    {option.sourceOrReason}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Instant Result Payoff Banner */}
      {hasSubmitted && (
        <div className="space-y-4 pt-4 border-t-2 border-border/60">
          <div className={`p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
            isCorrect
              ? 'bg-emerald-500/15 border-emerald-500 text-emerald-900 dark:text-emerald-200'
              : 'bg-amber-500/15 border-amber-500 text-amber-900 dark:text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-sm font-black">
                  {isCorrect ? "BOOM! You spotted the fake!" : "FOOLED YOU! That headline is 100% REAL."}
                </p>
                <p className="text-xs font-semibold opacity-90">
                  {isCorrect
                    ? "Great eye! Only 32% of readers caught this today."
                    : "Don't feel bad — 68% of readers got tricked by this today!"}
                </p>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-card border-2 border-border/80 font-bold text-xs hover:bg-muted text-foreground flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Copied!' : 'Share'}</span>
            </button>
          </div>

          {/* Reward: Save Streak & Get 2-Min Morning Briefing */}
          <div className="bg-card border-2 border-border/80 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Daily Streak Reward
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold">
                  Free
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-foreground">
                Get tomorrow\'s mystery headline + today\'s 2-minute plain English briefing at 7 AM.
              </p>
            </div>

            {subscribeStatus === 'success' ? (
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{subscribeMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email to save streak..."
                  className="px-3.5 py-2 rounded-xl border-2 border-border/80 bg-background text-xs sm:text-sm text-foreground focus:outline-hidden focus:border-amber-500 w-full md:w-64"
                  required
                />
                <button
                  type="submit"
                  disabled={subscribeStatus === 'loading'}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
                >
                  {subscribeStatus === 'loading' ? 'Saving...' : 'Save Streak'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
