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
      className="h-14 border-b border-border bg-card flex items-center justify-between px-6"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-semibold text-xs">
          ED
        </div>
        <h1 className="text-sm font-semibold text-foreground">Site Editor</h1>
      </div>

      <div className="hidden md:flex items-center gap-1 bg-muted p-1 rounded-lg">
        {viewportConfig.map(({ id, label, icon: Icon }) => (
          <motion.button
            key={id}
            onClick={() => handleViewportChange(id as "desktop" | "tablet" | "mobile")}
            className={`p-2 rounded transition-colors text-xs flex items-center gap-1 ${
              currentViewport === id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={14} strokeWidth={1.5} />
            <span className="hidden sm:inline">{label}</span>
          </motion.button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent text-xs h-8">
          <Eye size={14} strokeWidth={1.5} />
          Preview
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5 bg-transparent text-xs h-8">
          <Save size={14} strokeWidth={1.5} />
          Save
        </Button>
        <Button size="sm" className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-8">
          <Share2 size={14} strokeWidth={1.5} />
          Publish
        </Button>
      </div>
    </motion.div>
  )
}
