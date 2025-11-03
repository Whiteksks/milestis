"use client"

import type React from "react"
import InternalSortable from "@/editor/dnd/InternalSortable"
import { Sparkles, Layout, Zap } from "lucide-react"

export const SimpleBlockA: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header section */}
      <div className="max-w-5xl mx-auto px-6 py-16 lg:py-24">
        <div className="space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Editor Template</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight">Simple Block Editor</h1>

          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Create and manage dynamic content blocks with drag-and-drop simplicity. Perfect for building flexible page
            layouts.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {[
            {
              icon: Layout,
              title: "Flexible Layout",
              description: "Drag and drop to organize content blocks",
            },
            {
              icon: Zap,
              title: "Fast & Responsive",
              description: "Optimized for all screen sizes",
            },
            {
              icon: Sparkles,
              title: "Modern Design",
              description: "Clean, professional UI components",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 rounded-lg bg-card border border-border/50 hover:border-border transition-colors"
            >
              <div className="flex-shrink-0">
                <feature.icon className="w-5 h-5 text-accent mt-1" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground text-sm mb-1">{feature.title}</h3>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main editor area */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Content Area</h2>
              <p className="text-sm text-muted-foreground mt-1">Drag items below to rearrange your layout</p>
            </div>
          </div>

          <div className="border border-border bg-card rounded-xl p-8 shadow-lg shadow-accent/5 hover:shadow-xl hover:shadow-accent/10 transition-shadow duration-300 min-h-96 flex items-center justify-center">
            <div className="w-full">
              <InternalSortable />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            💡 Tip: Use the drag handles to reorder blocks and customize your layout
          </p>
        </div>
      </div>
    </div>
  )
}

export default SimpleBlockA
