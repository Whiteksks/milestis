"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function FeaturesCards({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.featuresTitle || "Features"
  const items = block.settings.featuresItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-20`}> 
      <div className="container mx-auto px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">{title}</h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <div key={item.id} className="group rounded-2xl border bg-gradient-to-b from-card to-card/60 p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-2xl">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
              </div>
              <p className="mt-3 text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
