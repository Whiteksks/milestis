"use client"

import { useMemo, useState } from "react"

import { useModeSections } from "@/editor/hooks/use-mode-sections"
import { useUiStore } from "@/editor/lib/store"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Eye, EyeOff, ChevronDown } from "lucide-react"
import { getSectionQuickActions } from "@/editor/components/editor/section-settings/quick-actions/section-quick-actions"

export function SectionsToolbarPanel() {
  const { editorMode, sections, toggleVisibility, resolvedActiveSectionId, setActiveSectionId } = useModeSections()
  const isMediaPickerOpen = useUiStore((s) => s.isMediaPickerOpen)

  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)
  const [activeQuickActionId, setActiveQuickActionId] = useState<string | null>(null)

  const currentSection = useMemo(
    () => sections.find((s) => s.id === resolvedActiveSectionId),
    [resolvedActiveSectionId, sections],
  )

  const quickActions = useMemo(
    () => getSectionQuickActions(editorMode, resolvedActiveSectionId),
    [editorMode, resolvedActiveSectionId],
  )

  const isOpen = (id: string) => activeQuickActionId === id

  return (
    <div className="h-10 px-1 flex items-center gap-0">
      {/* Show/hide current section */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title={currentSection?.visible ? "Hide section" : "Show section"}
        onClick={() => currentSection && toggleVisibility(currentSection.toggleKey)}
      >
        {currentSection?.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
      </Button>

      {/* Section picker */}
      <Popover open={isSectionPopoverOpen} onOpenChange={setIsSectionPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors gap-1"
          >
            <span className="max-w-28 truncate">{currentSection?.name ?? "Sections"}</span>
            <ChevronDown className="w-3 h-3 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" sideOffset={8} align="start" className="w-56 p-2 rounded-2xl border-border/60 shadow-lg">
          <div className="space-y-0.5">
            {sections.map((section) => (
              <div
                key={section.id}
                role="button"
                tabIndex={0}
                className={cn(
                  "w-full flex items-center rounded-xl px-2 py-1.5 text-xs transition-colors cursor-pointer",
                  "hover:bg-muted/60",
                  resolvedActiveSectionId === section.id
                    ? "bg-muted text-foreground font-medium"
                    : "text-muted-foreground",
                  !section.visible && "opacity-50",
                )}
                onClick={() => {
                  setActiveSectionId(section.id)
                  setIsSectionPopoverOpen(false)
                  setActiveQuickActionId(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault()
                    setActiveSectionId(section.id)
                    setIsSectionPopoverOpen(false)
                    setActiveQuickActionId(null)
                  }
                }}
              >
                <button
                  type="button"
                  className="p-1 mr-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleVisibility(section.toggleKey)
                  }}
                >
                  {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <span className="truncate">{section.name}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Section quick actions (registry-driven) */}
      {quickActions.length > 0 && (
        <>
          <Separator orientation="vertical" className="mx-1.5 h-4 bg-border/60" />
          <div className="flex items-center gap-0">
            {quickActions.map((action) => (
              <Popover
                key={action.id}
                open={isOpen(action.id)}
                onOpenChange={(open) => {
                  if (!open && isMediaPickerOpen) return
                  setActiveQuickActionId(open ? action.id : null)
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    title={action.title}
                  >
                    <action.Icon className="w-3.5 h-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent side="top" sideOffset={8} align="start" className="w-80 p-4 rounded-2xl border-border/60 shadow-lg">
                  <action.Panel dense />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
