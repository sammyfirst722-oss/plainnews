# SimplyBigNews — Workspace Instructions & Rules

- **Brand Name**: Always **"SimplyBigNews"** (never "PlainNews").
- **Voice & Tone**: Use **"Zero Fluff"** and **"everyday words"**.
- **Forbidden Phrases**: NEVER mention "8th grade reading level", "8th-grade level", or "jargon-free".
- **Pillar Format**: Every news breakdown must have: *The Big Picture*, *What Happened (3 bullets)*, *Why It Matters*, and *Plain Words*.
- **Accessibility**: Never disable pinch-to-zoom (`userScalable: false`).
- **Dynamic Story URLs**: Stories resolve at `/story/[slug]` with OpenGraph tags.
- **Production URL**: https://plainnews.vercel.app
- **TWA Project**: `C:\Users\sammy\plainnews-twa` (Package: `app.vercel.plainnews.twa`)
- **Key Commands**:
  - Test build: `npm run build`
  - Deploy to Vercel: `npx vercel --prod --yes`
  - Build TWA: `cd C:\Users\sammy\plainnews-twa; .\gradlew.bat bundleRelease`
  - Publish to Play Store: `& C:\Users\sammy\prompt-builder\.venv\Scripts\python.exe scripts/publish-to-play.py`
