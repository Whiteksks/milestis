"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { Card, CardContent } from "@/components/ui/card"

export function FeaturesGrid({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.featuresTitle || "Features"
  const items = block.settings.featuresItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-4">{title}</h2>
        <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
          Discover the powerful features that make our solution stand out
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: any) => (
            <Card
              key={item.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <CardContent className="p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-3xl mb-4 group-hover:bg-primary/20 transition-colors duration-300 group-hover:scale-110 transform">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
