"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function FeaturesAlternating({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.featuresTitle || "Features"
  const items = block.settings.featuresItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">{title}</h2>
        <div className="mt-12 space-y-10">
          {items.map((item: any, idx: number) => (
            <div key={item.id} className={`grid items-center gap-8 lg:grid-cols-2 ${idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div className="rounded-2xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                </div>
                <p className="mt-3 text-muted-foreground">{item.description}</p>
              </div>
              <div className="aspect-[16/10] rounded-2xl border bg-muted/30" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
