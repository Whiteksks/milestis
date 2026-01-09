"use client"

import { FooterCopyrightPanel, FooterSocialLinksPanel } from "./footer-panels"

export function FooterSettings() {
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Footer</h3>
        <p className="text-xs text-muted-foreground">Copyright and social links</p>
      </div>

      <div className="space-y-7">
        <FooterCopyrightPanel />
        <FooterSocialLinksPanel />
      </div>
    </div>
  )
}
