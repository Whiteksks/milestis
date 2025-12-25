"use client"

import type { ReactNode } from "react"

export type PhotoEffectType = "none" | "vintage" | "watercolor" | "duotone" | "grain" | "sepia"

const DEFAULT_PHOTO_URL =
  "https://server.wallpaperalchemy.com/storage/wallpapers/160/frieren-winter-mountain-anime-wallpaper-4k.png"

interface PhotoEffectProps {
  effect: PhotoEffectType
  imageUrl?: string
  className?: string
  children?: ReactNode
}

export function PhotoEffect({ effect, imageUrl, className = "" }: PhotoEffectProps) {
  const effects: Record<PhotoEffectType, { filter: string; overlays: ReactNode }> = {
    none: {
      filter: "",
      overlays: null,
    },
    vintage: {
      filter: "sepia(0.4) contrast(0.95) brightness(0.9) saturate(0.85)",
      overlays: (
        <>
          <div
            className="absolute inset-0 mix-blend-overlay opacity-30"
            style={{
              background: "linear-gradient(180deg, rgba(139, 90, 43, 0.4) 0%, rgba(89, 69, 49, 0.3) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: `url("https://server.wallpaperalchemy.com/storage/wallpapers/160/frieren-winter-mountain-anime-wallpaper-4k.png viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 20%, rgba(28, 25, 23, 0.4) 60%, rgba(28, 25, 23, 0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-screen opacity-15"
            style={{
              background:
                "linear-gradient(125deg, rgba(251, 191, 36, 0.6) 0%, transparent 40%, transparent 60%, rgba(251, 146, 60, 0.4) 100%)",
            }}
          />
        </>
      ),
    },
    watercolor: {
      filter: "contrast(0.9) saturate(0.8) brightness(1.1)",
      overlays: (
        <>
          <div
            className="absolute inset-0 mix-blend-soft-light opacity-60"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(254, 243, 199, 0.5) 70%, rgba(254, 243, 199, 0.9) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "linear-gradient(180deg, rgba(254, 243, 199, 0.8) 0%, transparent 15%, transparent 85%, rgba(254, 243, 199, 0.8) 100%)",
            }}
          />
        </>
      ),
    },
    duotone: {
      filter: "grayscale(100%) contrast(1.2)",
      overlays: (
        <>
          <div
            className="absolute inset-0 mix-blend-color"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #f97316 100%)",
            }}
          />
          <div
            className="absolute inset-0 mix-blend-soft-light opacity-50"
            style={{
              background: "linear-gradient(to top, transparent 0%, rgba(251, 146, 60, 0.3) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-20 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </>
      ),
    },
    grain: {
      filter: "contrast(1.05) brightness(0.98)",
      overlays: (
        <>
          <div
            className="absolute inset-0 opacity-50 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.3) 100%)",
            }}
          />
        </>
      ),
    },
    sepia: {
      filter: "sepia(0.6) contrast(1.05) brightness(0.95)",
      overlays: (
        <>
          <div
            className="absolute inset-0 mix-blend-overlay opacity-20"
            style={{
              background: "linear-gradient(180deg, rgba(180, 120, 60, 0.3) 0%, rgba(120, 80, 40, 0.2) 100%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-25 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </>
      ),
    },
  }

  const { filter, overlays } = effects[effect]
  const photoSrc = imageUrl || DEFAULT_PHOTO_URL

  return (
    <div className={`${className}`} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
      <img
        src={photoSrc || "/placeholder.svg"}
        alt=""
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          filter: filter || undefined,
        }}
      />
      {overlays}
    </div>
  )
}
