"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function CtaCard({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.ctaTitle || "Call to Action"
  const description = block.settings.ctaDescription || "Description goes here"
  const button = block.settings.ctaButton || { text: "Get Started", href: "#" }

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-card p-10 text-center shadow-sm">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
          <div className="mt-8">
            <Button size="lg">{button.text}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
