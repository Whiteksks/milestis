"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Plus, Facebook, Instagram, Twitter, Linkedin, Github, Mail } from "lucide-react"

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
    <div className="space-y-1.5">
      {!dense && <Label className="text-xs font-medium text-muted-foreground">Copyright</Label>}
      <Input
        className="h-9 text-xs"
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
    <div className="space-y-3">
      {!dense && (
        <div className="flex items-center justify-between gap-3">
          <Label className="text-xs font-medium text-muted-foreground">Social Links</Label>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() =>
              updateSectionContent("footer", {
                socialLinks: [...socialLinks, { icon: "instagram", href: "" }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Add
          </Button>
        </div>
      )}

      {dense && (
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs"
          onClick={() =>
            updateSectionContent("footer", {
              socialLinks: [...socialLinks, { icon: "instagram", href: "" }],
            })
          }
        >
          <Plus className="w-3.5 h-3.5 mr-2" /> Add social
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
              className="flex-1 h-8 text-xs"
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
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-muted shrink-0"
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
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9 text-xs border-dashed text-muted-foreground hover:text-foreground"
            onClick={() =>
              updateSectionContent("footer", {
                socialLinks: [...socialLinks, { icon: "instagram", href: "" }],
              })
            }
          >
            <Plus className="w-3.5 h-3.5 mr-2" /> Add your first link
          </Button>
        )}
      </div>
    </div>
  )
}
