import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from 'sonner'
import { SwRegister } from '@/components/sw-register'
import './globals.css'

export const metadata: Metadata = {
  title: 'SimplyBigNews — Clear, Everyday News Without Jargon',
  description:
    "The day's biggest news rewritten into calm, simple, everyday English. Tailored for comfortable reading with listen-aloud audio, large text, and practical takeaways.",
  keywords: [
    'simply big news',
    'plain english news',
    'simple news',
    'easy reading news',
    'news for seniors',
    'news for adults',
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
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
