"use client"

import { useId } from "react"
import { MediaPickerModal } from "@/editor/components/editor/layout/Modals/media-picker-modal"
import { ImagePicker, createPortfolioSectionImage, replacePortfolioManagedImageAsset, type ImageValue } from "@/editor/image"
import { useContentSelector, useUiStore } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Trophy } from "lucide-react"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { ps, LIMITS, editorialInput, editorialLabel, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function BioTitlePanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.portfolioSettings.bio")
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <div className={ps.grid2(true)}>
          <Input className={ps.input} value={bio.title} onChange={(e) => updateSectionContent("bio", { title: e.target.value })} placeholder={t("sectionTitle")} maxLength={LIMITS.title} />
          <Input className={ps.input} value={bio.subtitle || ""} onChange={(e) => updateSectionContent("bio", { subtitle: e.target.value })} placeholder={t("subtitle")} maxLength={LIMITS.subtitle} />
        </div>
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-6">
        <div className="space-y-1 pr-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>{t("title")}</label>
            <CharCounter value={bio.title} limit={LIMITS.title} />
          </div>
          <Input
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            value={bio.title}
            onChange={(e) => updateSectionContent("bio", { title: e.target.value })}
            placeholder={t("about")}
            maxLength={LIMITS.title}
          />
        </div>
        <div className="space-y-1 pl-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>{t("subtitle")}</label>
            <CharCounter value={bio.subtitle || ""} limit={LIMITS.subtitle} />
          </div>
          <Input
            className={cn(editorialInput, "text-base text-muted-foreground")}
            value={bio.subtitle || ""}
            onChange={(e) => updateSectionContent("bio", { subtitle: e.target.value })}
            placeholder={t("whoYouAre")}
            maxLength={LIMITS.subtitle}
          />
        </div>
      </div>
    </div>
  )
}

export function BioPhotoPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.portfolioSettings.bio")
  const ownerId = useId()
  const { bioImage, setPortfolioSingleImage } = useContentSelector((state) => ({
    bioImage: state.portfolioImageContent.bio,
    setPortfolioSingleImage: state.setPortfolioSingleImage,
  }))
  const openMediaPicker = useUiStore((s) => s.openMediaPicker)
  const emptyValue: ImageValue = {
    asset: { src: "", width: 0, height: 0 },
  }
  const pickerValue = bioImage?.value ?? emptyValue

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <MediaPickerModal
          ownerId={ownerId}
          onSelectImage={(url, thumbUrl) => {
            if (bioImage) {
              setPortfolioSingleImage("bio", replacePortfolioManagedImageAsset(bioImage, { src: url, blurDataUrl: thumbUrl }))
            } else {
              setPortfolioSingleImage("bio", createPortfolioSectionImage({ id: "bio-primary", sectionId: "bio", src: url, blurDataUrl: thumbUrl }))
            }
          }}
        />
        <ImagePicker
          slotId="portfolio.bio.primary"
          value={pickerValue}
          onChange={(next) => {
            if (!next.asset.src) {
              setPortfolioSingleImage("bio", undefined)
              return
            }
            if (bioImage) {
              setPortfolioSingleImage("bio", { ...bioImage, value: next })
            }
          }}
          onOpenMediaPicker={() => openMediaPicker(ownerId)}
          dense
          showCaption={false}
        />
      </div>
    )
  }

  return (
    <div className="py-6 border-b border-border/30 space-y-4">
      <MediaPickerModal
        ownerId={ownerId}
        onSelectImage={(url, thumbUrl) => {
          if (bioImage) {
            setPortfolioSingleImage("bio", replacePortfolioManagedImageAsset(bioImage, { src: url, blurDataUrl: thumbUrl }))
          } else {
            setPortfolioSingleImage("bio", createPortfolioSectionImage({ id: "bio-primary", sectionId: "bio", src: url, blurDataUrl: thumbUrl }))
          }
        }}
      />
      <div className="flex items-baseline justify-between">
        <label className={editorialLabel}>{t("profilePhoto")}</label>
        <button
          onClick={() => openMediaPicker(ownerId)}
          className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground/30 pb-0.5"
        >
          {t("replaceMedia")}
        </button>
      </div>
      <div className="relative group transition-all duration-500">
        <div className="absolute -inset-2 rounded-[2rem] bg-muted/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity pointer-events-none" />
        <ImagePicker
          label=""
          slotId="portfolio.bio.primary"
          value={pickerValue}
          onChange={(next) => {
            if (!next.asset.src) {
              setPortfolioSingleImage("bio", undefined)
              return
            }
            if (bioImage) {
              setPortfolioSingleImage("bio", { ...bioImage, value: next })
            }
          }}
          onOpenMediaPicker={() => openMediaPicker(ownerId)}
          showCaption={false}
        />
      </div>
    </div>
  )
}

