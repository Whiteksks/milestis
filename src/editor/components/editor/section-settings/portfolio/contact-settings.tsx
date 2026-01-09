"use client"

import { ContactDetailsPanel, ContactHeadingPanel } from "./contact-panels"

export function ContactSettings() {
  return (
    <div className="px-6 py-5 space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-medium leading-none">Contact</h3>
        <p className="text-xs text-muted-foreground">How people can reach you</p>
      </div>

      <div className="space-y-7">
        <ContactHeadingPanel />
        <ContactDetailsPanel />
      </div>
    </div>
  )

}
