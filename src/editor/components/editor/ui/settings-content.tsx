'use client'

import { useContentStore, useUiStore } from '@/editor/lib/store'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'

import { HeaderSettings } from '../section-settings/portfolio/header-settings'
import { HeroSettings } from '../section-settings/portfolio/hero-settings'
import { BioSettings } from '../section-settings/portfolio/bio-settings'
import { FeaturedWorkSettings } from '../section-settings/portfolio/featured-work-settings'
import { VideoSettings } from '../section-settings/portfolio/video-settings'
import { ContactSettings } from '../section-settings/portfolio/contact-settings'
import { FooterSettings } from '../section-settings/portfolio/footer-settings'

import PhotobookCoverSettings from '../section-settings/photobook/cover-settings'
import PhotobookIntroductionSettings from '../section-settings/photobook/introduction-settings'
import PhotobookStorySettings from '../section-settings/photobook/story-settings'
import PhotobookGallerySettings from '../section-settings/photobook/gallery-settings'
import PhotobookHighlightSettings from '../section-settings/photobook/highlight-settings'
import PhotobookEndingSettings from '../section-settings/photobook/ending-settings'

import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'

export function SettingsContent() {
  const { editorMode } = useUiStore()
  const { 
    sectionVisibility, 
    toggleSection,
    photobookSectionVisibility,
    togglePhotobookSection
  } = useContentStore()
  
  const [activeSection, setActiveSection] = useState<string>(
    editorMode === 'photobook' ? 'cover' : 'hero'
  )
  const [isSectionPopoverOpen, setIsSectionPopoverOpen] = useState(false)

  useEffect(() => {
    if (editorMode === 'photobook') {
      setActiveSection('cover')
    } else {
      setActiveSection('hero')
    }
  }, [editorMode])

  const portfolioSections = [
    { id: 'header', name: 'Header', visible: sectionVisibility.showHeader, toggleKey: 'showHeader' },
    { id: 'hero', name: 'Hero Section', visible: sectionVisibility.showHero, toggleKey: 'showHero' },
    { id: 'bio', name: 'Bio / About', visible: sectionVisibility.showBio, toggleKey: 'showBio' },
    { id: 'featuredWork', name: 'Featured Work', visible: sectionVisibility.showFeaturedWork, toggleKey: 'showFeaturedWork' },
    { id: 'video', name: 'Video Section', visible: sectionVisibility.showVideo, toggleKey: 'showVideo' },
    { id: 'contact', name: 'Contact Form', visible: sectionVisibility.showContact, toggleKey: 'showContact' },
    { id: 'footer', name: 'Footer', visible: sectionVisibility.showFooter, toggleKey: 'showFooter' },
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
  const currentSection = sections.find(s => s.id === activeSection)

  const toggleVisibility = (key: string) => {
    if (editorMode === 'portfolio') {
      toggleSection(key as keyof typeof sectionVisibility)
    } else {
      togglePhotobookSection(key as keyof typeof photobookSectionVisibility)
    }
  }

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
