"use client"

import { useMemo, useState } from "react"

import { useModeSections } from "@/editor/hooks/use-mode-sections"
import { useUiSelector } from "@/editor/lib/store"
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"

import { Eye, EyeOff } from "lucide-react"
import { getSectionQuickActions } from "@/editor/components/editor/section-settings/quick-actions/section-quick-actions"

export function SectionsToolbarPanel() {
  const { editorMode, sections, toggleVisibility, resolvedActiveSectionId, setActiveSectionId } = useModeSections()
  const { isMediaPickerOpen } = useUiSelector((state) => ({
    isMediaPickerOpen: state.isMediaPickerOpen,
  }))

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
    <div className="h-10 px-1 flex items-center gap-1">
      {/* Show/hide current section */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full"
        title={currentSection?.visible ? "Hide section" : "Show section"}
        onClick={() => currentSection && toggleVisibility(currentSection.toggleKey)}
      >
        {currentSection?.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
      </Button>

      {/* Section picker */}
      <Popover open={isSectionPopoverOpen} onOpenChange={setIsSectionPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 px-2 rounded-full",
              "text-xs font-medium",
              "hover:bg-black/5",
            )}
          >
            <span className="max-w-30 truncate">{currentSection?.name ?? "Sections"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" sideOffset={8} align="start" className="w-64 p-2 rounded-xl">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={cn(
                  "w-full flex items-center rounded-lg px-2 py-1.5 text-sm",
                  "hover:bg-muted/50",
                  resolvedActiveSectionId === section.id && "bg-muted",
                  !section.visible && "opacity-60",
                )}
                onClick={() => {
                  setActiveSectionId(section.id)
                  setIsSectionPopoverOpen(false)
                  setActiveQuickActionId(null)
                }}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span
                    className={cn(
                      "rounded-lg p-1.5",
                      section.visible ? "text-muted-foreground" : "text-muted-foreground/50",
                    )}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleVisibility(section.toggleKey)
                    }}
                  >
                    {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </span>
                  <span className="truncate">{section.name}</span>
                </span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Section quick actions (registry-driven) */}
      {quickActions.length > 0 && (
        <div className="flex items-center gap-1">
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
                  className="h-8 w-8 rounded-full"
                  title={action.title}
                >
                  <action.Icon className="w-4 h-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="top" sideOffset={8} align="start" className="w-80 p-3 rounded-xl">
                <action.Panel dense />
              </PopoverContent>
            </Popover>
          ))}
        </div>
      )}
    </div>
  )
}
