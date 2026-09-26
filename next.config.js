const { withSentryConfig } = require('@sentry/nextjs/config')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
}

module.exports = withSentryConfig(nextConfig, {
  // Sentry organization and project slugs
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Suppress verbose source map uploading logs during builds
  silent: !process.env.CI,

  // Automatically widen the upload scope of client source files
  widenClientFileUpload: true,

  // Tree-shake Sentry logger statements to minimize bundle size
  disableLogger: true,
})
