# SimplyBigNews 📰

> Clear, honest, distraction-free news written at an 8th-grade reading level.
> Tailored for readers 40+ who value calm, straightforward information without sensationalism.

---

## ✨ Features

- **8th-Grade Plain English**: Every story is transformed from dense media jargon into calm, conversational everyday words with 0 loss of key facts.
- **Story Breakdown at a Glance**:
  - **The Big Picture**: 2-sentence bottom line.
  - **What Happened**: 3 key bullet points.
  - **Why It Matters**: Practical relevance for retirement, family, healthcare, wallet, and community.
  - **Word Helper**: Difficult jargon translated into plain definitions (e.g. *Inflation*, *Amortization*, *Bipartisan*).
- **Custom Article Rewriter**: Readers can paste any complex news article or text and get an instant, simplified 8th-grade version with 1 click.
- **Listen Aloud (Text-to-Speech)**: Integrated audio narrator with variable speed (0.8x, 1.0x, 1.2x) and visual audio waves.
- **Reading Comfort Controls**:
  - **Font Sizing**: `A` (Standard 16px), `A+` (Large 19px), `A++` (Extra Large 23px).
  - **Themes**: High-contrast Light, Soothing Warm Sepia, and Easy-on-the-Eyes Dark.
- **Real-Time News Feeds**: Live RSS feeds from top trusted outlets (NPR, BBC, CNBC, AP, Good News Network) with auto-caching.
- **Offline & PWA Ready**: Installable as a Progressive Web App (PWA) and packaged as an Android Trusted Web Activity (TWA) with Service Worker offline caching.
- **Google Play & Compliance Ready**: Dedicated Privacy Policy, Terms of Service, and Account/Data Deletion pages.

---

## 🛠 Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router) & React 19
- **Styling**: Tailwind CSS v4 with modern web typography standards (`text-wrap: balance`, `text-wrap: pretty`)
- **Icons**: Lucide React
- **Audio**: Web Speech Synthesis API
- **AI Simplifier**: OpenRouter / Google Gemma 4 26B with deterministic fallback engine
- **Feed Processing**: `fast-xml-parser` with TTL caching
- **Platform**: Web PWA & Android TWA (`app.vercel.SimplyBigNews.twa`)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (tested on Node 20+)
- npm or yarn

### Installation

```bash
git clone https://github.com/sammyfirst722-oss/SimplyBigNews.git
cd SimplyBigNews
npm install
```

### Environment Variables

Create `.env.local`:
```env
OPENROUTER_API_KEY=your_openrouter_key
```

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## 📱 Android App (Google Play)

- **Package Name**: `app.vercel.SimplyBigNews.twa`
- **Application Type**: Android Trusted Web Activity (TWA) Bundle (.aab)
- **Asset Links**: Digital Asset Links enabled via `/.well-known/assetlinks.json`
