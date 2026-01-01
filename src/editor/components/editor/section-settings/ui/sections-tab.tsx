"use client"

import { useEffect, useState } from 'react'
import { useContentSelector, useUiSelector } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/mode-registry'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useMemo, useCallback } from 'react'

export function SectionsTab() {
  const editorMode = useUiSelector((state) => state.editorMode)
  const {
    sectionVisibility,
    toggleSection,
    photobookSectionVisibility,
    togglePhotobookSection,
  } = useContentSelector((state) => ({
    sectionVisibility: state.sectionVisibility,
    toggleSection: state.toggleSection,
    photobookSectionVisibility: state.photobookSectionVisibility,
    togglePhotobookSection: state.togglePhotobookSection,
  }))

  const modeEntry = useMemo(() => MODE_REGISTRY[editorMode], [editorMode])

  const [activeSection, setActiveSection] = useState(modeEntry.defaultActiveSectionId)
  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)

  const sections = useMemo(
    () =>
      modeEntry.sections.map((section) => ({
        ...section,
        visible: modeEntry.getSectionVisible({
          section,
          portfolioVisibility: sectionVisibility,
          photobookVisibility: photobookSectionVisibility,
        }),
      })),
    [modeEntry, sectionVisibility, photobookSectionVisibility],
  )

  useEffect(() => {
    setActiveSection(MODE_REGISTRY[editorMode].defaultActiveSectionId)
  }, [editorMode])

  const toggleVisibility = useCallback(
    (key: string) => {
      modeEntry.toggleSection({
        toggleKey: key,
        portfolioVisibility: sectionVisibility,
        photobookVisibility: photobookSectionVisibility,
        togglePortfolio: toggleSection,
        togglePhotobook: togglePhotobookSection,
      })
    },
    [modeEntry, sectionVisibility, photobookSectionVisibility, toggleSection, togglePhotobookSection],
  )

  const currentSection = sections.find(s => s.id === activeSection)

  const renderSettings = () => {
    const SettingsComponent = modeEntry.getSettingsComponent(activeSection)
    if (!SettingsComponent) return null
    return <SettingsComponent />
  }

  return (
    <>
      {sections.length > 0 && (
        <div className="border-b border-slate-100 p-6 space-y-4 bg-white/50">
          <div>
            <Label className="text-[10px] font-semibold text-slate-400 mb-2 block uppercase tracking-wider">
              Current Section
            </Label>

            <div className="flex gap-2">
              <Popover open={isSectionPopoverOpen} onOpenChange={setIsSectionPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-9/10 justify-between rounded-xl border-slate-200 hover:border-slate-300 hover:bg-white h-11 shadow-sm text-slate-700"
                  >
                    <span className="truncate font-medium">{currentSection?.name ?? 'Select section'}</span>
                    <SlidersHorizontal className="ml-2 h-4 w-4 text-slate-400" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-70 p-2 rounded-xl border-slate-100 shadow-xl shadow-slate-900/5" align="start">
                  <div className="space-y-1">
                    {sections.map(section => (
                      <div
                        key={section.id}
                        className={cn(
                          'flex items-center justify-between rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors',
                          activeSection === section.id 
                            ? 'bg-slate-100 text-slate-900 font-medium' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                          !section.visible && 'opacity-60'
                        )}
                        onClick={() => {
                          setActiveSection(section.id)
                          setIsSectionPopoverOpen(false)
                        }}
                      >
                        <span className="truncate">{section.name}</span>

                        <button
                          type="button"
                          onClick={e => {
                            e.stopPropagation()
                            toggleVisibility(section.toggleKey)
                          }}
                          className={cn(
                            'ml-2 rounded-md p-1.5 transition-all flex items-center justify-center',
                            section.visible
                              ? 'text-slate-400 hover:text-slate-900 hover:bg-white hover:shadow-sm'
                              : 'text-slate-300 hover:text-slate-500'
                          )}
                        >
                          {section.visible ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
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
                    ? 'border-slate-200 bg-white text-slate-500 hover:text-slate-900 hover:border-slate-300 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
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
