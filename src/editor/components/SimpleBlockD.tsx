"use client"

import type React from "react"
import InternalSortable, { type InternalSortableItem } from "@/editor/dnd/InternalSortable"
import { BookOpen, Award, Users, FileText } from "lucide-react"

const builderItems: InternalSortableItem[] = [
  {
    id: "overview",
    content: (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Overview</p>
        <h3 className="text-lg font-semibold text-foreground">Project summary</h3>
        <p className="text-sm text-muted-foreground">Describe the goal of your page and outline the intended audience.</p>
      </div>
    ),
  },
  {
    id: "media",
    content: (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Media</p>
        <h3 className="text-lg font-semibold text-foreground">Visual showcase</h3>
        <p className="text-sm text-muted-foreground">Highlight imagery, video embeds, or interactive content.</p>
      </div>
    ),
  },
  {
    id: "details",
    content: (
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Details</p>
        <h3 className="text-lg font-semibold text-foreground">Information blocks</h3>
        <p className="text-sm text-muted-foreground">Add feature highlights, testimonials, or pricing tables.</p>
      </div>
    ),
  },
]

export const SimpleBlockD: React.FC = () => {
  const sections = [
    {
      icon: BookOpen,
      title: "Getting Started",
      description: "Learn the basics of our block editor with interactive tutorials",
    },
    {
      icon: Award,
      title: "Best Practices",
      description: "Master industry-standard design patterns and techniques",
    },
    {
      icon: Users,
      title: "Community",
      description: "Connect with other designers and share your creations",
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Complete API reference and component guides",
    },
  ]

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border/40">
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30">
              <Award className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Professional Edition</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-foreground tracking-tight">
              Create Extraordinary Websites
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our powerful block editor combines simplicity with professional-grade features. Build stunning websites
              without writing a single line of code.
            </p>

            <div className="flex gap-4 justify-center pt-4">
              <button className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors">
                Start Building
              </button>
              <button className="px-6 py-3 rounded-lg border border-border hover:bg-card/50 text-foreground font-medium transition-colors">
                View Demo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {sections.map((section, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 p-6 rounded-xl bg-card/50 border border-border/30 hover:border-accent/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                <section.icon className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">{section.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{section.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="border-t border-border/40 pt-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Build Your Layout</h2>
            <p className="text-muted-foreground">Drag and arrange blocks to create your perfect design</p>
          </div>

          <div className="bg-card border border-border/40 rounded-xl p-12 shadow-md hover:shadow-lg transition-shadow">
            <div className="min-h-96 bg-background/50 border-2 border-dashed border-border/50 rounded-lg p-8 flex items-center justify-center">
              <InternalSortable
                items={builderItems}
                containerClassName="space-y-4"
                itemClassName="bg-background border border-border/40 rounded-lg p-5 shadow-sm transition-shadow hover:shadow-md"
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-8 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-3">Ready to get started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of creators building beautiful websites with our block editor
            </p>
            <button className="px-6 py-3 rounded-lg bg-accent text-accent-foreground font-medium hover:bg-accent/90 transition-colors">
              Get Started Free
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleBlockD
