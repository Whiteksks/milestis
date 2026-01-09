"use client"

import { useState } from 'react'
import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'

export function SectionsTab() {
  const { editorMode, sections, toggleVisibility, getSettingsComponent, resolvedActiveSectionId, setActiveSectionId } =
    useModeSections()

  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)

  const currentSection = useMemo(
    () => sections.find((s) => s.id === resolvedActiveSectionId),
    [resolvedActiveSectionId, sections],
  )

  const renderSettings = () => {
    const SettingsComponent = getSettingsComponent(resolvedActiveSectionId)
    if (!SettingsComponent) return null
    return <SettingsComponent />
  }

  return (
    <>
      {sections.length > 0 && (
        <div className="border-b border-border/40 p-6 space-y-4 bg-background/50">
          <div>
            <Label className="text-xs font-medium text-muted-foreground mb-2 block">
              Current Section
            </Label>

            <div className="flex gap-2">
              <Popover open={isSectionPopoverOpen} onOpenChange={setIsSectionPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-9/10 justify-between rounded-xl border-border hover:border-border hover:bg-muted/50 h-11 text-foreground"
                  >
                    <span className="truncate font-medium">{currentSection?.name ?? 'Select section'}</span>
                    <SlidersHorizontal className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-70 p-2 rounded-xl border-border shadow-lg" align="start">
                  <div className="space-y-1">
                    {sections.map(section => (
                      <div
                        key={section.id}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors',
                          resolvedActiveSectionId === section.id 
                            ? 'bg-muted text-foreground font-medium' 
                            : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                          !section.visible && 'opacity-60'
                        )}
                        onClick={() => {
                          setActiveSectionId(section.id)
                          setIsSectionPopoverOpen(false)
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation()
                              toggleVisibility(section.toggleKey)
                            }}
                            className={cn(
                              'rounded-lg p-1.5 transition-all flex items-center justify-center',
                              section.visible
                                ? 'text-muted-foreground hover:text-foreground hover:bg-background hover:shadow-sm'
                                : 'text-muted-foreground/50 hover:text-muted-foreground'
                            )}
                          >
                            {section.visible ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="truncate">{section.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              <button
                onClick={() =>
                  currentSection && toggleVisibility(currentSection.toggleKey)
                }
                className={cn(
                  'px-3.5 rounded-xl border transition-all h-11 flex items-center justify-center',
                  currentSection?.visible
                    ? 'border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    : 'border-border bg-muted text-muted-foreground hover:bg-muted/80'
                )}
                title={currentSection?.visible ? "Hide Section" : "Show Section"}
              >
                {currentSection?.visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-0">{renderSettings()}</div>
      </ScrollArea>
    </>
  )
}
