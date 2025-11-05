"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function FeaturesList({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.featuresTitle || "Features"
  const items = block.settings.featuresItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
        <div className="mt-8 space-y-6">
          {items.map((item: any) => (
            <div key={item.id} className="flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xl">
                {item.icon}
              </div>
              <div>
                <h3 className="text-base font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
