"use client"

import { ContactDetailsPanel, ContactHeadingPanel } from "./contact-panels"

export function ContactSettings() {
  return (
    <div className="space-y-6">
      <ContactHeadingPanel />
      <ContactDetailsPanel />
    </div>
  )

}
