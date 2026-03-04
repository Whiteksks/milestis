"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"

export function ContactHeadingPanel({ dense = false }: { dense?: boolean }) {
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Heading</PanelLabel>}
      <div className={ps.grid2(dense)}>
        <Input
          className={ps.input}
          value={contact.title}
          onChange={(e) => updateSectionContent("contact", { title: e.target.value })}
          placeholder="Get in touch"
        />
        <Input
          className={ps.input}
          value={contact.subtitle || ""}
          onChange={(e) => updateSectionContent("contact", { subtitle: e.target.value })}
          placeholder="Subtitle"
        />
      </div>
      <Textarea
        className={ps.textarea(dense)}
        value={contact.description}
        onChange={(e) => updateSectionContent("contact", { description: e.target.value })}
        placeholder="Description text..."
      />
    </div>
  )
}

export function ContactDetailsPanel({ dense = false }: { dense?: boolean }) {
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Contact Details</PanelLabel>}
      <Input
        className={ps.input}
        type="email"
        value={contact.email}
        onChange={(e) => updateSectionContent("contact", { email: e.target.value })}
        placeholder="Email"
      />
    </div>
  )
}
