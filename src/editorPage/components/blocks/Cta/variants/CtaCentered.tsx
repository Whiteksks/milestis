"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function CtaCentered({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.ctaTitle || "Call to Action"
  const description = block.settings.ctaDescription || "Description goes here"
  const button = block.settings.ctaButton || { text: "Get Started", href: "#" }

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-20 sm:py-28`}>
      <div className="container mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight">{title}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">{description}</p>
        <div className="mt-10">
          <Button size="lg">{button.text}</Button>
        </div>
      </div>
    </section>
  )
}
