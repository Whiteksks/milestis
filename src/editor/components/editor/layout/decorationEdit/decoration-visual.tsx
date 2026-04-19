"use client"

import Image, { type ImageLoader } from "next/image"
import { cn } from "@/lib/utils"
import { getPlaceholderGradient } from "@/hooks/usePlaceholderGradient"
import type { DecorationElement } from "./decorationTypes"

const passthroughLoader: ImageLoader = ({ src }) => src

function hashSeed(value: string): number {
  let hash = 2166136261 >>> 0
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619) >>> 0
  }
  return hash
}

const BUBBLE_SHAPES = [
  "rounded-full",
  "rounded-[49%_51%_50%_50%/50%_49%_51%_50%]",
  "rounded-[48%_52%_49%_51%/51%_49%_51%_49%]",
] as const

export const BUBBLE_STYLE_OPTIONS = [
  { id: "soft", label: "Soft Orb" },
  { id: "glass", label: "Glass Orb" },
  { id: "memory", label: "Memory Orb" },
] as const

const BUBBLE_STYLE_CLASSES = {
  soft: {
    aura: "bg-white/16",
    shell: "border-white/36 shadow-[0_18px_36px_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,0.55)]",
    core: "bg-white/16",
    ringOuter: "border-white/22",
    ringInner: "border-white/10",
    highlightBar: "bg-white/45",
    highlightDot: "bg-white/55",
    accentDot: "bg-white/16",
    bottomGlow: "bg-white/10",
    bottomShadow: "bg-black/5",
    overlay: "linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 46%, rgba(255,255,255,0.08) 100%)",
  },
  glass: {
    aura: "bg-sky-100/20",
    shell: "border-white/46 shadow-[0_22px_42px_rgba(170,210,255,0.16),inset_0_1px_0_rgba(255,255,255,0.72)]",
    core: "bg-sky-50/18",
    ringOuter: "border-white/28",
    ringInner: "border-sky-50/16",
    highlightBar: "bg-white/62",
    highlightDot: "bg-white/72",
    accentDot: "bg-sky-50/24",
    bottomGlow: "bg-cyan-50/16",
    bottomShadow: "bg-slate-950/8",
    overlay: "linear-gradient(150deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.04) 44%, rgba(190,235,255,0.18) 100%)",
  },
  memory: {
    aura: "bg-amber-50/22",
    shell: "border-white/38 shadow-[0_20px_40px_rgba(255,210,165,0.16),inset_0_1px_0_rgba(255,248,238,0.62)]",
    core: "bg-rose-50/14",
    ringOuter: "border-white/20",
    ringInner: "border-amber-50/12",
    highlightBar: "bg-white/52",
    highlightDot: "bg-white/60",
    accentDot: "bg-amber-50/24",
    bottomGlow: "bg-rose-50/14",
    bottomShadow: "bg-amber-950/8",
    overlay: "linear-gradient(145deg, rgba(255,248,240,0.18) 0%, rgba(255,255,255,0.02) 44%, rgba(255,228,208,0.14) 100%)",
  },
} as const

interface DecorationVisualProps {
  decoration: DecorationElement
  className?: string
  imageClassName?: string
}

export function DecorationVisual({
  decoration,
  className,
  imageClassName,
}: DecorationVisualProps) {
  const resolvedImage = decoration.image?.trim() ?? ""
  const shouldRenderBubble = decoration.kind === "bubble" || !resolvedImage

  if (shouldRenderBubble) {
    const bubbleKey = decoration.bubbleSeed ?? decoration.id ?? decoration.name ?? "decoration-bubble"
    const bubbleHash = hashSeed(bubbleKey)
    const shapeClass = BUBBLE_SHAPES[bubbleHash % BUBBLE_SHAPES.length]
    const bubbleStyle = decoration.bubbleStyle ?? BUBBLE_STYLE_OPTIONS[bubbleHash % BUBBLE_STYLE_OPTIONS.length].id
    const styleClasses = BUBBLE_STYLE_CLASSES[bubbleStyle]
    const { background } = getPlaceholderGradient(
      bubbleKey,
    )
    const bubbleBackground = [
      "radial-gradient(circle at 30% 26%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.22) 14%, transparent 36%)",
      "radial-gradient(circle at 68% 72%, rgba(255,255,255,0.16) 0%, transparent 42%)",
      styleClasses.overlay,
      background,
    ].join(", ")

    return (
      <div className={cn("relative h-full w-full", className)} aria-hidden>
        <div className={cn("absolute -inset-[10%] blur-2xl opacity-55", shapeClass, styleClasses.aura)} />
        <div
          className={cn(
            "relative isolate h-full w-full overflow-hidden",
            shapeClass,
            "border",
            styleClasses.shell,
          )}
          style={{ background: bubbleBackground }}
        >
          <div className={cn("absolute inset-[9%] blur-md", shapeClass, styleClasses.core)} />
          <div className={cn("absolute inset-[16%] border", shapeClass, styleClasses.ringOuter)} />
          <div className={cn("absolute inset-[22%] border", shapeClass, styleClasses.ringInner)} />
          <div className={cn("absolute inset-x-[18%] top-[10%] h-[20%] blur-[7px]", shapeClass, styleClasses.highlightBar)} />
          <div className={cn("absolute left-[17%] top-[17%] h-[18%] w-[18%] rounded-full blur-[5px]", styleClasses.highlightDot)} />
          <div className={cn("absolute right-[14%] top-[18%] h-[12%] w-[12%] rounded-full blur-md", styleClasses.accentDot)} />
          <div className={cn("absolute bottom-[13%] right-[15%] h-[26%] w-[26%] rounded-full blur-xl", styleClasses.bottomGlow)} />
          <div className={cn("absolute inset-x-[26%] bottom-[16%] h-[10%] rounded-full blur-xl", styleClasses.bottomShadow)} />
        </div>
      </div>
    )
  }

  return (
    <Image
      loader={passthroughLoader}
      unoptimized
      src={resolvedImage}
      alt=""
      fill
      sizes="200px"
      className={cn("object-contain", imageClassName, className)}
    />
  )
}