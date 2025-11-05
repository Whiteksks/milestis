"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function TextSidebar({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const heading = block.settings.textHeading || "Text Heading"
  const content = block.settings.textContent || "Text content goes here"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-24 h-fit rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium">Quick info</p>
            <p className="mt-2 text-sm text-muted-foreground">Use this area for summary, tips or links.</p>
          </aside>
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{heading}</h2>
            <div className="mt-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>{content}</p>
              <p>{content}</p>
              <p>{content}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
