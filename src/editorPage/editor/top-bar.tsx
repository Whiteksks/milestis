"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Eye, Save, Share2, Monitor, Tablet, Smartphone } from "lucide-react"

interface TopBarProps {
  viewport?: "desktop" | "tablet" | "mobile"
  onViewportChange?: (viewport: "desktop" | "tablet" | "mobile") => void
}

export function TopBar({ viewport = "desktop", onViewportChange }: TopBarProps) {
  const [currentViewport, setCurrentViewport] = useState<"desktop" | "tablet" | "mobile">(viewport)

  const handleViewportChange = (newViewport: "desktop" | "tablet" | "mobile") => {
    setCurrentViewport(newViewport)
    onViewportChange?.(newViewport)
  }

  const viewportConfig = [
    { id: "desktop", label: "Desktop", icon: Monitor },
    { id: "tablet", label: "Tablet", icon: Tablet },
    { id: "mobile", label: "Mobile", icon: Smartphone },
  ]

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 md:px-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 min-w-[140px]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
          ED
        </div>
        <h1 className="text-sm font-semibold text-foreground hidden sm:block">Site Editor</h1>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 bg-muted/50 p-1 rounded-lg border shadow-sm">
        {viewportConfig.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => handleViewportChange(id as "desktop" | "tablet" | "mobile")}
            className={`px-3 py-2 rounded-md transition-all duration-200 text-xs font-medium flex items-center gap-2 ${
              currentViewport === id
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={16} strokeWidth={2} />
            <span className="hidden lg:inline">{label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-2 min-w-[140px] justify-end">
        <Button variant="ghost" size="sm" className="gap-2 text-xs h-9 hidden sm:flex">
          <Eye size={16} strokeWidth={2} />
          <span className="hidden md:inline">Preview</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2 text-xs h-9 hidden sm:flex bg-transparent">
          <Save size={16} strokeWidth={2} />
          <span className="hidden md:inline">Save</span>
        </Button>
        <Button size="sm" className="gap-2 shadow-sm text-xs h-9">
          <Share2 size={16} strokeWidth={2} />
          <span className="hidden md:inline">Publish</span>
        </Button>
      </div>
    </motion.div>
  )
}
