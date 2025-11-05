"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface TestimonialsBlockProps {
  block: CanvasBlock
  isSelected: boolean
}

export function TestimonialsBlock({ block, isSelected }: TestimonialsBlockProps) {
  const title = block.settings.testimonialsTitle || "Testimonials"
  const items = block.settings.testimonialsItems || []

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <div key={item.id} className="rounded-lg border bg-card p-6 shadow-sm">
              <p className="text-muted-foreground">{item.content}</p>
              <div className="mt-6 flex items-center gap-4">
                <img
                  src={item.avatar || "/placeholder.svg"}
                  alt={item.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