export function BioBiographyPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.portfolioSettings.bio")
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <Textarea
          className={ps.textarea(true, "min-h-24", "min-h-32")}
          value={bio.description}
          onChange={(e) => updateSectionContent("bio", { description: e.target.value })}
          placeholder={t("tellStory")}
          maxLength={LIMITS.bio}
        />
      </div>
    )
  }

  return (
    <div className="py-6 border-b border-border/30 overflow-hidden">
      <div className="flex items-center justify-between mb-2">
        <label className={editorialLabel}>{t("biography")}</label>
        <CharCounter value={bio.description} limit={LIMITS.bio} />
      </div>
      <Textarea
        className={cn(editorialInput, "text-base leading-relaxed min-h-[120px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
        value={bio.description}
        onChange={(e) => updateSectionContent("bio", { description: e.target.value })}
        placeholder={t("tellStoryEllipsis")}
        maxLength={LIMITS.bio}
      />
    </div>
  )
}
export function BioAchievementsPanel() {
  const t = useTranslations("editor.portfolioSettings.bio")
  const tCommon = useTranslations("editor.portfolioSettings.common")
  const { bio, updateSectionContent } = useContentSelector((state) => ({
    bio: state.sectionContent.bio,
    updateSectionContent: state.updateSectionContent,
  }))

  const achievements = bio.achievements || []

  const addAchievement = () => {
    if (achievements.length >= LIMITS.count) return
    updateSectionContent("bio", { achievements: [...achievements, ""] })
  }

  const removeAchievement = (index: number) =>
    updateSectionContent("bio", {
      achievements: achievements.filter((_, i) => i !== index),
    })

  const updateAchievement = (index: number, value: string) => {
    const next = [...achievements]
    next[index] = value
    updateSectionContent("bio", { achievements: next })
  }

  return (
    <div className="py-8 space-y-6">
      {/* Шапка секции */}
      <div className="flex items-center justify-between border-b border-border/30 pb-2">
        <label className={editorialLabel}>{t("achievementsRecognition")}</label>
        {achievements.length < LIMITS.count && (
          <button 
            onClick={addAchievement}
            className="text-[10px] uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> {tCommon("addItem")}
          </button>
        )}
      </div>

      {/* Список */}
      <div className="space-y-0 divide-y divide-border/10">
        {achievements.map((achievement, index) => (
          <div 
            key={index} 
            className="group flex items-start gap-4 py-3 transition-all"
          >
            {/* Нумерация в стиле индекса */}
            <span className="text-[9px] text-muted-foreground/40 font-mono pt-1 w-4 shrink-0">
              {String(index + 1).padStart(2, '0')}
            </span>

            {/* Поле ввода */}
            <div className="flex-1">
              <Input
                className={cn(editorialInput, "text-sm leading-snug")}
                placeholder={t("achievementPlaceholder")}
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                maxLength={LIMITS.achievement}
              />
            </div>

            {/* Удаление — деликатное, проявляется при ховере */}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/5 hover:text-destructive -mt-1"
              onClick={() => removeAchievement(index)}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}

        {/* Empty State — если ничего нет */}
        {achievements.length === 0 && (
          <button
            onClick={addAchievement}
            className="w-full py-10 border border-dashed border-border/30 rounded-2xl flex flex-col items-center justify-center gap-2 text-muted-foreground/60 hover:text-foreground hover:border-border/60 transition-all group"
          >
            <Trophy className="w-5 h-5 mb-1 opacity-20 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] uppercase tracking-[0.2em]">{t("recordAchievement")}</span>
          </button>
        )}
      </div>

      {/* Лимиты */}
      {achievements.length >= LIMITS.count && (
        <p className="text-[9px] text-muted-foreground/30 text-center italic pt-2">
          {t("maxDisplayCapacity")}
        </p>
      )}
    </div>
  )
}