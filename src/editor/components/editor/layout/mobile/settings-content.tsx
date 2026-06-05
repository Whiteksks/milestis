'use client'

import { useState, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

export function SettingsContent() {
  const t = useTranslations('editor.layout')
  const { 
    sections, 
    toggleVisibility, 
    getSettingsComponent,
    resolvedActiveSectionId,
    setActiveSectionId,
  } = useModeSections()
  const [isOpen, setIsOpen] = useState(false)

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
    <div className='p-2'>
      {sections.length > 0 && (
        <header className="sticky top-2 z-10 px-4 p-1 border-b border-border/40 bg-card/95 backdrop-blur-sm border rounded-sm">
          <div className="flex items-end justify-between gap-4">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <button className="group flex flex-col items-start outline-none transition-all min-w-0">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mb-1 font-medium">
                    {t('sections.activeLayer')}
                  </span>
                  <div className="flex items-center gap-2 border-b border-foreground/10 group-hover:border-foreground/40 pb-1 transition-colors max-w-full min-w-40">
                    <span className={cn(
                      "text-base font-medium tracking-tight transition-opacity truncate",
                      !currentSection?.visible && "opacity-40"
                    )}>
                      {currentSection?.name ?? t('sections.selectLayer')}
                    </span>
                    <ChevronDown className={cn(
                      "h-3.5 w-3.5 shrink-0 text-muted-foreground ml-auto transition-transform duration-200",
                      isOpen && "rotate-180"
                    )} />
                  </div>
                </button>
              </PopoverTrigger>

              <PopoverContent
                className="w-64 p-2 rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl"
                align="start"
                sideOffset={12}
              >
                <div className="px-3 py-2 mb-1">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50 font-semibold">
                    {t('sections.projectLayers')}
                  </span>
                </div>

                <div className="space-y-0.5">
                  {sections.map((section, index) => {
                    const isActive = resolvedActiveSectionId === section.id
                    return (
                      <div
                        key={section.id}
                        className={cn(
                          'group flex items-center justify-between rounded-xl transition-colors pl-3 pr-1.5 py-0.5',
                          isActive
                            ? 'bg-foreground text-background'
                            : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        )}
                      >
                        <div
                          className="flex flex-1 items-center gap-3 py-2 cursor-pointer min-w-0"
                          onClick={() => {
                            setActiveSectionId(section.id)
                            setIsOpen(false)
                          }}
                        >
                          <span className={cn(
                            "text-[9px] font-mono tabular-nums opacity-40",
                            isActive ? "text-background" : "text-foreground"
                          )}>
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <span className="text-[13px] font-medium truncate tracking-tight">
                            {section.name}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleVisibility(section.toggleKey)
                          }}
                          className={cn(
                            "h-8 w-8 rounded-lg transition-colors",
                            isActive
                              ? "hover:bg-background/10 text-background/40 hover:text-background"
                              : "hover:bg-background text-muted-foreground/40 hover:text-foreground"
                          )}
                        >
                          {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => currentSection && toggleVisibility(currentSection.toggleKey)}
              className={cn(
                "h-10 w-10 rounded-full border shrink-0 transition-colors",
                !currentSection?.visible
                  ? "bg-muted/50 border-transparent text-muted-foreground/40"
                  : "border-border/40 text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {currentSection?.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </Button>
          </div>
        </header>
      )}

      <div>
        {renderSettings()}
      </div>
    </div>
  )
}

