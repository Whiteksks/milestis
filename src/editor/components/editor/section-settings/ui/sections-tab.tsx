"use client"

import { useState, useMemo } from 'react'
import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SectionsTab() {
  const { 
    sections, 
    toggleVisibility, 
    getSettingsComponent, 
    resolvedActiveSectionId, 
    setActiveSectionId 
  } = useModeSections()

  const [isOpen, setIsOpen] = useState(false)

  const currentSection = useMemo(
    () => sections.find((s) => s.id === resolvedActiveSectionId),
    [resolvedActiveSectionId, sections],
  )

  return (
    // ФИКС 1: h-full + min-h-0 обязательны для работы вложенного скролла в flex-контейнере
    <div className="flex flex-col h-full min-h-0 bg-transparent">
      {sections.length > 0 && (
        // ФИКС 2: shrink-0 гарантирует, что шапка не сожмется, когда контента много
        <header className="shrink-0 px-6 py-4 border-b border-border/40 bg-card/30 backdrop-blur-md">
          <div className="flex items-end justify-between gap-4">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="group flex flex-col items-start outline-none transition-all min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 font-medium">
                    Active Layer
                  </span>
                  <div className="flex items-center gap-2 border-b border-foreground/10 group-hover:border-foreground/40 pb-1 transition-all max-w-full">
                    <span className={cn(
                      "text-lg font-medium tracking-tight transition-opacity truncate",
                      !currentSection?.visible && "opacity-40"
                    )}>
                      {currentSection?.name ?? 'Select...'}
                    </span>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </button>
              </PopoverTrigger>

              <PopoverContent 
                className="w-72 p-1.5 rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl" 
                align="start"
                sideOffset={12}
              >
                <div className="space-y-0.5">
                  {sections.map(section => (
                    <div
                      key={section.id}
                      className={cn(
                        'group flex items-center justify-between rounded-xl transition-all pl-3 pr-1 py-1',
                        resolvedActiveSectionId === section.id 
                          ? 'bg-foreground text-background font-medium' 
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <span 
                        className="flex-1 py-2 text-[13px] cursor-pointer truncate"
                        onClick={() => {
                          setActiveSectionId(section.id)
                          setIsOpen(false)
                        }}
                      >
                        {section.name}
                      </span>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleVisibility(section.toggleKey)
                        }}
                        className={cn(
                          "h-8 w-8 rounded-lg transition-colors",
                          resolvedActiveSectionId === section.id
                            ? "hover:bg-background/10 text-background/60 hover:text-background"
                            : "hover:bg-background text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 opacity-40" />}
                      </Button>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => currentSection && toggleVisibility(currentSection.toggleKey)}
              className={cn(
                "h-11 w-11 rounded-full border shrink-0 transition-all",
                !currentSection?.visible 
                  ? "bg-muted/50 border-transparent text-muted-foreground/40" 
                  : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {currentSection?.visible ? <Eye className="w-[18px]" /> : <EyeOff className="w-[18px]" />}
            </Button>
          </div>
        </header>
      )}

      {/* ФИКС 3: overflow-hidden на ScrollArea и w-full позволяют Textarea правильно считать ширину */}
      <ScrollArea className="flex-1 overflow-hidden">
        <div className={cn(
          "p-6 w-full transition-all duration-300 ease-in-out",
          !currentSection?.visible && "opacity-10 blur-sm pointer-events-none grayscale select-none"
        )}>
          {(() => {
             const Settings = getSettingsComponent(resolvedActiveSectionId);
             return Settings ? <Settings /> : null;
          })()}
        </div>
      </ScrollArea>
    </div>
  )
}