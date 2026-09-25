# SimplyBigNews — Project Rules
Repo: `C:\Users\sammy\plainnews` · Live: https://plainnews.vercel.app
(Global rules apply. These add to them.)

## Facts
- Production deploys from `main`. Pushing to `main` = going live.
- Android TWA: `C:\Users\sammy\plainnews-twa` (package `app.vercel.plainnews.twa`).

## Brand
- Name is always "SimplyBigNews" in anything users see (never "PlainNews"). Taglines: "Zero Fluff", "everyday words".
- Banned phrases: "8th grade reading level", "8th-grade level", "jargon-free".
- Every story uses the 4 pillars, in order: The Big Picture (1–2 sentences) · What Happened (3 bullets) · Why It Matters · Plain Words (plain definitions of hard terms).

## Content automation (highest risk area in the portfolio)
- Every story links its original sources. Summaries are written fresh — never copy sentences from source articles.
- No story publishes without at least 2 independent sources, or it is labeled as single-source.
- Automated pipelines alert on failure and on empty/duplicate output.
- Never invent quotes, numbers, or names. If a fact isn't in the sources, leave it out.

## AI pipeline
- RSS stories in `lib/news-fetcher.ts` go through `aiSimplifyStory()` via OpenRouter. Check that file for the current model; a free model needs a paid fallback (global rule 5).
- Keep the 30-minute `aiCache`, the limit of 3 concurrent AI calls (prevents 429s), and `createFallbackBreakdown()` as the graceful fallback.

## Pages and UX
- Stories resolve at `app/story/[slug]/page.tsx` with OpenGraph and Twitter card metadata.
- Preferences (theme, bookmarks, text size) persist in localStorage.
- Dialogs have `role="dialog"`, `aria-modal="true"`, and close on Escape.

## Accessibility
- Never disable pinch-to-zoom (no `userScalable: false`, no `maximum-scale=1`).
