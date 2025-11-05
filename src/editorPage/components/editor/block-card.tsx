"use client"

import { motion } from "framer-motion"
import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { Trash2, GripVertical } from "lucide-react"
import { Navbar } from "@/editorPage/components/blocks/Navbar/Navbar"
import { Hero } from "@/editorPage/components/blocks/Hero/Hero"
import { Gallery } from "@/editorPage/components/blocks/Gallery/Gallery"
import { TextBlock } from "@/editorPage/components/blocks/text-block"
import { CtaBlock } from "@/editorPage/components/blocks/cta-block"
import { FeaturesBlock } from "@/editorPage/components/blocks/features-block"
import { ContactBlock } from "@/editorPage/components/blocks/contact-block"
import { TestimonialsBlock } from "@/editorPage/components/blocks/testimonials-block"
import { QuoteBlock } from "@/editorPage/components/blocks/quote-block"

interface BlockCardProps {
  block: CanvasBlock
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export function BlockCard({ block, isSelected, onSelect, onDelete }: BlockCardProps) {
  const renderBlockContent = () => {
    switch (block.type) {
      case "navbar":
        return <Navbar block={block} isSelected={isSelected} onSelect={onSelect} />
      case "hero":
        return <Hero block={block} isSelected={isSelected} />
      case "gallery":
        return <Gallery block={block} isSelected={isSelected} />
      case "text":
        return <TextBlock block={block} isSelected={isSelected} />
      case "cta":
        return <CtaBlock block={block} isSelected={isSelected} />
      case "features":
        return <FeaturesBlock block={block} isSelected={isSelected} />
      case "contact":
        return <ContactBlock block={block} isSelected={isSelected} />
      case "testimonials":
        return <TestimonialsBlock block={block} isSelected={isSelected} />
      case "quote":
        return <QuoteBlock block={block} isSelected={isSelected} />
      default:
        return (
          <div className="p-8 text-center">
            <h3 className="text-lg font-semibold mb-2">{block.title}</h3>
            <p className="text-sm text-muted-foreground">{block.description}</p>
          </div>
        )
    }
  }

  return (
    <motion.div
      className={`relative group rounded-lg overflow-hidden transition-smooth border ${
        isSelected
          ? "border-foreground/30 bg-card shadow-sm"
          : "border-border bg-card hover:border-foreground/20 hover:bg-muted/50"
      }`}
      whileHover={{ y: -1 }}
      onClick={onSelect}
    >
      <motion.button
        className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 rounded text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-drag-handle
      >
        <GripVertical size={16} strokeWidth={1.5} />
      </motion.button>

      <div
        className={`${block.settings?.background || "bg-background"} ${block.settings?.textColor || "text-foreground"} px-8 min-h-32 relative overflow-hidden`}
      >
        {renderBlockContent()}
      </div>

      <motion.button
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-smooth p-1.5 rounded text-muted-foreground hover:text-destructive z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
      >
        <Trash2 size={16} strokeWidth={1.5} />
      </motion.button>

      {isSelected && (
        <motion.div
          className="h-0.5 bg-foreground/40"
          layoutId="selectedIndicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </motion.div>
  )
}
