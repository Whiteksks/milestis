"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactHeadingPanel({ dense = false }: { dense?: boolean }) {
  const { contact, updateSectionContent } = useContentSelector((state) => ({
    contact: state.sectionContent.contact,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Heading</Label>}
      <div className="grid grid-cols-2 gap-3">
        <Input
          className="h-9 text-xs"
          value={contact.title}
          onChange={(e) => updateSectionContent("contact", { title: e.target.value })}
          placeholder="Get in touch"
        />
        <Input
          className="h-9 text-xs"
          value={contact.subtitle || ""}
          onChange={(e) => updateSectionContent("contact", { subtitle: e.target.value })}
          placeholder="Subtitle"
        />
      </div>
      <Textarea
        className="min-h-22.5 text-xs resize-none"
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
    <div className="space-y-3">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Contact Details</Label>}
      <div className="grid grid-cols-1 gap-3">
        <Input
          className="h-9 text-xs"
          type="email"
          value={contact.email}
          onChange={(e) => updateSectionContent("contact", { email: e.target.value })}
          placeholder="Email"
        />
      </div>
    </div>
  )
}
