'use client'

import React, { useState } from 'react'
import { Sparkles, Check, X, Shield, Volume2, Zap, ArrowRight, Loader2 } from 'lucide-react'

const VIP_TESTER_EMAILS = [
  'sammyfirstplaystore@gmail.com',
  'sammyfirst722@gmail.com',
  'sammyfirst722-oss@gmail.com',
]
const TESTER_PASSWORDS = ['Pa55word!.']

interface VipModalProps {
  isOpen: boolean
  onClose: () => void
  onVipSuccess?: () => void
}

export function VipModal({ isOpen, onClose, onVipSuccess }: VipModalProps) {
  const [isLoading, setIsLoading] = useState<'monthly' | 'lifetime' | 'gift' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [restoreInput, setRestoreInput] = useState('')
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null)

  const handleRestore = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = restoreInput.trim()
    const cleanLower = clean.toLowerCase()

    if (VIP_TESTER_EMAILS.includes(cleanLower) || TESTER_PASSWORDS.includes(clean)) {
      try {
        localStorage.setItem('simplybignews_vip', 'true')
        localStorage.setItem('simplybignews_vip_email', cleanLower)
        window.dispatchEvent(new Event('simplybignews_vip_changed'))
      } catch {}
      setRestoreMessage('✓ VIP Supporter access unlocked!')
      if (onVipSuccess) onVipSuccess()
      setTimeout(() => onClose(), 1000)
    } else {
      setRestoreMessage('Account not recognized. Please check your email or password.')
    }
  }

  if (!isOpen) return null

  const handleCheckout = async (plan: 'monthly' | 'lifetime' | 'gift') => {
    setIsLoading(plan)
    setError(null)

    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      const data = await res.json()

      if (!res.ok || !data.checkoutUrl) {
        throw new Error(data.error || 'Failed to start checkout. Please try again.')
      }

      window.location.href = data.checkoutUrl
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.message || 'Something went wrong.')
      setIsLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-card border-2 border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SimplyBigNews VIP Supporter</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground">
            Clear News, Zero Distractions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Support honest, calm news written for everyday life and unlock full VIP privileges.
          </p>
        </div>

        {/* Benefits */}
        <div className="my-6 space-y-3 bg-muted/40 p-4 rounded-2xl border border-border/60">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span><strong>100% Ad-Free Reading</strong> across all editions</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span><strong>Unlimited AI Article Rewrites</strong> (paste any link or text)</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span><strong>Listen Aloud Pro</strong> audio narration at multiple speeds</span>
          </div>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-foreground">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span><strong>Cancel Anytime</strong> with 1 click in your receipt</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {/* Pricing Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Monthly Option */}
          <button
            onClick={() => handleCheckout('monthly')}
            disabled={isLoading !== null}
            className="p-4 rounded-2xl border-2 border-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-98"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                Most Popular
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-foreground">$2.99</span>
                <span className="text-xs text-muted-foreground">/ month</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Flexible support, cancel anytime.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
              <span>{isLoading === 'monthly' ? 'Connecting...' : 'Join Monthly'}</span>
              {isLoading === 'monthly' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
          </button>

          {/* Lifetime Pass */}
          <button
            onClick={() => handleCheckout('lifetime')}
            disabled={isLoading !== null}
            className="p-4 rounded-2xl border-2 border-border/80 hover:border-emerald-500/50 bg-card hover:bg-muted/40 transition-all text-left flex flex-col justify-between group cursor-pointer active:scale-98"
          >
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-foreground">
                One-Time Payment
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-foreground">$19.99</span>
                <span className="text-xs text-muted-foreground">lifetime</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Pay once, VIP forever. No recurring charges.
              </p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs font-bold text-foreground">
              <span>{isLoading === 'lifetime' ? 'Connecting...' : 'Get Lifetime'}</span>
              {isLoading === 'lifetime' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              )}
            </div>
          </button>
        </div>
        
        {/* Gift Option */}
        <button
          onClick={() => handleCheckout('gift')}
          disabled={isLoading !== null}
          className="w-full mt-3 p-3 rounded-2xl border-2 border-dashed border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-center flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
        >
          <span className="text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-300">
            {isLoading === 'gift' ? 'Connecting...' : '🎁 Gift a Lifetime Pass to a Parent/Grandparent ($19.99)'}
          </span>
        </button>

        {/* Restore / Google Play Tester VIP Access */}
        <div className="mt-4 pt-3 border-t border-border/60 text-center">
          <span className="text-[11px] text-muted-foreground block mb-1.5 font-medium">
            Already a VIP Supporter or Google Play Tester?
          </span>
          <form onSubmit={handleRestore} className="flex gap-1.5 items-center">
            <input
              type="text"
              placeholder="Enter email or tester password"
              value={restoreInput}
              onChange={(e) => setRestoreInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-border/80 bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              type="submit"
              className="text-xs font-bold h-9 rounded-xl px-3 border-2 border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 cursor-pointer active:scale-95 transition-all"
            >
              Restore
            </button>
          </form>
          {restoreMessage && (
            <p className={`text-[11px] mt-1.5 font-semibold ${restoreMessage.startsWith('✓') ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
              {restoreMessage}
            </p>
          )}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground font-medium">
          <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Secured by Stripe • Instant Access • Money-back guarantee</span>
        </div>
      </div>
    </div>
  )
}
