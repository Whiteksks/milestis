"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function TestimonialsSingle({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.testimonialsTitle || "Testimonials"
  const items = block.settings.testimonialsItems || []
  const first = items[0]

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-20`}> 
      <div className="container mx-auto max-w-3xl px-6">
        <h2 className="text-center text-4xl font-extrabold tracking-tight">{title}</h2>
        {first && (
          <div className="mt-10 rounded-2xl border bg-card p-8 shadow">
            <p className="text-lg text-muted-foreground">{first.content}</p>
            <div className="mt-6 flex items-center gap-4">
              <img src={first.avatar || "/placeholder.svg"} alt={first.name} className="h-12 w-12 rounded-full object-cover" />
              <div>
                <p className="font-semibold">{first.name}</p>
                <p className="text-sm text-muted-foreground">{first.role}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
