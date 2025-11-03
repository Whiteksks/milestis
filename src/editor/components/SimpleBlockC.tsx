"use client"

import type React from "react"
import InternalSortable, { type InternalSortableItem } from "@/editor/dnd/InternalSortable"
import { Grid3x3, Zap, Lock, Rocket } from "lucide-react"

const selectionItems: InternalSortableItem[] = [
  {
    id: "layout",
    content: (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Structure</p>
        <h3 className="text-lg font-semibold text-foreground">Layout builder</h3>
        <p className="text-sm text-muted-foreground">Arrange sections, adjust spacing, and create responsive grids.</p>
      </div>
    ),
  },
  {
    id: "style",
    content: (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Design</p>
        <h3 className="text-lg font-semibold text-foreground">Style controls</h3>
        <p className="text-sm text-muted-foreground">Apply typography, colors, and effects consistently across blocks.</p>
      </div>
    ),
  },
  {
    id: "content",
    content: (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Content</p>
        <h3 className="text-lg font-semibold text-foreground">Dynamic regions</h3>
        <p className="text-sm text-muted-foreground">Drop in cards, media, or forms to match your template selection.</p>
      </div>
    ),
  },
]

export const SimpleBlockC: React.FC = () => {
  const templates = [
    {
      icon: Grid3x3,
      title: "Grid Layout",
      description: "Perfect for showcasing products or portfolio items",
      tags: ["responsive", "2D", "gallery"],
    },
    {
      icon: Zap,
      title: "Performance Block",
      description: "Optimized for speed and SEO",
      tags: ["fast", "SEO", "optimized"],
    },
    {
      icon: Lock,
      title: "Secure Form",
      description: "Protected data collection with validation",
      tags: ["form", "secure", "validated"],
    },
    {
      icon: Rocket,
      title: "Launch Section",
      description: "Call-to-action optimized block",
      tags: ["CTA", "conversion", "modern"],
    },
  ]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 mb-4">
            <Grid3x3 className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Template Gallery</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">Block Templates</h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Explore our collection of professionally designed block templates for your website editor
          </p>
        </div>

        {/* Template Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {templates.map((template, index) => (
            <div
              key={index}
              className="group bg-card border border-border/50 rounded-xl p-6 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 cursor-pointer"
            >
              <div className="mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <template.icon className="w-6 h-6 text-accent" />
                </div>
              </div>

              <h3 className="font-semibold text-foreground mb-2 text-lg">{template.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{template.description}</p>

              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-accent/5 text-accent/70 border border-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selection section */}
        <div className="bg-card/50 border border-border/40 rounded-xl p-8 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2">Select a Block</h2>
            <p className="text-muted-foreground">Choose from the templates above and customize it for your needs</p>
          </div>

          <div className="min-h-72 bg-background/50 border-2 border-dashed border-border/50 rounded-lg p-8">
            <InternalSortable
              items={selectionItems}
              containerClassName="space-y-4"
              itemClassName="bg-card/80 border border-border/40 rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { label: "Templates Available", value: "40+" },
            { label: "Customizable Elements", value: "200+" },
            { label: "Supported Devices", value: "All" },
          ].map((stat, index) => (
            <div key={index} className="bg-card border border-border/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-accent">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SimpleBlockC
