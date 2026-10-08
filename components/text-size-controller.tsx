'use client'

import React from 'react'
import { TextSize } from '@/lib/types'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

interface TextSizeControllerProps {
  textSize: TextSize
  setTextSize: (size: TextSize) => void
}

export function TextSizeController({ textSize, setTextSize }: TextSizeControllerProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('simplybignews-text-size')
      if (saved && (saved === 'standard' || saved === 'large' || saved === 'xlarge')) {
        setTextSize(saved as TextSize)
      }
    } catch (e) {}
  }, [setTextSize])

  const cycleTextSize = () => {
    const nextSize: TextSize =
      textSize === 'standard' ? 'large' : textSize === 'large' ? 'xlarge' : 'standard'
    setTextSize(nextSize)
    try {
      localStorage.setItem('simplybignews-text-size', nextSize)
    } catch (e) {}
  }

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(nextTheme)
  }

  const isDark = mounted ? theme === 'dark' : false

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {/* 1 Button Text Size Cycler: Aa */}
      <button
        onClick={cycleTextSize}
        className="inline-flex items-center justify-center gap-0.5 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-card border-2 border-border/80 hover:border-blue-500/50 text-foreground text-xs font-black shadow-2xs transition-all active:scale-95 cursor-pointer"
        title={`Text Size: ${textSize.toUpperCase()} (Click to toggle)`}
      >
        <span className="text-sm font-black leading-none">A</span>
        <span className="text-xs font-bold leading-none -ml-0.5 opacity-80">a</span>
        <span className="ml-1 text-[9px] font-black text-blue-600 dark:text-blue-400 uppercase">
          {textSize === 'standard' ? '1x' : textSize === 'large' ? '1.5x' : '2x'}
        </span>
      </button>

      {/* 1 Button Day/Night Toggle */}
      <button
        onClick={toggleTheme}
        className="inline-flex items-center justify-center p-2 rounded-xl bg-card border-2 border-border/80 hover:border-blue-500/50 text-foreground shadow-2xs transition-all active:scale-95 cursor-pointer"
        title={isDark ? 'Switch to Day Mode (Light)' : 'Switch to Night Mode (Dark)'}
        aria-label="Toggle Day and Night mode"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 hover:rotate-45 transition-transform" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 hover:-rotate-12 transition-transform" />
        )}
      </button>
    </div>
  )
}
