"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Facebook, Instagram, Twitter, Linkedin, Github, Mail, Link2 } from "lucide-react"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"

const iconMap = {
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  linkedin: Linkedin,
  github: Github,
  email: Mail,
}

const socialIcons = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
  { id: "twitter", label: "X (Twitter)" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "github", label: "GitHub" },
  { id: "email", label: "Email" },
]

export function FooterCopyrightPanel({ dense = false }: { dense?: boolean }) {
  const { footer, updateSectionContent } = useContentSelector((state) => ({
    footer: state.sectionContent.footer,
    updateSectionContent: state.updateSectionContent,
  }))

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Copyright</PanelLabel>}
      <Input
        className={ps.input}
        value={footer.copyright}
        onChange={(e) => updateSectionContent("footer", { copyright: e.target.value })}
        placeholder="© 2026. All rights reserved."
      />
    </div>
  )
}

export function FooterSocialLinksPanel({ dense = false }: { dense?: boolean }) {
  const { footer, updateSectionContent } = useContentSelector((state) => ({
    footer: state.sectionContent.footer,
    updateSectionContent: state.updateSectionContent,
  }))

  const socialLinks = footer.socialLinks || []

  return (
    <div className={ps.root(dense)}>
      {!dense && socialLinks.length > 0 && (
        <div className="flex items-center justify-between">
          <PanelLabel>Social Links</PanelLabel>
          <Button
            variant="ghost"
            size="sm"
            className={ps.addBtn}
            onClick={() =>
              updateSectionContent("footer", {
                socialLinks: [...socialLinks, { icon: "instagram", href: "" }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </Button>
        </div>
      )}

      {dense && (
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs"
          onClick={() =>
            updateSectionContent("footer", {
              socialLinks: [...socialLinks, { icon: "instagram", href: "" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add social
        </Button>
      )}

      <div className="space-y-2">
        {socialLinks.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select
              value={link.icon}
              onValueChange={(value) => {
                const newLinks = [...socialLinks]
                newLinks[index] = { ...link, icon: value }
                updateSectionContent("footer", { socialLinks: newLinks })
              }}
            >
              <SelectTrigger className="w-35 h-8 text-xs">
                <SelectValue placeholder="Platform" />
              </SelectTrigger>
              <SelectContent>
                {socialIcons.map((social) => {
                  const ItemIcon = iconMap[social.id as keyof typeof iconMap]
                  return (
                    <SelectItem key={social.id} value={social.id}>
                      <div className="flex items-center gap-2">
                        {ItemIcon && <ItemIcon className="w-3 h-3" />}
                        {social.label}
                      </div>
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <Input
              className={ps.inputFlex}
              placeholder="URL"
              value={link.href}
              onChange={(e) => {
                const newLinks = [...socialLinks]
                newLinks[index] = { ...link, href: e.target.value }
                updateSectionContent("footer", { socialLinks: newLinks })
              }}
            />

            <Button
              variant="ghost"
              size="icon"
              className={ps.deleteBtn}
              onClick={() => {
                const newLinks = socialLinks.filter((_, i) => i !== index)
                updateSectionContent("footer", { socialLinks: newLinks })
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}

        {socialLinks.length === 0 && (
          <button
            type="button"
            onClick={() =>
              updateSectionContent("footer", {
                socialLinks: [...socialLinks, { icon: "instagram", href: "" }],
              })
            }
            className={ps.emptyZone}
          >
            <Link2 className={ps.emptyIcon} />
            {!dense && (
              <span className={ps.emptyText}>
                Add social links
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
