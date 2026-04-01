"use client"

import { HeaderBrandPanel, HeaderLinksPanel } from "./header-panels"

export function HeaderSettings() {
  return (
    <div className="space-y-6">
        <HeaderBrandPanel />
        <HeaderLinksPanel />
    </div>
  )

}
