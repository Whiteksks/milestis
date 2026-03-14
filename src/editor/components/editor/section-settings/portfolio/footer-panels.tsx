"use client"

import { useContentSelector } from "@/editor/lib/store"
import { Input } from "@/components/ui/input"
import { PanelLabel } from "@/editor/components/editor/section-settings/ui/panel-label"
import { ps } from "@/editor/components/editor/section-settings/ui/panel-styles"
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

  const value = toTuple(footer.socialLinks ?? [])

  const handleChange = (urls: SocialLinksTuple) => {
    updateSectionContent("footer", { socialLinks: fromTuple(urls) })
  }

  return (
    <div className={ps.root(dense)}>
      {!dense && <PanelLabel>Social Links</PanelLabel>}
      <SocialLinksEditor value={value} onChange={handleChange} />
    </div>
  )
}
