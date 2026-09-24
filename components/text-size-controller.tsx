'use client'

import React from 'react'
import { TextSize, ReadingMode } from '@/lib/types'
import { Sun, Moon, Coffee } from 'lucide-react'
import { useTheme } from 'next-themes'

interface TextSizeControllerProps {
  textSize: TextSize
  setTextSize: (size: TextSize) => void
}

export function TextSizeController({ textSize, setTextSize }: TextSizeControllerProps) {
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('simplybignews-text-size')
      if (saved && (saved === 'standard' || saved === 'large' || saved === 'xlarge')) {
        setTextSize(saved as TextSize)
      }
    } catch (e) {}
  }, [setTextSize])

  const handleSetTextSize = (size: TextSize) => {
    setTextSize(size)
    try {
      localStorage.setItem('simplybignews-text-size', size)
    } catch (e) {}
  }

  return (
    <div className="flex items-center gap-2">
      {/* Text Size Switcher */}
      <div className="flex items-center bg-card border-2 border-border/80 rounded-xl p-0.5 shadow-xs">
        <button
          onClick={() => handleSetTextSize('standard')}
          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
            textSize === 'standard'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Standard Text Size (16px)"
        >
          A
        </button>
        <button
          onClick={() => handleSetTextSize('large')}
          className={`px-2.5 py-1 text-sm font-bold rounded-lg transition-all ${
            textSize === 'large'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Large Text Size (19px)"
        >
          A+
        </button>
        <button
          onClick={() => handleSetTextSize('xlarge')}
          className={`px-2.5 py-1 text-base font-extrabold rounded-lg transition-all ${
            textSize === 'xlarge'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Extra Large Text Size (23px)"
        >
          A++
        </button>
      </div>

      {/* Theme Toggles: Light, Sepia, Dark */}
      <div className="flex items-center bg-card border-2 border-border/80 rounded-xl p-0.5 shadow-xs">
        <button
          onClick={() => setTheme('light')}
          className={`p-1.5 rounded-lg transition-all ${
            theme === 'light' ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Light Paper Mode"
        >
          <Sun className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTheme('sepia')}
          className={`p-1.5 rounded-lg transition-all ${
            theme === 'sepia' ? 'bg-[#f4ebd0] text-[#433422] border border-[#d3be93]' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Warm Sepia Eye-Care Mode"
        >
          <Coffee className="w-4 h-4 text-amber-700 dark:text-amber-500" />
        </button>

        <button
          onClick={() => setTheme('dark')}
          className={`p-1.5 rounded-lg transition-all ${
            theme === 'dark' ? 'bg-slate-800 text-slate-100 border border-slate-700' : 'text-muted-foreground hover:text-foreground'
          }`}
          title="Calm Night Mode"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
