// Detects "running inside the Google Play (Android) app" in the browser.
// Google Play requires digital purchases inside the app to use Play Billing, and SimplyBigNews VIP does not
// offer that yet, so inside the app we must not send people to Stripe card checkout.
//
// The Play app opens the site from an "android-app://" referrer, but only on the first page, so the first
// answer is remembered for the rest of the session.

const FLAG = 'sbn_android_app'

export function isAndroidApp(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (window.sessionStorage?.getItem(FLAG) === '1') return true
  } catch {}

  const fromPlayApp = typeof document !== 'undefined' && (document.referrer || '').includes('android-app://')
  const standalone = !!window.matchMedia?.('(display-mode: standalone)').matches
  const android = (navigator.userAgent || '').includes('Android')
  const digitalGoods = typeof (window as any).getDigitalGoodsService === 'function'
  const inApp = Boolean(fromPlayApp || (standalone && android) || digitalGoods)

  if (inApp) {
    try {
      window.sessionStorage?.setItem(FLAG, '1')
    } catch {}
  }
  return inApp
}
