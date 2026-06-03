"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ps, LIMITS, editorialInput, editorialLabel } from "@/editor/components/editor/section-settings/ui/panel-ui"
import {
  SocialLinksEditor,
  detectSocialSlug,
  type SocialLinksTuple,
} from "@/components/shared/social-links-editor"

// ─── Helpers ─────────────────────────────────────────────────────────────────

type SocialEntry = { icon: string; href: string }

/** Converts the store's sparse array to the fixed 4-tuple expected by SocialLinksEditor. */
function toTuple(links: SocialEntry[]): SocialLinksTuple {
  const hrefs = links.map((l) => l.href)
  return [hrefs[0] ?? "", hrefs[1] ?? "", hrefs[2] ?? "", hrefs[3] ?? ""]
}

/** Converts 4 raw URLs back to the store format, dropping empty entries. */
function fromTuple(urls: SocialLinksTuple): SocialEntry[] {
  return urls
    .filter((href) => href.trim() !== "")
    .map((href) => ({ icon: detectSocialSlug(href), href }))
}

// ─── Panels ──────────────────────────────────────────────────────────────────

export function FooterCopyrightPanel({ dense = false }: { dense?: boolean }) {
  const { footer, updateSectionContent } = useContentSelector((state) => ({
    footer: state.sectionContent.footer,
    updateSectionContent: state.updateSectionContent,
  }))

  if (dense) {
    return (
      <div className={ps.root(true)}>
        <Input className={ps.input} value={footer.copyright} onChange={(e) => updateSectionContent("footer", { copyright: e.target.value })} placeholder="© 2026. All rights reserved." maxLength={LIMITS.copyright} />
      </div>
    )
  }

  return (
    <div className="py-6 border-b border-border/30 space-y-3">
      <label className={editorialLabel}>Copyright</label>
      <Input
        className={cn(editorialInput, "text-base text-foreground")}
        value={footer.copyright}
        onChange={(e) => updateSectionContent("footer", { copyright: e.target.value })}
        placeholder="© 2026. All rights reserved."
        maxLength={LIMITS.copyright}
      />
    </div>
  )
}

export function FooterSocialLinksPanel({ dense = false }: { dense?: boolean }) {
  const { footer, updateSectionContent } = useContentSelector((state) => ({
    footer: state.sectionContent.footer,
    updateSectionContent: state.updateSectionContent,
  }))

  const value = toTuple(footer.socialLinks ?? [])

  const handleChange = (urls: SocialLinksTuple) => {
    updateSectionContent("footer", { socialLinks: fromTuple(urls) })
  }

  return (
    <div className={dense ? ps.root(true) : "py-6 space-y-3"}>
      {!dense && <label className={editorialLabel}>Social Links</label>}
      <SocialLinksEditor value={value} onChange={handleChange} editorial />
    </div>
  )
}
