'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Volume2, VolumeX, Play, Pause, RotateCcw, FastForward } from 'lucide-react'

interface AudioPlayerProps {
  title: string
  textToRead: string
  compact?: boolean
}

export function AudioPlayer({ title, textToRead, compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [rate, setRate] = useState<number>(1.0)
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false)
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  const startSpeaking = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    window.speechSynthesis.cancel()

    const fullScript = `${title}. ... Here is the story in plain English. ... ${textToRead}`
    const utterance = new SpeechSynthesisUtterance(fullScript)
    utterance.rate = rate
    utterance.pitch = 1.0

    // Pick natural English voice if present
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))
    ) || voices.find((v) => v.lang.startsWith('en'))

    if (englishVoice) utterance.voice = englishVoice

    utterance.onend = () => {
      setIsPlaying(false)
    }

    utterance.onerror = () => {
      setIsPlaying(false)
    }

    utteranceRef.current = utterance
    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  const togglePlay = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    } else {
      startSpeaking()
    }
  }

  const cycleRate = () => {
    const nextRate = rate === 0.85 ? 1.0 : rate === 1.0 ? 1.2 : 0.85
    setRate(nextRate)
    if (isPlaying) {
      window.speechSynthesis.cancel()
      setTimeout(startSpeaking, 50)
    }
  }

  if (!isSupported) {
    return null
  }

  if (compact) {
    return (
      <button
        onClick={togglePlay}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
          isPlaying
            ? 'bg-amber-500/20 text-amber-900 dark:text-amber-300 border-amber-500 animate-pulse'
            : 'bg-muted/60 text-foreground hover:bg-muted border-border'
        }`}
        title="Listen to story"
      >
        {isPlaying ? (
          <>
            <Pause className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Listening</span>
            <span className="flex gap-0.5 items-end h-3">
              <span className="w-1 bg-amber-500 h-2 animate-bounce"></span>
              <span className="w-1 bg-amber-500 h-3 animate-bounce delay-75"></span>
              <span className="w-1 bg-amber-500 h-1 animate-bounce delay-150"></span>
            </span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Listen</span>
          </>
        )}
      </button>
    )
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30">
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className="w-11 h-11 rounded-full bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center shadow-md active:scale-95 transition-all border-2 border-amber-700"
          aria-label={isPlaying ? 'Pause speech' : 'Play speech'}
        >
          {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-foreground">
              {isPlaying ? 'Reading Aloud...' : 'Listen to 1-Min Summary'}
            </span>
            {isPlaying && (
              <span className="flex gap-0.5 items-end h-3.5">
                <span className="w-1 bg-amber-600 dark:bg-amber-400 h-2 animate-bounce"></span>
                <span className="w-1 bg-amber-600 dark:bg-amber-400 h-3.5 animate-bounce delay-75"></span>
                <span className="w-1 bg-amber-600 dark:bg-amber-400 h-1.5 animate-bounce delay-150"></span>
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Calm, clear voice • Great for listening while relaxing
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={cycleRate}
          className="px-2.5 py-1 text-xs font-bold rounded-lg border-2 border-border bg-card hover:bg-muted text-foreground transition-all"
          title="Change reading speed"
        >
          Speed: {rate}x
        </button>

        {isPlaying && (
          <button
            onClick={() => {
              window.speechSynthesis.cancel()
              setIsPlaying(false)
            }}
            className="p-1.5 rounded-lg border-2 border-border bg-card hover:bg-muted text-muted-foreground"
            title="Stop audio"
          >
            <VolumeX className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
