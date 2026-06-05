"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { ps, LIMITS, editorialInput, editorialLabel, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function ContactHeadingPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.portfolioSettings.contact")
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <div className={ps.grid2(true)}>
          <Input className={ps.input} value={contact.title} onChange={(e) => updateSectionContent("contact", { title: e.target.value })} placeholder={t("getInTouch")} maxLength={LIMITS.title} />
          <Input className={ps.input} value={contact.subtitle || ""} onChange={(e) => updateSectionContent("contact", { subtitle: e.target.value })} placeholder={t("subtitle")} maxLength={LIMITS.subtitle} />
        </div>
        <Textarea className={ps.textarea(true)} value={contact.description} onChange={(e) => updateSectionContent("contact", { description: e.target.value })} placeholder={t("descriptionText")} maxLength={LIMITS.description} />
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-6">
        <div className="space-y-1 pr-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>{t("heading")}</label>
            <CharCounter value={contact.title} limit={LIMITS.title} />
          </div>
          <Input
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            value={contact.title}
            onChange={(e) => updateSectionContent("contact", { title: e.target.value })}
            placeholder={t("getInTouch")}
            maxLength={LIMITS.title}
          />
        </div>
        <div className="space-y-1 pl-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>{t("subtitle")}</label>
            <CharCounter value={contact.subtitle || ""} limit={LIMITS.subtitle} />
          </div>
          <Input
            className={cn(editorialInput, "text-base text-muted-foreground")}
            value={contact.subtitle || ""}
            onChange={(e) => updateSectionContent("contact", { subtitle: e.target.value })}
            placeholder={t("letsTalk")}
            maxLength={LIMITS.subtitle}
          />
        </div>
      </div>
      <div className="py-6 border-b border-border/30 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <label className={editorialLabel}>{t("description")}</label>
          <CharCounter value={contact.description} limit={LIMITS.description} />
        </div>
        <Textarea
          className={cn(editorialInput, "text-base leading-relaxed min-h-[100px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
          value={contact.description}
          onChange={(e) => updateSectionContent("contact", { description: e.target.value })}
          placeholder={t("descriptionPlaceholder")}
          maxLength={LIMITS.description}
        />
      </div>
    </div>
  )
}

export function ContactDetailsPanel({ dense = false }: { dense?: boolean }) {
  const t = useTranslations("editor.portfolioSettings.contact")
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <Input className={ps.input} type="email" value={contact.email} onChange={(e) => updateSectionContent("contact", { email: e.target.value })} placeholder={t("email")} maxLength={LIMITS.email} />
      </div>
    )
  }

  return (
    <div className="py-6 space-y-3">
      <label className={editorialLabel}>{t("emailAddress")}</label>
      <Input
        className={cn(editorialInput, "text-base text-foreground")}
        type="email"
        value={contact.email}
        onChange={(e) => updateSectionContent("contact", { email: e.target.value })}
        placeholder={t("emailPlaceholder")}
        maxLength={LIMITS.email}
      />
    </div>
  )
}

