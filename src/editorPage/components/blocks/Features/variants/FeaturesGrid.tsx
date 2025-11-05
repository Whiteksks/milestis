"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function FeaturesGrid({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.featuresTitle || "Features"
  const items = block.settings.featuresItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <div key={item.id} className="rounded-xl border bg-card p-6 shadow-sm text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                {item.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
