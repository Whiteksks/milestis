"use client"

import { useEffect, useState } from 'react'
import { useUiStore, useContentStore } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

import { HeaderSettings } from '../portfolio/header-settings'
import { HeroSettings } from '../portfolio/hero-settings'
import { BioSettings } from '../portfolio/bio-settings'
import { FeaturedWorkSettings } from '../portfolio/featured-work-settings'
import { VideoSettings } from '../portfolio/video-settings'
import { ContactSettings } from '../portfolio/contact-settings'
import { FooterSettings } from '../portfolio/footer-settings'

import PhotobookCoverSettings from '../photobook/cover-settings'
import PhotobookIntroductionSettings from '../photobook/introduction-settings'
import PhotobookStorySettings from '../photobook/story-settings'
import PhotobookGallerySettings from '../photobook/gallery-settings'
import PhotobookHighlightSettings from '../photobook/highlight-settings'
import PhotobookEndingSettings from '../photobook/ending-settings'

export function SectionsTab() {
  const { editorMode } = useUiStore()
  const {
    sectionVisibility,
    toggleSection,
    photobookSectionVisibility,
    togglePhotobookSection
  } = useContentStore()

  const [activeSection, setActiveSection] = useState(
    editorMode === 'photobook' ? 'cover' : 'hero'
  )
  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)

  const portfolioSections = [
    { id: 'header', name: 'Header', visible: sectionVisibility.showHeader, toggleKey: 'showHeader' },
    { id: 'hero', name: 'Hero Section', visible: sectionVisibility.showHero, toggleKey: 'showHero' },
    { id: 'bio', name: 'Bio / About', visible: sectionVisibility.showBio, toggleKey: 'showBio' },
    { id: 'featuredWork', name: 'Featured Work', visible: sectionVisibility.showFeaturedWork, toggleKey: 'showFeaturedWork' },
    { id: 'video', name: 'Video Section', visible: sectionVisibility.showVideo, toggleKey: 'showVideo' },
    { id: 'contact', name: 'Contact Form', visible: sectionVisibility.showContact, toggleKey: 'showContact' },
    { id: 'footer', name: 'Footer', visible: sectionVisibility.showFooter, toggleKey: 'showFooter' }
  ]

  const photobookSections = [
    { id: 'cover', name: 'Cover', visible: photobookSectionVisibility.showCover, toggleKey: 'showCover' },
    { id: 'introduction', name: 'Introduction', visible: photobookSectionVisibility.showIntroduction, toggleKey: 'showIntroduction' },
    { id: 'story', name: 'Story', visible: photobookSectionVisibility.showStory, toggleKey: 'showStory' },
    { id: 'gallery', name: 'Gallery', visible: photobookSectionVisibility.showGallery, toggleKey: 'showGallery' },
    { id: 'highlight', name: 'Highlight', visible: photobookSectionVisibility.showHighlight, toggleKey: 'showHighlight' },
    { id: 'ending', name: 'Ending', visible: photobookSectionVisibility.showEnding, toggleKey: 'showEnding' }
  ]

  const sections = editorMode === 'portfolio' ? portfolioSections : photobookSections

  useEffect(() => {
    if (editorMode === 'photobook') {
      setActiveSection('cover')
    } else if (editorMode === 'portfolio') {
      setActiveSection('hero')
    }
  }, [editorMode])

  const toggleVisibility = (key: string) => {
    if (editorMode === 'portfolio') {
      toggleSection(key as keyof typeof sectionVisibility)
    } else {
      togglePhotobookSection(key as keyof typeof photobookSectionVisibility)
    }
  }

  const currentSection = sections.find(s => s.id === activeSection)

  const renderSettings = () => {
    if (editorMode === 'photobook') {
      switch (activeSection) {
        case 'cover': return <PhotobookCoverSettings />
        case 'introduction': return <PhotobookIntroductionSettings />
        case 'story': return <PhotobookStorySettings />
        case 'gallery': return <PhotobookGallerySettings />
        case 'highlight': return <PhotobookHighlightSettings />
        case 'ending': return <PhotobookEndingSettings />
        default: return null
      }
    }

    if (editorMode === 'portfolio') {
      switch (activeSection) {
        case 'header': return <HeaderSettings />
        case 'hero': return <HeroSettings />
        case 'bio': return <BioSettings />
        case 'featuredWork': return <FeaturedWorkSettings />
        case 'video': return <VideoSettings />
        case 'contact': return <ContactSettings />
        case 'footer': return <FooterSettings />
        default: return null
      }
    }

    return null
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
