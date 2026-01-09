"use client"

import { HeaderBrandPanel, HeaderLinksPanel } from "./header-panels"

export function HeaderSettings() {
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Navigation</h3>
        <p className="text-xs text-muted-foreground">Header brand and menu links</p>
      </div>

      <div className="space-y-7">
        <HeaderBrandPanel />
        <HeaderLinksPanel />
      </div>
    </div>
  )

}
