"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { ps, LIMITS, editorialInput, editorialLabel, CharCounter } from "@/editor/components/editor/section-settings/ui/panel-ui"

export function ContactHeadingPanel({ dense = false }: { dense?: boolean }) {
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <div className={ps.grid2(true)}>
          <Input className={ps.input} value={contact.title} onChange={(e) => updateSectionContent("contact", { title: e.target.value })} placeholder="Get in touch" maxLength={LIMITS.title} />
          <Input className={ps.input} value={contact.subtitle || ""} onChange={(e) => updateSectionContent("contact", { subtitle: e.target.value })} placeholder="Subtitle" maxLength={LIMITS.subtitle} />
        </div>
        <Textarea className={ps.textarea(true)} value={contact.description} onChange={(e) => updateSectionContent("contact", { description: e.target.value })} placeholder="Description text..." maxLength={LIMITS.description} />
      </div>
    )
  }

  return (
    <div className="py-2">
      <div className="grid grid-cols-2 divide-x divide-border/30 border-b border-border/30 pb-6">
        <div className="space-y-1 pr-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Heading</label>
            <CharCounter value={contact.title} limit={LIMITS.title} />
          </div>
          <Input
            className={cn(editorialInput, "text-base font-medium tracking-tight text-foreground")}
            value={contact.title}
            onChange={(e) => updateSectionContent("contact", { title: e.target.value })}
            placeholder="Get in touch"
            maxLength={LIMITS.title}
          />
        </div>
        <div className="space-y-1 pl-2">
          <div className="flex items-center justify-between">
            <label className={editorialLabel}>Subtitle</label>
            <CharCounter value={contact.subtitle || ""} limit={LIMITS.subtitle} />
          </div>
          <Input
            className={cn(editorialInput, "text-base text-muted-foreground")}
            value={contact.subtitle || ""}
            onChange={(e) => updateSectionContent("contact", { subtitle: e.target.value })}
            placeholder="Let\'s talk"
            maxLength={LIMITS.subtitle}
          />
        </div>
      </div>
      <div className="py-6 border-b border-border/30 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <label className={editorialLabel}>Description</label>
          <CharCounter value={contact.description} limit={LIMITS.description} />
        </div>
        <Textarea
          className={cn(editorialInput, "text-base leading-relaxed min-h-[100px] w-full max-w-full resize-none block overflow-x-hidden break-words")}
          value={contact.description}
          onChange={(e) => updateSectionContent("contact", { description: e.target.value })}
          placeholder="How can I help you?"
          maxLength={LIMITS.description}
        />
      </div>
    </div>
  )
}

export function ContactDetailsPanel({ dense = false }: { dense?: boolean }) {
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <Input className={ps.input} type="email" value={contact.email} onChange={(e) => updateSectionContent("contact", { email: e.target.value })} placeholder="Email" maxLength={LIMITS.email} />
      </div>
    )
  }

  return (
    <div className="py-6 space-y-3">
      <label className={editorialLabel}>Email Address</label>
      <Input
        className={cn(editorialInput, "text-base text-foreground")}
        type="email"
        value={contact.email}
        onChange={(e) => updateSectionContent("contact", { email: e.target.value })}
        placeholder="hello@example.com"
        maxLength={LIMITS.email}
      />
    </div>
  )
}

