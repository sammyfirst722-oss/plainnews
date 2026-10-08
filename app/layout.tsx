import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { SwRegister } from '@/components/sw-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'SimplyBigNews | One Nation - One Truth - One Location',
  
  description:
    "One Nation - One Truth - One Location. Centered around our interactive 50-state USA News Radar and daily News IQ challenge.",
  keywords: [
    'simply big news',
    'plain english news',
    'us news map',
    '50 state news',
    'news iq',
    'daily news quiz',
    'calm news',
    'anxiety free news',
    'unbiased plain english',
    'social security news',
    'health news',
    'audio news reader',
  ],
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SimplyBigNews',
  },
}

export const viewport: Viewport = {
  themeColor: '#1d4ed8',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          themes={['light', 'sepia', 'dark']}
        >
          {children}
          <Toaster position="top-center" richColors closeButton />
          <SwRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}




