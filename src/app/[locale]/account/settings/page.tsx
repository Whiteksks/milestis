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
} from "lucide-react"

export default function AccountSettings() {
  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("utc")
  const [dateFormat, setDateFormat] = useState("mdy")
  const [defaultProjectType, setDefaultProjectType] = useState("photobook")
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
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language" className="rounded-xl bg-background/50">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Espanol</SelectItem>
                  <SelectItem value="fr">Francais</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Time Zone
              </Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger id="timezone" className="rounded-xl bg-background/50">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                  <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                  <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                  <SelectItem value="cet">CET (Central European Time)</SelectItem>
                  <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date Format
              </Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger id="dateFormat" className="rounded-xl bg-background/50">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="ymd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Default Behavior */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary/70" />
            Default Behavior
          </CardTitle>
          <CardDescription>Set defaults for new projects you create</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="projectType" className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                Default Project Type
              </Label>
              <Select value={defaultProjectType} onValueChange={setDefaultProjectType}>
                <SelectTrigger id="projectType" className="rounded-xl bg-background/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="photobook">Photobook</SelectItem>
                  <SelectItem value="portfolio">Portfolio Site</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template" className="flex items-center gap-2 text-sm font-medium">
                <Layout className="h-4 w-4 text-muted-foreground" />
                Default Template
              </Label>
              <Select defaultValue="none">
                <SelectTrigger id="template" className="rounded-xl bg-background/50">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">No default</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="classic">Classic</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-muted/30 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Save className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Auto-save</p>
                <p className="text-sm text-muted-foreground">Automatically save your work as you edit</p>
              </div>
            </div>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>

          <p className="text-xs text-muted-foreground">
            These settings only affect new projects. Existing projects keep their current settings.
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
