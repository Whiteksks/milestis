import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shadcnstudio.com", pathname: "/**" },
      { protocol: "https", hostname: "server.wallpaperalchemy.com", pathname: "/**" },
      { protocol: "https", hostname: "images.wallpapersden.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pinimg.com", pathname: "/**" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "storage.googleapis.com", pathname: "/**" },
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
    ],
  },
  webpack(config) {
    // Ищем правило для изображений
    const imageRule = config.module.rules.find(
      (rule: any) =>
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
