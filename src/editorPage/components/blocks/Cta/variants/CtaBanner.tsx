"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function CtaBanner({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.ctaTitle || "Call to Action"
  const description = block.settings.ctaDescription || "Description goes here"
  const button = block.settings.ctaButton || { text: "Get Started", href: "#" }

  return (
    <section className="relative py-24">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent" />
      <div className="container mx-auto px-6">
        <div className="rounded-2xl border bg-background/80 backdrop-blur-sm p-10 text-center shadow-xl">
          <h2 className="text-4xl font-extrabold tracking-tight">{title}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>
          <div className="mt-8">
            <Button size="lg">{button.text}</Button>
          </div>
        </div>
      </div>
    </section>
  )
}
