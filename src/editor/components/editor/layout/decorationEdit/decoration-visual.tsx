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
    shell: "border-white/30 shadow-[0_16px_32px_rgba(255,255,255,0.08),inset_0_1px_0_rgba(255,255,255,0.50)]",
  },
  glass: {
    aura: "bg-sky-100/20",
    shell: "border-white/40 shadow-[0_20px_40px_rgba(170,210,255,0.14),inset_0_1px_0_rgba(255,255,255,0.65)]",
  },
  memory: {
    aura: "bg-amber-50/22",
    shell: "border-white/32 shadow-[0_18px_36px_rgba(255,210,165,0.14),inset_0_1px_0_rgba(255,248,238,0.55)]",
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
      "radial-gradient(circle at 28% 26%, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.06) 42%, transparent 58%)",
      background,
    ].join(", ")

    return (
      <div className={cn("relative h-full w-full", className)} aria-hidden>
        <div className={cn("absolute -inset-[10%] blur-2xl opacity-50", shapeClass, styleClasses.aura)} />
        <div
          className={cn(
            "relative h-full w-full overflow-hidden",
            shapeClass,
            "border",
            styleClasses.shell,
          )}
          style={{ background: bubbleBackground }}
        />
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