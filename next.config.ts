import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

// ── Content Security Policy ───────────────────────────────────────────────────
// Adjust src lists as you add new third-party services.
const CSP = [
  "default-src 'self'",
  // Scripts: Next.js chunks + Firebase + Google APIs (apis.google.com used by Firebase Auth)
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://accounts.google.com",
  // Styles: inline styles used by Tailwind / Radix
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Images: Firebase Storage + Google account avatars + next/image optimiser
  "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://lh3.googleusercontent.com",
  // Fetch / XHR: Firebase services + Cloud Run functions
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.cloudfunctions.net https://*.run.app",
  // Frames: Firebase Auth popup + Google Sign-In + YouTube embeds
  "frame-src https://*.firebaseapp.com https://accounts.google.com https://www.youtube.com https://www.youtube-nocookie.com",
  // Media
  "media-src 'self' blob: https://firebasestorage.googleapis.com",
  // Workers (Framer Motion / Next.js)
  "worker-src 'self' blob:",
]
  .join("; ")

const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "X-XSS-Protection",        value: "1; mode=block" },
  { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
      // {
      //   // Long-term cache for immutable Next.js assets
      //   source: "/_next/static/(.*)",
      //   headers: [
      //     { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      //   ],
      // },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },
  webpack(config) {
    // Ищем правило для изображений
    const imageRule = config.module.rules.find(
      (rule: { test?: RegExp }) =>
        typeof rule !== "string" &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
    )

    if (imageRule && typeof imageRule !== "string") {
      // исключаем .svg из стандартного image-loader
      if (!imageRule.exclude) imageRule.exclude = []
      ;(imageRule.exclude as RegExp[]).push(/\.svg$/i)
    }

    // Добавляем обработку через SVGR
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })

    return config
  },
}

export default withNextIntl(nextConfig)
