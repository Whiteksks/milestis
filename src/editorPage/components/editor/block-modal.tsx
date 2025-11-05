"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BLOCK_LIBRARY, type BlockData } from "@/editorPage/lib/block-types"
import { Check, Heart, Grid3x3, Sparkles, X, ArrowLeft, ZoomIn, ZoomOut, Tag } from "lucide-react"
import { DialogTitle } from "@radix-ui/react-dialog"

interface BlockModalProps {
  isOpen: boolean
  onClose: () => void
  onAddBlock: (block: BlockData, mode: "replace" | "add") => void
}

type Category = "all" | "layout" | "content" | "forms"
type StyleFilter = "all" | "minimalist" | "modern" | "bold"

const blockTags: Record<string, string[]> = {
  hero: ["Landing", "Header", "CTA", "Hero Section"],
  gallery: ["Images", "Grid", "Portfolio", "Gallery"],
  text: ["Content", "Typography", "Article", "Text"],
  quote: ["Testimonial", "Quote", "Highlight"],
  contact: ["Form", "Contact", "Email", "Input"],
  cta: ["Call to Action", "Button", "Conversion"],
  features: ["Features", "Grid", "Services", "Benefits"],
  testimonials: ["Reviews", "Social Proof", "Testimonials"],
}

export function BlockModal({ isOpen, onClose, onAddBlock }: BlockModalProps) {
  const [selectedBlock, setSelectedBlock] = useState<BlockData | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [mode, setMode] = useState<"replace" | "add">("add")
  const [activeTab, setActiveTab] = useState<"featured" | "favorites">("featured")
  const [categoryFilter, setCategoryFilter] = useState<Category>("all")
  const [styleFilter, setStyleFilter] = useState<StyleFilter>("all")
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [zoom, setZoom] = useState(1)

  const getBlockCategory = (type: string): Category => {
    if (["hero", "gallery", "features"].includes(type)) return "layout"
    if (["text", "quote", "testimonials"].includes(type)) return "content"
    if (["contact", "cta"].includes(type)) return "forms"
    return "all"
  }

  const getBlockStyle = (id: string): StyleFilter => {
    if (id.includes("hero") || id.includes("cta")) return "bold"
    if (id.includes("text") || id.includes("quote")) return "minimalist"
    return "modern"
  }

  const filteredBlocks = useMemo(() => {
    let blocks = activeTab === "favorites" ? BLOCK_LIBRARY.filter((b) => favorites.has(b.id)) : BLOCK_LIBRARY

    if (categoryFilter !== "all") {
      blocks = blocks.filter((b) => getBlockCategory(b.type) === categoryFilter)
    }

    if (styleFilter !== "all") {
      blocks = blocks.filter((b) => getBlockStyle(b.id) === styleFilter)
    }

    return blocks
  }, [activeTab, categoryFilter, styleFilter, favorites])

  const toggleFavorite = (blockId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setFavorites((prev) => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(blockId)) {
        newFavorites.delete(blockId)
      } else {
        newFavorites.add(blockId)
      }
      return newFavorites
    })
  }

  const handleBlockClick = (block: BlockData) => {
    setSelectedBlock(block)
    setPreviewMode(true)
    setZoom(1)
  }

  const handleBackToList = () => {
    setPreviewMode(false)
    setZoom(1)
  }

  const handleApply = () => {
    if (selectedBlock) {
      onAddBlock(selectedBlock, mode)
      setSelectedBlock(null)
      setMode("add")
      setPreviewMode(false)
      onClose()
    }
  }

  const handleClose = () => {
    setPreviewMode(false)
    setSelectedBlock(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTitle className="sr-only">Add Block</DialogTitle>
      <DialogContent className="max-w-6xl! w=[60vw] overflow-auto border border-border bg-background rounded-lg p-0 shadow-sm max-h-[85vh]">
        <AnimatePresence mode="wait">
          {!previewMode ? (
            <motion.div
              key="list-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              <div className="border-b border-border bg-muted/20">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-sm font-semibold text-foreground">Add Block</h2>
                    <div className="flex gap-1 bg-muted/50 rounded-md p-1">
                      <button
                        onClick={() => setActiveTab("featured")}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          activeTab === "featured"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Sparkles size={12} />
                        Интересные
                      </button>
                      <button
                        onClick={() => setActiveTab("favorites")}
                        className={`px-3 py-1.5 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                          activeTab === "favorites"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <Heart size={12} />
                        Избранное
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-4 space-y-3">
                  {/* Category Filter */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Category</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["all", "layout", "content", "forms"] as Category[]).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setCategoryFilter(cat)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                            categoryFilter === cat
                              ? "border-foreground/30 bg-background text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                          }`}
                        >
                          {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Filter */}
                  <div className="space-y-1.5">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Style</p>
                    <div className="flex gap-2 flex-wrap">
                      {(["all", "minimalist", "modern", "bold"] as StyleFilter[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => setStyleFilter(style)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                            styleFilter === style
                              ? "border-foreground/30 bg-background text-foreground"
                              : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
                          }`}
                        >
                          {style === "all" ? "All" : style.charAt(0).toUpperCase() + style.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {filteredBlocks.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                    {activeTab === "favorites" ? "No favorites yet" : "No blocks found"}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {filteredBlocks.map((block) => (
                      <motion.div
                        key={block.id}
                        onClick={() => handleBlockClick(block)}
                        className="relative group cursor-pointer rounded-lg border border-border hover:border-foreground/20 hover:shadow-sm overflow-hidden transition-all"
                        whileHover={{ y: -2 }}
                      >
                        {/* Preview Image */}
                        <div
                          className={`aspect-video ${block.settings.background} flex items-center justify-center p-4`}
                        >
                          <div className="text-center">
                            <Grid3x3 size={24} className={block.settings.textColor} />
                          </div>
                        </div>

                        {/* Block Info */}
                        <div className="p-3 bg-background">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-xs text-foreground truncate">{block.title}</p>
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{block.description}</p>
                            </div>
                            <button
                              onClick={(e) => toggleFavorite(block.id, e)}
                              className="flex-shrink-0 text-muted-foreground hover:text-red-500 transition-colors"
                            >
                              <Heart size={14} className={favorites.has(block.id) ? "fill-red-500 text-red-500" : ""} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col h-full"
            >
              {/* Header with title and tags */}
              <div className="border-b border-border bg-muted/20 px-6 py-4">
                <div className="flex items-start justify-between gap-6">
                  {/* Left: Title */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-foreground mb-1">{selectedBlock?.title}</h2>
                    <p className="text-sm text-muted-foreground">{selectedBlock?.description}</p>
                  </div>

                  {/* Right: Tags */}
                  <div className="flex-1 flex flex-wrap gap-2 justify-end">
                    {selectedBlock &&
                      blockTags[selectedBlock.type]?.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-muted/50 border border-border text-xs text-muted-foreground"
                        >
                          <Tag size={10} />
                          {tag}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    onClick={handleBackToList}
                    variant="outline"
                    size="sm"
                    className="gap-2 text-xs h-9 border border-border hover:bg-muted/50 bg-transparent"
                  >
                    <ArrowLeft size={14} />
                    Назад к списку
                  </Button>

                  <div className="flex gap-2 flex-1">
                    <div className="flex gap-1 bg-muted/50 rounded-md p-1">
                      {(["replace", "add"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                            mode === m
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {m === "replace" ? "Replace All" : "Add New"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleApply}
                    className="bg-foreground text-background hover:bg-foreground/90 gap-2 text-xs h-9"
                    size="sm"
                  >
                    <Check size={14} strokeWidth={2} />
                    Добавить шаблон
                  </Button>
                </div>
              </div>

              {/* Preview area with zoom controls */}
              <div className="flex-1 overflow-hidden bg-muted/10 relative">
                {/* Zoom controls */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <button
                    onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))}
                    className="p-2 rounded-md bg-background border border-border hover:bg-muted/50 transition-colors"
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    onClick={() => setZoom((z) => Math.min(2, z + 0.25))}
                    className="p-2 rounded-md bg-background border border-border hover:bg-muted/50 transition-colors"
                    disabled={zoom >= 2}
                  >
                    <ZoomIn size={16} />
                  </button>
                  <span className="px-3 py-2 rounded-md bg-background border border-border text-xs font-medium">
                    {Math.round(zoom * 100)}%
                  </span>
                </div>

                {/* Scrollable preview */}
                <div className="w-full h-full overflow-auto p-8 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: zoom }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="origin-center"
                  >
                    <div
                      className={`w-[600px] min-h-[400px] rounded-lg border border-border shadow-lg overflow-hidden ${selectedBlock?.settings.background}`}
                    >
                      {/* Preview content */}
                      <div className={`p-8 ${selectedBlock?.settings.textColor}`}>
                        <div className="text-center space-y-3">
                          <Grid3x3 size={40} className="mx-auto opacity-50" />
                          <h3 className="text-xl font-bold">{selectedBlock?.title}</h3>
                          <p className="text-sm opacity-70 max-w-md mx-auto">{selectedBlock?.description}</p>
                          <div className="flex gap-2 justify-center mt-4">
                            <div className="px-4 py-2 bg-foreground/10 rounded-md text-xs font-medium">
                              Preview Button
                            </div>
                            <div className="px-4 py-2 bg-foreground/5 rounded-md text-xs font-medium">Secondary</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}
