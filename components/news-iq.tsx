'use client'

import React, { useState, useEffect, useCallback } from 'react'
import type { NewsIqProfile, NewsIqQuestion } from '@/lib/types'
import {
  Brain,
  Flame,
  Trophy,
  Award,
  Sparkles,
  CheckCircle2,
  XCircle,
  Share2,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  X,
  Star,
  ExternalLink,
} from 'lucide-react'

// Daily Questions Bank rotating across the 365 days of the year
const DAILY_QUESTION_SETS: NewsIqQuestion[][] = [
  [
    {
      "id": "q1-1",
      "question": "Which government program announced an upcoming automatic check adjustment to keep pace with household grocery and utility bills?",
      "category": "national",
      "categoryLabel": "???? US National News",
      "options": [
        "Social Security (COLA)",
        "Federal Highway Trust",
        "Small Business Administration Grants",
        "National Endowment for the Arts"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Social Security issues an annual Cost-of-Living Adjustment (COLA) based on consumer price data to protect retirement benefits from inflation."
    },
    {
      "id": "q1-2",
      "question": "NASA's James Webb Space Telescope recently detected unprecedented thermal patterns on an Earth-sized exoplanet, suggesting what breakthrough?",
      "category": "tech",
      "categoryLabel": "?? Space & Science",
      "options": [
        "Evidence of a circulating planetary atmosphere",
        "Signs of industrial radio broadcasts",
        "Massive artificial satellite constellations",
        "A ring system wider than Saturn's"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Infrared sensors revealed night-side heat circulation on the rocky world, which physically only happens when an atmosphere traps and moves heat."
    },
    {
      "id": "q1-3",
      "question": "A historic multi-state electric power grid recently achieved 100% renewable generation without blackouts in which region of America?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "The Pacific Northwest (Washington & Oregon)",
        "The Gulf Coast of Louisiana",
        "New England's Maine coast",
        "The Mojave Desert Corridor"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! The Pacific Northwest combined hydroelectric dams, coastal wind arrays, and grid battery storage to power homes and factories with 100% clean power."
    }
  ],
  [
    {
      "id": "q2-1",
      "question": "When inflation metrics cool down and corporate earnings stay steady, how does that typically affect everyday retirement funds and 401(k) accounts?",
      "category": "economy",
      "categoryLabel": "?? Money & Markets",
      "options": [
        "It boosts stock indexes and 401(k) balances",
        "It immediately cuts Social Security checks",
        "It forces banks to stop lending mortgages",
        "It freezes all interest rates permanently"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Cooling inflation allows businesses to plan with confidence, propelling broad index funds and retirement portfolio balances higher."
    },
    {
      "id": "q2-2",
      "question": "What is the primary difference between older AI chatbots and the newest autonomous reasoning systems now deploying in 2026?",
      "category": "tech",
      "categoryLabel": "?? AI & Tech",
      "options": [
        "New systems can solve multi-step problems and complete full tasks autonomously",
        "New systems only generate random rhyming poetry",
        "New systems require physical floppy disks to run",
        "New systems can only be accessed via landline phones"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! The new wave of reasoning models executes hours of complex planning, multi-step research, and coding without needing human prompts at every step."
    },
    {
      "id": "q2-3",
      "question": "Which American state recently opened a massive semiconductor fabrication campus creating thousands of skilled manufacturing jobs?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "Ohio (Columbus Tech Corridor)",
        "Rhode Island",
        "Wyoming",
        "Vermont"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Ohio's new advanced silicon fabrication campus brings thousands of high-tech jobs into the heartland, building chips for American cars and appliances."
    }
  ],
  [
    {
      "id": "q3-1",
      "question": "Which federal healthcare reform capped monthly out-of-pocket insulin costs at $35 for millions of American seniors?",
      "category": "national",
      "categoryLabel": "???? Healthcare & Seniors",
      "options": [
        "Medicare Prescription Drug Benefit Cap",
        "Federal Highway Trust Expansion",
        "Postal Service Reform Act",
        "Department of Energy Loan Guarantee"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Federal reforms capped out-of-pocket insulin at $35 per monthly supply under Medicare Part D, saving seniors thousands of dollars per year."
    },
    {
      "id": "q3-2",
      "question": "Commercial aerospace teams in the Mojave Desert are conducting quiet supersonic flight tests to solve which historical limitation?",
      "category": "tech",
      "categoryLabel": "?? Aviation & Tech",
      "options": [
        "Overland commercial supersonic flight without disruptive sonic booms",
        "Allowing passenger planes to fly without wings",
        "Eliminating the need for airports entirely",
        "Flying through space without oxygen tanks"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! NASA and commercial partners shaped aircraft geometries to disperse shockwaves into a soft thump, enabling overland supersonic travel."
    },
    {
      "id": "q3-3",
      "question": "Which state recently achieved over 10 gigawatts of grid battery storage to keep air conditioners running during record summer heat waves?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "Texas (ERCOT Grid)",
        "Rhode Island",
        "Delaware",
        "Vermont"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Texas installed massive utility battery banks that charge on abundant midday solar energy and discharge onto the grid during peak evening demand."
    }
  ],
  [
    {
      "id": "q4-1",
      "question": "When benchmark interest rates decrease, which major household borrowing cost usually experiences the most immediate downward relief?",
      "category": "economy",
      "categoryLabel": "?? Mortgages & Real Estate",
      "options": [
        "30-year fixed home mortgage rates",
        "Local property tax rates",
        "City water and sewer fees",
        "State driver license renewal fees"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Lower benchmark yields ripple quickly into Treasury bonds, reducing 30-year fixed mortgage rates and lowering monthly payments for homebuyers."
    },
    {
      "id": "q4-2",
      "question": "What landmark gene editing breakthrough received FDA approval to permanently cure sickle cell disease in patients?",
      "category": "tech",
      "categoryLabel": "?? Health & Science",
      "options": [
        "CRISPR cellular gene-editing therapy",
        "High-dose vitamin C supplements",
        "Synthetic blood transfusions",
        "Radiation therapy treatments"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! CRISPR molecular scissors modify patient blood-forming stem cells to produce healthy fetal hemoglobin, eliminating sickle cell crises for life."
    },
    {
      "id": "q4-3",
      "question": "Following consecutive winter atmospheric river storms, which Western state's major agricultural reservoirs exceeded 115% of historical average capacity?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "California (Central Valley & Sierra Snowpack)",
        "Kansas",
        "Nebraska",
        "Oklahoma"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Back-to-back atmospheric rivers filled major reservoirs like Shasta and Oroville, replenishing irrigation supplies and ending multi-year drought alerts."
    }
  ],
  [
    {
      "id": "q5-1",
      "question": "What federal initiative is funding the nationwide replacement of lead water pipes and the repair of over 4,000 structurally deficient bridges across America?",
      "category": "national",
      "categoryLabel": "???? Infrastructure & Towns",
      "options": [
        "Bipartisan Infrastructure Law (IIJA)",
        "Small Business Innovation Research Grant",
        "National Endowment for the Humanities",
        "Federal Trade Commission Rulemaking"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! The Infrastructure Investment and Jobs Act designated dedicated funding to modernize clean drinking water, rural broadband, and critical highway bridges."
    },
    {
      "id": "q5-2",
      "question": "Why are national cybersecurity agencies urging banks and utilities to begin adopting post-quantum cryptographic standards today?",
      "category": "tech",
      "categoryLabel": "?? Cybersecurity & AI",
      "options": [
        "To prevent future quantum supercomputers from breaking current RSA encryption",
        "To reduce power consumption on home Wi-Fi routers",
        "To speed up cellular 5G download speeds",
        "To protect fiber optic cables from shark bites"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! NIST finalized quantum-resistant algorithms to guarantee that encrypted government and financial transmissions cannot be cracked when quantum computers mature."
    },
    {
      "id": "q5-3",
      "question": "America's primary space launch corridor recently surpassed 100 orbital rocket missions in a single calendar year from which state?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "Florida (Cape Canaveral Space Coast)",
        "Maine",
        "Indiana",
        "Kentucky"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Florida's Space Coast achieved a record cadence of orbital launches, sending communications satellites, cargo resupply, and scientific missions into orbit."
    }
  ],
  [
    {
      "id": "q6-1",
      "question": "What official government tool expanded nationwide to allow everyday workers to file federal taxes online for free with zero commercial software fees?",
      "category": "national",
      "categoryLabel": "???? Taxes & Personal Finance",
      "options": [
        "IRS Direct File",
        "Social Security Online Check",
        "Department of Labor Timesheet",
        "Federal Reserve Wire Service"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! IRS Direct File provides an interview-style digital filing experience directly through IRS.gov, saving taxpayers hundreds of dollars in commercial prep fees."
    },
    {
      "id": "q6-2",
      "question": "In clean transportation technology, solid-state battery cells offer what primary safety and performance advantage over traditional lithium-ion packs?",
      "category": "tech",
      "categoryLabel": "? Clean Tech & Auto",
      "options": [
        "Non-flammable solid electrolyte and dramatically faster charge times",
        "Complete elimination of copper wiring in cars",
        "Ability for cars to recharge from ambient sunlight alone",
        "Engines that run on standard distilled water"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Replacing flammable liquid electrolytes with solid ceramics prevents thermal runaway fires while enabling 10-minute ultra-fast charging."
    },
    {
      "id": "q6-3",
      "question": "Which international freshwater basin holding 21% of the world's surface freshwater is protected by an interstate compact barring commercial water diversions?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "The Great Lakes Basin",
        "The Great Salt Lake Basin",
        "The Everglades Wetland Basin",
        "The Hudson River Valley"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! The Great Lakes Compact binds eight US states and two Canadian provinces to safeguard the 6 quadrillion gallons of fresh water across Superior, Michigan, Huron, Erie, and Ontario."
    }
  ],
  [
    {
      "id": "q7-1",
      "question": "What federal legislation spurred hundreds of billions in private manufacturing investments to build microchips and clean tech hardware domestically in the USA?",
      "category": "economy",
      "categoryLabel": "???? American Industry",
      "options": [
        "CHIPS and Science Act",
        "Clean Air Restoration Statute",
        "Federal Highway Trust Extension",
        "Maritime Jones Act Expansion"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! The CHIPS Act provided federal incentives and investment tax credits that catalyzed major domestic microchip manufacturing fabs in Ohio, Arizona, and New York."
    },
    {
      "id": "q7-2",
      "question": "Marine scientists using robotic autonomous submersibles recently discovered the world's largest known deep-water coral reef off which American coastline?",
      "category": "tech",
      "categoryLabel": "?? Ocean Science & Nature",
      "options": [
        "The Blake Plateau (Southeast Coast from Florida to North Carolina)",
        "Long Island Sound in New York",
        "The Chesapeake Bay in Maryland",
        "Puget Sound in Washington"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Deep sonar mapping unveiled a pristine cold-water coral ecosystem stretching over 300 miles off the Atlantic coast, thriving in absolute darkness half a mile below the surface."
    },
    {
      "id": "q7-3",
      "question": "Thousands of acres of former Appalachian surface mining lands in West Virginia and Kentucky are being repurposed for what modern development?",
      "category": "map",
      "categoryLabel": "??? 50-State News",
      "options": [
        "Utility-scale solar farms and grid energy storage projects",
        "Offshore shipping container ports",
        "International commercial airports",
        "Submarine manufacturing dry docks"
      ],
      "correctIndex": 0,
      "explanation": "CORRECT! Reclaimed mine lands feature flat terrain and existing high-voltage electrical grid interconnects, making them ideal hubs for solar generation and battery storage."
    }
  ]
]

const STORAGE_KEY = 'simplybignews_iq_profile_v1'

export function getStoredProfile(): NewsIqProfile {
  if (typeof window === 'undefined') {
    return {
      score: 120,
      level: 1,
      levelTitle: 'Curious Citizen',
      xp: 0,
      nextLevelXp: 100,
      streak: 1,
      questionsAnswered: 0,
      questionsCorrect: 0,
      lastPlayedDate: '',
      percentile: 78,
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}

  const initial: NewsIqProfile = {
    score: 120,
    level: 1,
    levelTitle: 'Curious Citizen',
    xp: 0,
    nextLevelXp: 100,
    streak: 1,
    questionsAnswered: 0,
    questionsCorrect: 0,
    lastPlayedDate: '',
    percentile: 78,
  }
  return initial
}

export function saveStoredProfile(profile: NewsIqProfile) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    window.dispatchEvent(new CustomEvent('simplybignews_iq_updated', { detail: profile }))
  } catch {}
}

export function rewardGlobalNewsIqXp(amount: number, reason: string) {
  if (typeof window === 'undefined') return
  const current = getStoredProfile()
  const newXp = current.xp + amount
  let newLevel = current.level
  let newTitle = current.levelTitle
  let nextXp = current.nextLevelXp

  if (newXp >= 1500) {
    newLevel = 6
    newTitle = 'Chief Editor'
    nextXp = 2500
  } else if (newXp >= 850) {
    newLevel = 5
    newTitle = 'Senior Bureau Chief'
    nextXp = 1500
  } else if (newXp >= 500) {
    newLevel = 4
    newTitle = 'Fact Checker'
    nextXp = 850
  } else if (newXp >= 250) {
    newLevel = 3
    newTitle = 'News Savvy'
    nextXp = 500
  } else if (newXp >= 100) {
    newLevel = 2
    newTitle = 'Informed Reader'
    nextXp = 250
  }

  const updated: NewsIqProfile = {
    ...current,
    xp: newXp,
    level: newLevel,
    levelTitle: newTitle,
    nextLevelXp: nextXp,
  }
  saveStoredProfile(updated)
}

// ===========================================================================
// 1. TOP HEADER WIDGET PILL (SHOWS REAL-TIME NEWS IQ)
// ===========================================================================
export function NewsIqHeaderPill({ onOpenModal }: { onOpenModal: () => void }) {
  const [profile, setProfile] = useState<NewsIqProfile>(getStoredProfile())

  useEffect(() => {
    setProfile(getStoredProfile())
    const handleUpdate = (e: any) => {
      if (e.detail) setProfile(e.detail)
    }
    window.addEventListener('simplybignews_iq_updated', handleUpdate)
    return () => window.removeEventListener('simplybignews_iq_updated', handleUpdate)
  }, [])

  return (
    <button
      onClick={onOpenModal}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-900/15 via-red-900/10 to-blue-900/15 hover:from-blue-900/25 hover:to-red-900/25 border-2 border-primary/30 text-foreground text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
      title="View your official News IQ scorecard and daily stats"
    >
      <Brain className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
      <span className="font-masthead font-bold text-primary">IQ: {profile.score}</span>
      <span className="text-border">•</span>
      <span className="flex items-center gap-0.5 text-red-600 dark:text-red-400 font-extrabold">
        <Flame className="w-3 h-3 fill-current" />
        <span>{profile.streak}d</span>
      </span>
    </button>
  )
}

// ===========================================================================
// 2. DAILY CHALLENGE INTERACTIVE CARD (EMBEDDED IN HOMEPAGE)
// ===========================================================================
export function NewsIqDailyChallengeCard({
  onOpenScorecard,
}: {
  onOpenScorecard: () => void
}) {
  const [profile, setProfile] = useState<NewsIqProfile>(getStoredProfile())
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [hasAnsweredStep, setHasAnsweredStep] = useState(false)
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
  const [isChallengeDone, setIsChallengeDone] = useState(false)

  // Pick questions set by day
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
  )
  const questionSet = DAILY_QUESTION_SETS[dayOfYear % DAILY_QUESTION_SETS.length]
  const todayDateStr = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    const p = getStoredProfile()
    setProfile(p)
    if (p.lastPlayedDate === todayDateStr) {
      setIsChallengeDone(true)
    }

    const handleUpdate = (e: any) => {
      if (e.detail) setProfile(e.detail)
    }
    window.addEventListener('simplybignews_iq_updated', handleUpdate)
    return () => window.removeEventListener('simplybignews_iq_updated', handleUpdate)
  }, [todayDateStr])

  const handleSelectOption = (index: number) => {
    if (hasAnsweredStep) return
    setSelectedAnswer(index)
    setHasAnsweredStep(true)

    const question = questionSet[currentStep]
    const isCorrect = index === question.correctIndex

    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1)
      rewardGlobalNewsIqXp(15, 'Correct Quiz Answer')
    }
  }

  const handleNextQuestion = () => {
    if (currentStep < questionSet.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelectedAnswer(null)
      setHasAnsweredStep(false)
    } else {
      // Finished challenge
      finishChallenge()
    }
  }

  const finishChallenge = () => {
    const totalCorrect = correctAnswersCount
    let scoreBump = 3
    let newPercentile = 82
    if (totalCorrect === 3) {
      scoreBump = 14
      newPercentile = 97
    } else if (totalCorrect === 2) {
      scoreBump = 8
      newPercentile = 90
    } else if (totalCorrect === 1) {
      scoreBump = 5
      newPercentile = 85
    }

    const newScore = Math.min(160, Math.max(90, profile.score + scoreBump))
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const nextStreak = profile.lastPlayedDate === yesterday ? profile.streak + 1 : profile.lastPlayedDate === todayDateStr ? profile.streak : 1

    const updated: NewsIqProfile = {
      ...profile,
      score: newScore,
      percentile: newPercentile,
      streak: nextStreak,
      questionsAnswered: profile.questionsAnswered + 3,
      questionsCorrect: profile.questionsCorrect + totalCorrect,
      lastPlayedDate: todayDateStr,
    }
    saveStoredProfile(updated)
    setProfile(updated)
    setIsChallengeDone(true)
    rewardGlobalNewsIqXp(25, 'Completed Daily News IQ')
  }

  const currentQ = questionSet[currentStep]

  if (isChallengeDone) {
    return (
      <div className="relative overflow-hidden rounded-3xl border-2 border-primary/50 bg-gradient-to-br from-blue-900/10 via-card to-red-900/10 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-blue-400">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-masthead font-bold text-base sm:text-lg text-foreground">
                  Today&apos;s News IQ Certified
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-600 text-white">
                  Score: {profile.score} IQ
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground font-semibold mt-0.5">
                You&apos;re in the <span className="text-blue-600 dark:text-blue-400 font-extrabold">Top {100 - profile.percentile}%</span> of everyday readers today!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenScorecard}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-black shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View Press Pass Certificate</span>
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-blue-600/40 bg-gradient-to-br from-blue-900/10 via-card to-red-900/10 p-6 sm:p-8 shadow-xl">
      {/* Top Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-sm">
            <Brain className="w-3.5 h-3.5" /> Daily News IQ Challenge
          </span>
          <span className="text-xs font-bold text-muted-foreground">
            Question {currentStep + 1} of {questionSet.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-red-600/15 border border-red-600/30 text-red-700 dark:text-red-300 font-black text-xs">
            <Flame className="w-3.5 h-3.5 fill-current text-red-600" />
            <span>Streak: {profile.streak}d</span>
          </div>
          <div className="px-2.5 py-1 rounded-xl bg-blue-600/15 border border-blue-600/30 text-blue-700 dark:text-blue-300 font-black text-xs">
            <span>+{profile.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Category Pill */}
      <div className="mb-2">
        <span className="text-[11px] font-black uppercase text-blue-600 dark:text-blue-400">
          {currentQ.categoryLabel}
        </span>
      </div>

      {/* Question Headline in Fancy Serif */}
      <div className="space-y-1.5 mb-5">
        <h3 className="font-fancy text-lg sm:text-2xl font-black text-foreground tracking-tight text-balance leading-snug">
          {currentQ.question}
        </h3>
      </div>

      {/* 4 Clickable Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx
          const isCorrect = idx === currentQ.correctIndex

          let cardStyle =
            'bg-card border-border/80 hover:border-blue-500/60 hover:bg-blue-500/5'

          if (hasAnsweredStep) {
            if (isCorrect) {
              cardStyle =
                'bg-blue-600/15 border-blue-600 text-blue-950 dark:text-blue-200 shadow-md ring-2 ring-blue-500/30'
            } else if (isSelected && !isCorrect) {
              cardStyle =
                'bg-red-600/15 border-red-600 text-red-950 dark:text-red-200'
            } else {
              cardStyle = 'bg-card/50 border-border/40 opacity-70'
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelectOption(idx)}
              disabled={hasAnsweredStep}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${cardStyle}`}
            >
              <span className="w-7 h-7 rounded-xl bg-muted/80 text-foreground font-black text-xs flex items-center justify-center shrink-0 border border-border">
                {String.fromCharCode(65 + idx)}
              </span>
              <div className="flex-1">
                <p className="text-xs sm:text-sm font-bold leading-snug text-foreground">
                  {option}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Step Feedback & Next Button */}
      {hasAnsweredStep && (
        <div className="pt-4 border-t-2 border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            {selectedAnswer === currentQ.correctIndex ? (
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
            )}
            <p className="text-xs sm:text-sm font-semibold text-foreground">
              {currentQ.explanation}
            </p>
          </div>

          <button
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all shrink-0 cursor-pointer"
          >
            <span>{currentStep === questionSet.length - 1 ? 'See My Score' : 'Next Question'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

// ===========================================================================
// 3. CERTIFIED NEWS IQ SCORECARD MODAL / OFFICIAL PRESS PASS
// ===========================================================================
export function NewsIqScorecardModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const [profile, setProfile] = useState<NewsIqProfile>(getStoredProfile())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setProfile(getStoredProfile())
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleShare = () => {
    const shareText = `🧠 My News IQ today is ${profile.score} (Top ${100 - profile.percentile}% News Savvy)! Can you beat me on SimplyBigNews? Try today's 3-question challenge: https://plainnews.vercel.app`
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border-4 border-primary bg-card text-foreground p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* American Flag-Inspired Crest & Header */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-blue-700 via-white to-red-600"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl border-2 border-border/80 hover:bg-muted text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center pt-2 space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-600/30 text-blue-700 dark:text-blue-300 font-black text-xs uppercase tracking-widest">
            <Star className="w-3.5 h-3.5 fill-current text-blue-600" />
            <span>Official Reader Certificate</span>
            <Star className="w-3.5 h-3.5 fill-current text-blue-600" />
          </div>
          <h2 className="font-masthead text-2xl sm:text-3xl font-black text-foreground tracking-tight">
            Certified News IQ
          </h2>
          <p className="text-xs text-muted-foreground font-medium">
            SimplyBigNews • 50-State Plain Newsroom Standard
          </p>
        </div>

        {/* Certificate Display Badge */}
        <div className="relative rounded-2xl border-2 border-blue-600/40 bg-gradient-to-br from-blue-900/10 via-card to-red-900/10 p-6 text-center space-y-4 mb-6 shadow-inner">
          <div className="text-5xl sm:text-6xl font-black font-masthead text-primary tracking-tight">
            {profile.score}
            <span className="text-xl sm:text-2xl font-bold text-muted-foreground ml-1">IQ</span>
          </div>

          <div className="space-y-1">
            <div className="inline-block px-3 py-1 rounded-xl bg-blue-600 text-white font-black text-xs uppercase tracking-wide">
              Level {profile.level}: {profile.levelTitle}
            </div>
            <p className="text-xs font-bold text-foreground">
              Top {100 - profile.percentile}% of Daily Readers
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/80 text-xs">
            <div className="p-2 rounded-xl bg-card border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">Streak</span>
              <span className="font-black text-red-600 text-sm">🔥 {profile.streak}d</span>
            </div>
            <div className="p-2 rounded-xl bg-card border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">XP Earned</span>
              <span className="font-black text-blue-600 text-sm">{profile.xp} XP</span>
            </div>
            <div className="p-2 rounded-xl bg-card border border-border">
              <span className="text-[10px] text-muted-foreground font-bold block">Accuracy</span>
              <span className="font-black text-foreground text-sm">
                {profile.questionsAnswered > 0
                  ? Math.min(100, Math.round((profile.questionsCorrect / profile.questionsAnswered) * 100))
                  : 100}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Share and Actions */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>{copied ? 'Scorecard Copied to Clipboard!' : 'Share My News IQ'}</span>
          </button>

          <p className="text-center text-[11px] text-muted-foreground font-medium">
            Earn +10 XP every time you read a story, and +5 XP exploring state news on the map!
          </p>
        </div>
      </div>
    </div>
  )
}
