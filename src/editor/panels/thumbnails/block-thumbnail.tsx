"use client"

import type React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BlockThumbnailProps {
  title: string
  description: string
  preview: React.ReactNode
  onClick?: () => void
  isActive?: boolean
  className?: string
}

export const BlockThumbnail: React.FC<BlockThumbnailProps> = ({
  title,
  description,
  preview,
  onClick,
  isActive = false,
  className,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl border transition-all duration-300 overflow-hidden w-full",
        isActive
          ? "border-accent bg-card/60 shadow-lg shadow-accent/20"
          : "border-border/50 bg-card hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10",
        className
      )}
    >
      {/* Preview area */}
      <div className="aspect-video bg-background/50 border-b border-border/30 overflow-hidden relative">
        <div className="w-full h-full scale-50 origin-top-left">
          <div className="w-[200%] h-[200%]">{preview}</div>
        </div>
      </div>

      {/* Info area */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground text-sm truncate group-hover:text-accent transition-colors">
              {title}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-accent flex-shrink-0 transition-colors" />
        </div>
      </div>
    </div>
  )
}
