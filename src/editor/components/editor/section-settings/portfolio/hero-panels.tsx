"use client"

import { useId } from "react"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker, createPortfolioSectionImage, replacePortfolioManagedImageAsset, type ImageValue } from "@/editor/image"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { LIMITS, editorialInput, editorialLabel, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function HeroTitlePanel() {
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))

 return (
    <div className="py-2">
      {/* grid-cols-2: делит ровно 50/50.
        divide-x: создает вертикальную линию ровно по центру.
        gap-0: убираем стандартный отступ, чтобы использовать паддинги для симметрии.
      */}
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-6">
        
        {/* Левая колонка */}
        <div className="space-y-1 pr-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Headline</label>
            <CharCounter value={hero.title} limit={LIMITS.title} />
          </div>
          <Input
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            value={hero.title}
            onChange={(e) => updateSectionContent("hero", { title: e.target.value })}
            placeholder="Main title"
            maxLength={LIMITS.title}
          />
        </div>

        {/* Правая колонка — теперь идентична левой */}
        <div className="space-y-1 pl-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Subheadline</label>
            <CharCounter value={hero.subtitle} limit={LIMITS.subtitle} />
          </div>
          <Input
            className={cn(editorialInput, "text-base text-muted-foreground")}
            value={hero.subtitle}
            onChange={(e) => updateSectionContent("hero", { subtitle: e.target.value })}
            placeholder="Subtitle text"
            maxLength={LIMITS.subtitle}
          />
        </div>
        
      </div>
    </div>
  )
}

export function HeroDescriptionPanel() {
  const { hero, updateSectionContent } = useContentSelector((state) => ({
    hero: state.sectionContent.hero,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="py-6 border-b border-border/30 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <label className={editorialLabel}>Narrative / Description</label>
        <CharCounter value={hero.description} limit={LIMITS.description} />
      </div>
      <Textarea
        className={cn(
          editorialInput,
          "text-base leading-relaxed min-h-[120px] w-full max-w-full resize-none block overflow-x-hidden"
        )}
        value={hero.description}
        onChange={(e) => updateSectionContent("hero", { description: e.target.value })}
        placeholder="Start writing the story..."
        maxLength={LIMITS.description}
      />
    </div>
  )
}

export function HeroImagePanel() {
  const ownerId = useId()
  const { heroImage, setPortfolioSingleImage } = useContentSelector((state) => ({
    heroImage: state.portfolioImageContent.hero,
    setPortfolioSingleImage: state.setPortfolioSingleImage,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)

  const emptyValue: ImageValue = {
    asset: { src: "", width: 0, height: 0 },
  }
  const pickerValue = heroImage?.value ?? emptyValue

  return (
    <div className="py-6 space-y-4">
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url, thumbUrl) => {
          if (heroImage) {
            setPortfolioSingleImage("hero", replacePortfolioManagedImageAsset(heroImage, { src: url, blurDataUrl: thumbUrl }))
          } else {
            setPortfolioSingleImage("hero", createPortfolioSectionImage({ id: "hero-primary", sectionId: "hero", src: url, blurDataUrl: thumbUrl }))
          }
        }}
      />

      <div className="flex items-baseline justify-between">
        <label className={editorialLabel}>Visual Frame</label>
        <button
          onClick={() => openMediaPicker(ownerId)}
          className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground/30 pb-0.5"
        >
          Replace Media
        </button>
      </div>

      <div className="relative group transition-all duration-500">
        <div className="absolute -inset-2 rounded-[2rem] bg-muted/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
        <ImagePicker
          label=""
          slotId="portfolio.hero.primary"
          value={pickerValue}
          onChange={(next) => {
            if (!next.asset.src) {
              setPortfolioSingleImage("hero", undefined)
              return
            }
            if (heroImage) {
              setPortfolioSingleImage("hero", { ...heroImage, value: next })
            }
          }}
          onOpenMediaPicker={() => openMediaPicker(ownerId)}
          showCaption={false}
        />
      </div>
    </div>
  )
}