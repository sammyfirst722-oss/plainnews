'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, ExternalLink, X } from 'lucide-react'

interface AdBannerProps {
  onOpenVipModal: () => void
  slot?: 'top' | 'mid' | 'footer'
}

export function AdBanner({ onOpenVipModal, slot = 'mid' }: AdBannerProps) {
  const [isVip, setIsVip] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    try {
      const vip = localStorage.getItem('simplybignews_vip') === 'true'
      setIsVip(vip)
    } catch {}
  }, [])

  if (isVip || isDismissed) return null

  return (
    <div className="my-6 p-4 rounded-2xl border-2 border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5 dark:from-emerald-950/20 dark:to-teal-950/20 transition-all">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-500/20">
            Ad
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">SnapChef AI • Cook What&apos;s In Your Fridge</span>
              <span className="text-[10px] uppercase font-extrabold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                Sponsor
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Snap a photo of your fridge and get delicious 15-minute recipes instantly. Never waste food again.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <a
            href="https://snapchef-ai-eight.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95"
          >
            <span>Try Free</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={onOpenVipModal}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Remove all ads with VIP Pass"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Hide Ads ($2.99)</span>
          </button>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Dismiss ad for this session"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
