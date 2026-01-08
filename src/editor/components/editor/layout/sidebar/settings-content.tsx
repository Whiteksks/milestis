'use client'

import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

export function SettingsContent() {
  const { 
    editorMode, 
    sections, 
    toggleVisibility, 
    defaultActiveSectionId, 
    getSettingsComponent 
  } = useModeSections()

  const [activeSection, setActiveSection] = useState<string>(defaultActiveSectionId)
  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)

  const resolvedActiveSection = useMemo(() => {
    const hasActive = sections.some((s) => s.id === activeSection)
    return hasActive ? activeSection : defaultActiveSectionId
  }, [activeSection, defaultActiveSectionId, sections])

  const currentSection = sections.find(s => s.id === resolvedActiveSection)

  const renderSettings = () => {
    const SettingsComponent = getSettingsComponent(resolvedActiveSection)
    if (!SettingsComponent) return null
    return <SettingsComponent />
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-3 border-b border-border/40">
        <Label className="text-xs font-medium text-muted-foreground mb-2 block">
          Edit Section
        </Label>
        <div className="flex gap-2">
          <Popover open={isSectionPopoverOpen} onOpenChange={setIsSectionPopoverOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="justify-between flex-1"
              >
                <span className="truncate">
                  {currentSection?.name ?? 'Select section'}
                </span>
                <SlidersHorizontal className="ml-2 h-4 w-4 opacity-60" />
              </Button>
            </PopoverTrigger>

          <PopoverContent
            align="start"
            className={cn(
              "w-64 mt-2",
              "bg-background shadow-md",
              "border border-border",
              "rounded-xl",
            )}
          >
            <div className="space-y-1">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm text-left hover:bg-muted/50 cursor-pointer",
                    resolvedActiveSection === section.id && "bg-muted",
                    !section.visible && "text-muted-foreground"
                  )}
                  onClick={() => {
                    setActiveSection(section.id)
                    setIsSectionPopoverOpen(false)
                  }}
                >
                  <span className="truncate">{section.name}</span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleVisibility(section.toggleKey)
                    }}
                    className={cn(
                      "ml-2 rounded-lg p-1 transition-colors flex items-center justify-center",
                      section.visible
                        ? "bg-muted hover:bg-muted/80"
                        : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    {section.visible ? (
                      <Eye className="w-3.5 h-4 text-foreground" />
                    ) : (
                      <EyeOff className="w-3.5 h-4 text-muted-foreground" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>

          <button
            onClick={() => currentSection && toggleVisibility(currentSection.toggleKey)}
            className={cn(
              "px-3 rounded-xl border transition-colors",
              currentSection?.visible
                ? "border-border bg-background hover:bg-muted/50"
                : "border-border bg-muted hover:bg-muted/80"
            )}
          >
            {currentSection?.visible ? (
              <Eye className="w-4 h-4 text-foreground" />
            ) : (
              <EyeOff className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      <div>
        {renderSettings()}
      </div>
    </div>
  )
}
