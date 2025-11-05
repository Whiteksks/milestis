"use client"

import { Button } from "@/components/ui/button"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function CtaSplit({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.ctaTitle || "Call to Action"
  const description = block.settings.ctaDescription || "Description goes here"
  const button = block.settings.ctaButton || { text: "Get Started", href: "#" }

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
            <p className="mt-4 text-lg text-muted-foreground">{description}</p>
            <div className="mt-8">
              <Button size="lg">{button.text}</Button>
            </div>
          </div>
          <div className="aspect-video rounded-xl bg-muted/30 border" />
        </div>
      </div>
    </section>
  )
}
