"use client"

import { FooterCopyrightPanel, FooterSocialLinksPanel } from "./footer-panels"

export function FooterSettings() {
  return (
    <div className="space-y-6">
        <FooterCopyrightPanel />
        <FooterSocialLinksPanel />
    </div>
  )
}
