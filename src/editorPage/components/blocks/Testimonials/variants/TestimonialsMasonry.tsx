"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function TestimonialsMasonry({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.testimonialsTitle || "Testimonials"
  const items = block.settings.testimonialsItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center">{title}</h2>
        <div className="mt-12 columns-1 sm:columns-2 gap-6 [column-fill:_balance]">
          {items.map((item: any) => (
            <div key={item.id} className="mb-6 break-inside-avoid rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-muted-foreground">{item.content}</p>
              <div className="mt-6 flex items-center gap-4">
                <img src={item.avatar || "/placeholder.svg"} alt={item.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
