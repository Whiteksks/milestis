"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface CtaBlockProps {
  block: CanvasBlock
  isSelected: boolean
}

export function CtaBlock({ block, isSelected }: CtaBlockProps) {
  const title = block.settings.ctaTitle || "Call to Action"
  const description = block.settings.ctaDescription || "Description goes here"
  const button = block.settings.ctaButton || { text: "Get Started", href: "#" }

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg">{description}</p>
        <div className="mt-10">
          <Button size="lg" variant="default">
            {button.text}
          </Button>
        </div>
      </div>
    </div>
  )
}
