import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

// ── Content Security Policy ───────────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  // Scripts: Google reCAPTCHA + Firebase + Iubenda + Meta Pixel
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.firebaseapp.com https://*.googleapis.com https://apis.google.com https://accounts.google.com https://www.google.com https://www.gstatic.com https://cdn.iubenda.com https://www.iubenda.com https://embeds.iubenda.com http://cdn.iubenda.com http://*.iubenda.com https://connect.facebook.net",
  // Styles: inline styles used by Tailwind / Radix + Iubenda
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.iubenda.com https://cdn.iubenda.com",
  // Fonts
  "font-src 'self' https://fonts.gstatic.com",
  // Images: Firebase Storage + Google Avatars + Next.js optimizer + Iubenda + AWS S3 Icons + Unsplash + Meta Pixel noscript beacon
  "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://storage.googleapis.com https://lh3.googleusercontent.com https://*.iubenda.com https://*.amazonaws.com https://*.unsplash.com https://unsplash.com https://www.facebook.com",
  // Fetch / XHR: Добавлены https://www.google.com и https://*.google.com для App Check и reCAPTCHA API + Meta Pixel
  "connect-src 'self' https://*.googleapis.com https://*.google.com https://www.google.com https://*.firebaseio.com wss://*.firebaseio.com https://*.cloudfunctions.net https://*.run.app https://*.iubenda.com https://www.facebook.com https://connect.facebook.net",
  // Frames: Google reCAPTCHA + Firebase Auth + YouTube + Iubenda
  "frame-src 'self' https://milestis.com https://*.milestis.com https://*.firebaseapp.com https://accounts.google.com https://www.google.com https://www.gstatic.com https://www.youtube.com https://www.youtube-nocookie.com https://*.iubenda.com",
  // Media
  "media-src 'self' blob: https://firebasestorage.googleapis.com",
  // Workers (Framer Motion / Next.js)
  "worker-src 'self' blob:",
  // Автоматически переводит HTTP запросы в HTTPS там, где это возможно
  "upgrade-insecure-requests",
]
  .join("; ");
  
const securityHeaders = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "X-Content-Type-Options",  value: "nosniff" },
  { key: "X-Frame-Options",         value: "SAMEORIGIN" },
  { key: "X-XSS-Protection",        value: "1; mode=block" },
  { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",      value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
  },
  webpack(config) {
    const imageRule = config.module.rules.find(
      (rule: { test?: RegExp }) =>
        typeof rule !== "string" &&
        rule.test instanceof RegExp &&
        rule.test.test(".svg")
    )

    if (imageRule && typeof imageRule !== "string") {
      if (!imageRule.exclude) imageRule.exclude = []
      ;(imageRule.exclude as RegExp[]).push(/\.svg$/i)
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    })

    return config
  },
}

export default withNextIntl(nextConfig)
