# SimplyBigNews — Lessons Learned

- 2026-09-25: Pair every free-tier AI model call with a cheap paid fallback and spend guard (why: free model rate limits or transient outages cause silent content degradation if unhandled).
- 2026-09-26: Always read reply summaries aloud using C:\Users\sammy\speak.ps1 (why: Sammy explicitly instructed to read all messages aloud going forward).
- 2026-09-26: Never declare work done on code compilation alone; verify on the physical device and ensure state persistence and passive income loops are closed (why: SnapChef passed all automated tests but had dead buttons on Sammy's phone because of a domain mismatch).
- 2026-09-27: The Hierarchical Compound AI System (HCAS) stays at the core of our setup across all projects (why: Lead Architects direct and review while free local GPU workers execute, preserving flagship token limits and scaling passive income).


- 2026-09-28: Keep SimplyBigNews positioned for a universal general audience (plain English news for everyone), never narrow it to seniors or elderly guides (why: Sammy explicitly instructed that SimplyBigNews must appeal to everyone, not just old people).

- 2026-10-06: When extracting locations from news, always use strict regex checking for AP Datelines (like Calif. or Wash.) and punctuation boundaries to avoid false positives on words like "mass", "or", "in", and "wash". (why: simple word matching causes unrelated stories to ping random states).
- 2026-10-06: For Reddit bot integrations, prefer RSS feeds over PRAW when only reading data to bypass Dev Portal registration and OAuth requirements. (why: zero chores for Sammy).

- 2026-10-06: When scaling the interactive US map for thousands of live hyper-local stories, use an Upstash Redis database (`@upstash/redis`) instead of fetching 50+ RSS feeds on the fly, to prevent memory crashes and timeout limits in Vercel Serverless Functions. (why: prevents 504 errors on massive feed aggregations).
