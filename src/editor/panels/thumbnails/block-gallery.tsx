"use client"

import type React from "react"
import { useState } from "react"
import { BlockThumbnail } from "./block-thumbnail"
import { BLOCK_LIBRARY } from "@/editor/blocks/block-library"

export const BlockGallery: React.FC = () => {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const galleryBlocks = BLOCK_LIBRARY.filter((block) => block.showInGallery !== false)
  const selectedBlock = galleryBlocks.find((block) => block.id === selectedBlockId)
  const SelectedComponent = selectedBlock?.component

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Block Templates Gallery</h1>
              <p className="text-muted-foreground mt-1">Choose a template to preview and customize</p>
            </div>
            {selectedBlock && (
              <button
                onClick={() => setSelectedBlockId(null)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-card/50 text-foreground transition-colors text-sm font-medium"
              >
                Close Preview
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Gallery or Full Preview */}
      {selectedBlockId && SelectedComponent ? (
        <div className="w-full">
          <SelectedComponent />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {galleryBlocks.map((block) => (
              <div key={block.id} onClick={() => setSelectedBlockId(block.id)} className="h-full">
                <BlockThumbnail
                  title={block.title}
                  description={block.description}
                  preview={<block.component />}
                  isActive={selectedBlockId === block.id}
                />
              </div>
            ))}
          </div>

          {/* Features section */}
          <div className="mt-16 pt-12 border-t border-border/40">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-3">Why Use Our Block Templates?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose from professionally designed blocks that are fully responsive, customizable, and ready to use
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Responsive Design",
                  description: "All blocks are optimized for mobile, tablet, and desktop viewing",
                },
                {
                  title: "Easy to Customize",
                  description: "Change colors, text, and layout without touching any code",
                },
                {
                  title: "Drag & Drop Editor",
                  description: "Built-in drag-and-drop interface for intuitive content arrangement",
                },
              ].map((feature, index) => (
                <div key={index} className="p-6 rounded-lg bg-card border border-border/30">
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
