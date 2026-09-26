# SimplyBigNews — Lessons Learned

- 2026-09-25: Always wrap Next.js client error boundaries and global error handlers with Sentry.captureException (why: Next.js catches rendering errors internally and suppresses automatic unhandled exception bubbling).
- 2026-09-25: In Next.js 15+ and 16 with Sentry v11, register Sentry in instrumentation.ts using Sentry.captureRequestError and client in instrumentation-client.ts (why: experimental.instrumentationHook is removed in newer Next.js and Turbopack requires instrumentation-client.ts).
