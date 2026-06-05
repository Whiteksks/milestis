"use client"

import { useTranslations } from 'next-intl'
import { Eye, EyeOff, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useSectionsToolbar } from "@/editor/hooks/use-sections-toolbar"

/**
 * Mobile sheet snap-2 quick-actions for the Sections tab.
 * Same logic as SectionsToolbarPanel — only the container/sizing differs
 * to be touch-friendly inside the bottom sheet.
 */
export function SectionsSheetActions() {
  const t = useTranslations('editor.controls.sections')
  const {
    sections,
    resolvedActiveSectionId,
    currentSection,
    quickActions,
    isSectionPopoverOpen,
    setIsSectionPopoverOpen,
    setActiveQuickActionId,
    isQuickActionOpen,
    isMediaPickerOpen,
    toggleVisibility,
    setActiveSectionId,
  } = useSectionsToolbar()

  return (
    <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto no-scrollbar">

      {/* Visibility toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title={currentSection?.visible ? t('hideSection') : t('showSection')}
        onClick={() => currentSection && toggleVisibility(currentSection.toggleKey)}
      >
        {currentSection?.visible
          ? <Eye className="w-4 h-4" />
          : <EyeOff className="w-4 h-4" />}
      </Button>

      {/* Section picker */}
      <Popover open={isSectionPopoverOpen} onOpenChange={setIsSectionPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-10 px-3 rounded-xl text-sm font-medium gap-1.5 border-border/60 shrink-0 max-w-44"
          >
            <span className="truncate">{currentSection?.name ?? t('allSections')}</span>
            <ChevronDown className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          side="top"
          sideOffset={8}
          align="start"
          className="w-60 p-2 rounded-2xl border-border/60 shadow-lg"
        >
          <div className="space-y-0.5">
            {sections.map((section) => (
              <div
                key={section.id}
                role="button"
                tabIndex={0}
                className={cn(
                  "w-full flex items-center rounded-xl px-2 py-2 text-sm transition-colors cursor-pointer",
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 p-0 mr-2 rounded-lg text-muted-foreground hover:text-foreground shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleVisibility(section.toggleKey)
                  }}
                >
                  {section.visible
                    ? <Eye className="w-3.5 h-3.5" />
                    : <EyeOff className="w-3.5 h-3.5" />}
                </Button>
                <span className="truncate">{section.name}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Quick actions */}
      {quickActions.length > 0 && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-5 bg-border/60 shrink-0" />
          <div className="flex items-center gap-1">
            {quickActions.map((action) => (
              <Popover
                key={action.id}
                open={isQuickActionOpen(action.id)}
                onOpenChange={(open) => {
                  if (!open && isMediaPickerOpen) return
                  setActiveQuickActionId(open ? action.id : null)
                }}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                    title={action.title}
                  >
                    <action.Icon className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  sideOffset={8}
                  align="center"
                  className="w-80 p-4 rounded-2xl border-border/60 shadow-lg m-1"
                >
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
