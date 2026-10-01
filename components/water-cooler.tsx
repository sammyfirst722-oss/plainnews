'use client'

import React, { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, ThumbsDown, CheckCircle2, Share2, Sparkles, Scale, TrendingUp } from 'lucide-react'

interface WaterCoolerTopic {
  id: string
  title: string
  subtitle: string
  sideA: {
    name: string
    argument: string
    votes: number
  }
  sideB: {
    name: string
    argument: string
    votes: number
  }
  theGist: string
}

const WATER_COOLER_TOPICS: WaterCoolerTopic[] = [
  {
    id: 'ai-workplace-debate',
    title: 'Will Autonomous AI Agents Replace Entry-Level Tech Jobs by 2027?',
    subtitle: 'From Silicon Valley boardrooms to university halls, everyone is taking sides.',
    sideA: {
      name: 'Team Replacement (The Bull Case)',
      argument: 'Autonomous code workers and agents can work 24/7 with zero burnout, writing and testing complete software pipelines in seconds.',
      votes: 1420,
    },
    sideB: {
      name: 'Team Augmentation (The Skeptics)',
      argument: 'AI models lack real-world context and common sense. The humans who know how to prompt and supervise AI will simply do 10x more work.',
      votes: 1180,
    },
    theGist: 'THE VERDICT: Manual grunt work is disappearing fast, but human judgment, taste, and project direction are more valuable than ever.',
  },
  {
    id: 'streaming-vs-theaters',
    title: 'Are Movie Theaters Dying, or Is Streaming Fatigue Setting In?',
    subtitle: 'Blockbuster debuts are smashing records online while box offices scramble.',
    sideA: {
      name: 'Team Home Screen',
      argument: 'Between high ticket prices, expensive snacks, and 85-inch 4K home TVs, watching on your couch on day one is unbeatable.',
      votes: 1890,
    },
    sideB: {
      name: 'Team Big Screen',
      argument: 'You cannot recreate the crowd energy, giant sound systems, and phone-free immersion of a real theater experience.',
      votes: 940,
    },
    theGist: 'THE VERDICT: Routine mid-budget movies belong on streaming, but huge spectacle events will keep packed theaters alive.',
  },
]

export function WaterCooler() {
  const [selectedSide, setSelectedSide] = useState<'A' | 'B' | null>(null)
  const [copied, setCopied] = useState(false)

  // Pick topic based on day
  const topicIndex = new Date().getDate() % WATER_COOLER_TOPICS.length
  const currentTopic = WATER_COOLER_TOPICS[topicIndex]

  useEffect(() => {
    try {
      const savedVote = localStorage.getItem(`plainnews_vote_${currentTopic.id}`)
      if (savedVote === 'A' || savedVote === 'B') {
        setSelectedSide(savedVote)
      }
    } catch {}
  }, [currentTopic.id])

  const handleVote = (side: 'A' | 'B') => {
    if (selectedSide) return
    setSelectedSide(side)
    try {
      localStorage.setItem(`plainnews_vote_${currentTopic.id}`, side)
    } catch {}
  }

  const totalVotes = currentTopic.sideA.votes + currentTopic.sideB.votes + (selectedSide ? 1 : 0)
  const votesA = currentTopic.sideA.votes + (selectedSide === 'A' ? 1 : 0)
  const votesB = currentTopic.sideB.votes + (selectedSide === 'B' ? 1 : 0)
  const pctA = Math.round((votesA / totalVotes) * 100)
  const pctB = 100 - pctA

  const handleShare = () => {
    const text = `Today's 60-Second Water Cooler: "${currentTopic.title}" — Who do you agree with? Vote now on SimplyBigNews: https://plainnews.vercel.app`
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <section className="bg-card border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
            <MessageSquare className="w-3.5 h-3.5 fill-current" /> 60-Sec Water Cooler
          </span>
          <span className="text-xs font-bold text-muted-foreground flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Viral Debate Today
          </span>
        </div>

        <button
          onClick={handleShare}
          className="text-xs font-bold text-muted-foreground hover:text-foreground flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-muted/40 cursor-pointer transition-all"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>{copied ? 'Copied Link!' : 'Share Debate'}</span>
        </button>
      </div>

      {/* Debate Title & Subtitle */}
      <div className="space-y-2 mb-6">
        <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-foreground tracking-tight text-balance">
          {currentTopic.title}
        </h3>
        <p className="text-xs sm:text-sm font-medium text-muted-foreground">
          {currentTopic.subtitle}
        </p>
      </div>

      {/* Two Sides Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* SIDE A */}
        <div
          onClick={() => handleVote('A')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedSide === 'A'
              ? 'bg-emerald-500/15 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-card border-border/80 hover:border-emerald-500/60 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400">
              {currentTopic.sideA.name}
            </span>
            {selectedSide && (
              <span className="text-sm font-black text-foreground">{pctA}%</span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground mb-4 leading-relaxed">
            {currentTopic.sideA.argument}
          </p>
          <button
            disabled={selectedSide !== null}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedSide === 'A'
                ? 'bg-emerald-600 text-white shadow-sm'
                : selectedSide === 'B'
                ? 'bg-muted text-muted-foreground'
                : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
            }`}
          >
            <ThumbsUp className="w-4 h-4" />
            <span>{selectedSide === 'A' ? 'You Voted Here' : 'Vote Side A'}</span>
          </button>
        </div>

        {/* SIDE B */}
        <div
          onClick={() => handleVote('B')}
          className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${
            selectedSide === 'B'
              ? 'bg-teal-500/15 border-teal-500 shadow-md ring-2 ring-teal-500/20'
              : 'bg-card border-border/80 hover:border-teal-500/60 hover:bg-muted/30'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase text-teal-600 dark:text-teal-400">
              {currentTopic.sideB.name}
            </span>
            {selectedSide && (
              <span className="text-sm font-black text-foreground">{pctB}%</span>
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-foreground mb-4 leading-relaxed">
            {currentTopic.sideB.argument}
          </p>
          <button
            disabled={selectedSide !== null}
            className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedSide === 'B'
                ? 'bg-teal-600 text-white shadow-sm'
                : selectedSide === 'A'
                ? 'bg-muted text-muted-foreground'
                : 'bg-teal-500/15 hover:bg-teal-500/25 text-teal-700 dark:text-teal-300 border border-teal-500/30'
            }`}
          >
            <ThumbsDown className="w-4 h-4" />
            <span>{selectedSide === 'B' ? 'You Voted Here' : 'Vote Side B'}</span>
          </button>
        </div>
      </div>

      {/* Live Vote Progress Bar */}
      {selectedSide && (
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
            <span>Side A: {pctA}% ({votesA.toLocaleString()} votes)</span>
            <span>Side B: {pctB}% ({votesB.toLocaleString()} votes)</span>
          </div>
          <div className="w-full h-3 rounded-full bg-muted overflow-hidden flex">
            <div
              className="bg-emerald-600 h-full transition-all duration-500"
              style={{ width: `${pctA}%` }}
            />
            <div
              className="bg-teal-500 h-full transition-all duration-500"
              style={{ width: `${pctB}%` }}
            />
          </div>
        </div>
      )}

      {/* The Plain English Gist */}
      <div className="p-4 rounded-2xl bg-muted/40 border border-border flex items-start gap-3">
        <Scale className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
          {currentTopic.theGist}
        </p>
      </div>
    </section>
  )
}
