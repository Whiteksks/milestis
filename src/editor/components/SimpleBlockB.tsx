"use client"

import type React from "react"
import InternalSortable from "@/editor/dnd/InternalSortable"
import { Code2, Palette, Layers } from "lucide-react"

export const SimpleBlockB: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-background to-background/95">
      {/* Sidebar Navigation */}
      <div className="flex h-screen">
        {/* Left sidebar */}
        <div className="w-64 border-r border-border/30 bg-card/50 p-6 flex flex-col">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-accent flex items-center justify-center">
                <Code2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-semibold text-foreground">BlockStudio</span>
            </div>
            <p className="text-xs text-muted-foreground">Visual editor for dynamic blocks</p>
          </div>

          <nav className="space-y-2 flex-1">
            {[
              { icon: Layers, label: "Blocks", active: true },
              { icon: Palette, label: "Styles", active: false },
              { icon: Code2, label: "Code", active: false },
            ].map((item, index) => (
              <button
                key={index}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${
                  item.active
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "text-muted-foreground hover:bg-card/50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-4 border-t border-border/20">
            <p className="text-xs text-muted-foreground mb-3">Quick actions</p>
            <button className="w-full px-3 py-2 rounded-lg bg-accent/10 hover:bg-accent/15 text-accent text-sm font-medium transition-colors">
              + Add Block
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="mb-10">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">Content Blocks</h1>
                  <p className="text-muted-foreground">Drag and drop to organize your page layout</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 rounded-lg border border-border hover:bg-card/50 text-sm text-foreground transition-colors">
                    Save
                  </button>
                  <button className="px-4 py-2 rounded-lg bg-accent hover:bg-accent/90 text-accent-foreground text-sm font-medium transition-colors">
                    Preview
                  </button>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Blocks", value: "8" },
                { label: "Last Updated", value: "2 hours ago" },
                { label: "Status", value: "Published" },
              ].map((stat, index) => (
                <div key={index} className="bg-card/40 border border-border/30 rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Editor canvas */}
            <div className="bg-card/30 border border-border/40 rounded-xl p-8 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Editor</h2>
                <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
                  Live
                </span>
              </div>

              <div className="min-h-96 bg-background/50 border border-border/40 rounded-lg p-6 border-dashed">
                <InternalSortable />
              </div>
            </div>

            {/* Footer info */}
            <div className="mt-8 text-xs text-muted-foreground">
              <p>
                Keyboard shortcut: Press <code className="bg-card px-1.5 py-0.5 rounded text-foreground">Ctrl+S</code>{" "}
                to save your changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleBlockB
