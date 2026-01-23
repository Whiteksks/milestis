"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  Globe,
  Clock,
  Calendar,
  BookOpen,
  Layout,
  Save,
  Bell,
  Mail,
  CreditCard,
  RefreshCw,
  Download,
  FileText,
  AlertTriangle,
  Keyboard,
} from "lucide-react"
import { LanguageSwitcher } from "@/components/ui/custom/LangSwitch"
import { StyleSwitcher } from "@/components/ui/custom/StyleSwitcher"

export default function AccountSettings() {
  const [timezone, setTimezone] = useState("utc")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [autoSave, setAutoSave] = useState(true)
  const [notifyPublished, setNotifyPublished] = useState(true)
  const [notifyCredits, setNotifyCredits] = useState(true)
  const [notifyReset, setNotifyReset] = useState(false)

  return (
    <div className="space-y-6">
      {/* Account Preferences */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary/70" />
            Account Preferences
          </CardTitle>
          <CardDescription>Customize your language and regional settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="language" className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-muted-foreground" />
                Language
              </Label>
              <LanguageSwitcher/>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Behavior */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary/70" />
            Project Behavior
          </CardTitle>
          <CardDescription>Configure how you interact with the project editor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Auto-save Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Save className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Auto-save</p>
                <p className="text-sm text-muted-foreground">Save changes automatically during editing</p>
              </div>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>

          {/* Alt Modifier Toggle */}
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Keyboard className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Alt-key Shortcuts</p>
                <p className="text-sm text-muted-foreground">Require Alt modifier for standard shortcuts (e.g., Alt+Ctrl+A)</p>
              </div>
            </div>
            <Switch  />
          </div>

          <p className="text-xs text-muted-foreground">
            These preferences apply to your current interaction mode and session.
          </p>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary/70" />
            Notifications
          </CardTitle>
          <CardDescription>Choose which emails you would like to receive</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10">
                <Mail className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Project Published</p>
                <p className="text-sm text-muted-foreground">Get notified when your project goes live</p>
              </div>
            </div>
            <Switch checked={notifyPublished} onCheckedChange={setNotifyPublished} />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/10">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Credits Usage</p>
                <p className="text-sm text-muted-foreground">Alerts when credits are running low</p>
              </div>
            </div>
            <Switch checked={notifyCredits} onCheckedChange={setNotifyCredits} />
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10">
                <RefreshCw className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Monthly Credits Reset</p>
                <p className="text-sm text-muted-foreground">Reminder when your credits refresh each month</p>
              </div>
            </div>
            <Switch checked={notifyReset} onCheckedChange={setNotifyReset} />
          </div>
        </CardContent>
      </Card>

      {/* Data & Export */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary/70" />
            Data & Export
          </CardTitle>
          <CardDescription>Download your account information and project data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" className="flex-1 justify-start gap-2 rounded-xl bg-transparent">
              <Download className="h-4 w-4" />
              Download Account Data
            </Button>
            <Button variant="outline" className="flex-1 justify-start gap-2 rounded-xl bg-transparent">
              <FileText className="h-4 w-4" />
              Export Project Metadata
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Account data includes your profile, preferences, and usage history. Project metadata includes titles, dates,
            and settings for all your projects.
          </p>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-2xl border-border/40 bg-muted/20 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-muted-foreground">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>Permanent actions that cannot be undone</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-muted-foreground">Delete your account</p>
              <p className="text-sm text-muted-foreground">This will permanently remove all your projects and data.</p>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-xl border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
