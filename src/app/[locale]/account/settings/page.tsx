"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Globe, Layout, Save, Bell, Mail, CreditCard, RefreshCw, Download, FileText, AlertTriangle, Keyboard } from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/custom/LangSwitch"

export default function AccountSettings() {
  const [autoSave, setAutoSave] = useState(true)
  const [notifyPublished, setNotifyPublished] = useState(true)
  const [notifyCredits, setNotifyCredits] = useState(true)
  const [notifyReset, setNotifyReset] = useState(false)

  return (
    <div className="space-y-12">

      {/* Preferences */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Preferences</h2>
          <p className="mt-1 text-muted-foreground">Language and regional settings</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="space-y-2 max-w-xs">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              Language
            </Label>
            <LanguageSwitcher />
          </div>
        </div>
      </section>

      {/* Editor */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Editor</h2>
          <p className="mt-1 text-muted-foreground">How the project editor behaves</p>
        </div>
        <div className="rounded-2xl bg-card shadow-sm">
          <div className="divide-y divide-border/40">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Save className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Auto-save</p>
                  <p className="text-sm text-muted-foreground">Save changes automatically during editing</p>
                </div>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Keyboard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Alt-key Shortcuts</p>
                  <p className="text-sm text-muted-foreground">Require Alt modifier for standard shortcuts</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Notifications</h2>
          <p className="mt-1 text-muted-foreground">Emails you would like to receive</p>
        </div>
        <div className="rounded-2xl bg-card shadow-sm">
          <div className="divide-y divide-border/40">
            {[
              { icon: Mail, label: "Project Published", desc: "Get notified when your project goes live", checked: notifyPublished, set: setNotifyPublished },
              { icon: CreditCard, label: "Credits Usage", desc: "Alerts when credits are running low", checked: notifyCredits, set: setNotifyCredits },
              { icon: RefreshCw, label: "Monthly Credits Reset", desc: "Reminder when your credits refresh each month", checked: notifyReset, set: setNotifyReset },
            ].map(({ icon: Icon, label, desc, checked, set }) => (
              <div key={label} className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{label}</p>
                    <p className="text-sm text-muted-foreground">{desc}</p>
                  </div>
                </div>
                <Switch checked={checked} onCheckedChange={set} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Data */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Data & Export</h2>
          <p className="mt-1 text-muted-foreground">Download your account information and project data</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" className="flex-1 justify-start gap-2 rounded-full bg-transparent">
              <Download className="h-4 w-4" />
              Download Account Data
            </Button>
            <Button variant="outline" className="flex-1 justify-start gap-2 rounded-full bg-transparent">
              <FileText className="h-4 w-4" />
              Export Project Metadata
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Account data includes your profile, preferences, and usage history.
          </p>
        </div>
      </section>

      {/* Danger Zone */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl text-muted-foreground">Danger Zone</h2>
          <p className="mt-1 text-muted-foreground">Permanent actions that cannot be undone</p>
        </div>
        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">Delete your account</p>
              <p className="text-sm text-muted-foreground">This will permanently remove all your projects and data.</p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-full border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              Delete Account
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
