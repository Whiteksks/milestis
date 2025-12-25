'use client'

import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

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

  useEffect(() => {
    setActiveSection(defaultActiveSectionId)
  }, [editorMode, defaultActiveSectionId])

  const currentSection = sections.find(s => s.id === activeSection)

  const renderSettings = () => {
    const SettingsComponent = getSettingsComponent(activeSection)
    if (!SettingsComponent) return null
    return <SettingsComponent />
  }

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pb-3 border-b border-slate-200">
        <Label className="text-xs font-medium text-slate-500 mb-2 block uppercase tracking-wide">
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
              "bg-white shadow-md",
              "border border-slate-200",
              "rounded-md",
            )}
          >
            <div className="space-y-1">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm text-left hover:bg-slate-50 cursor-pointer",
                    activeSection === section.id && "bg-slate-100",
                    !section.visible && "text-slate-400"
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
                      "ml-2 rounded-md p-1 transition-colors flex items-center justify-center",
                      section.visible
                        ? "bg-slate-100 hover:bg-slate-200"
                        : "bg-slate-50 hover:bg-slate-100"
                    )}
                  >
                    {section.visible ? (
                      <Eye className="w-3.5 h-4 text-slate-700" />
                    ) : (
                      <EyeOff className="w-3.5 h-4 text-slate-400" />
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
              "px-3 rounded-md border transition-colors",
              currentSection?.visible
                ? "border-slate-300 bg-white hover:bg-slate-50"
                : "border-slate-300 bg-slate-100 hover:bg-slate-200"
            )}
          >
            {currentSection?.visible ? (
              <Eye className="w-4 h-4 text-slate-700" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-400" />
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
