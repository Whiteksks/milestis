"use client"

import { useTranslations } from 'next-intl'
import { cn } from "@/lib/utils"

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { Eye, EyeOff, ChevronDown } from "lucide-react"
import { useSectionsToolbar } from "@/editor/hooks/use-sections-toolbar"

export function SectionsToolbarPanel() {
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

  const isOpen = isQuickActionOpen

  return (
    <div className="h-10 px-1 flex items-center gap-0">
      {/* Show/hide current section */}
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        title={currentSection?.visible ? t('hideSection') : t('showSection')}
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
            <span className="max-w-28 truncate">{currentSection?.name ?? t('allSections')}</span>
            <ChevronDown className="w-3 h-3 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="top" sideOffset={8} align="start" className="w-56 p-2 rounded-2xl border-border/60 shadow-lg m-1">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0 mr-1.5 rounded-md text-muted-foreground hover:text-foreground shrink-0"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleVisibility(section.toggleKey)
                  }}
                >
                  {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </Button>
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
                <PopoverContent side="top" sideOffset={8} align="center" className="w-80 p-4 rounded-2xl border-border/60 shadow-lg m-1">
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
