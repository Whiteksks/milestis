"use client"

import { useState } from "react"
import { useUserStore } from "@/hooks/useUserStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Camera, MapPin, Link,
  Instagram, Github, Facebook, Twitter, Linkedin, Youtube, Globe, Twitch,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ProfileSettingsSkeleton from "./profile-skeleton"

function detectIcon(url: string): LucideIcon {
  if (!url) return Link
  const u = url.toLowerCase()
  if (u.includes("instagram.com")) return Instagram
  if (u.includes("github.com")) return Github
  if (u.includes("facebook.com") || u.includes("fb.com")) return Facebook
  if (u.includes("twitter.com") || u.includes("x.com")) return Twitter
  if (u.includes("linkedin.com")) return Linkedin
  if (u.includes("youtube.com") || u.includes("youtu.be")) return Youtube
  if (u.includes("twitch.tv")) return Twitch
  if (u.startsWith("http")) return Globe
  return Link
}

export default function ProfileSettings() {
  const { profile, loading } = useUserStore()
  const [bio, setBio] = useState("")
  const [socialLinks, setSocialLinks] = useState(["", "", "", ""])

  if (loading) {
    return <ProfileSettingsSkeleton />
  }

  const name = profile?.displayName ?? ""
  const email = profile?.email ?? ""

  const updateLink = (index: number, value: string) => {
    setSocialLinks(prev => prev.map((l, i) => (i === index ? value : l)))
  }
  function formatUrl(url: string): string {
    const trimmed = url.trim()
    if (!trimmed) return ""
    // Проверяем, начинается ли строка с протокола или //
    if (/^(https?:\/\/| \/\/)/i.test(trimmed)) {
      return trimmed
    }
    return `https://${trimmed}`
  }
  const handleBlur = (index: number, value: string) => {
    if (value.trim() !== "") {
      const formatted = formatUrl(value)
      updateLink(index, formatted)
    }
  }

  return (
    <div className="space-y-12">

      {/* Identity */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Profile</h2>
          <p className="mt-1 text-muted-foreground">How you appear inside Milestis</p>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group shrink-0">
              <Avatar className="size-20 rounded-2xl">
                <AvatarImage src="/placeholder.svg?height=80&width=80" alt="Profile" />
                <AvatarFallback className="rounded-2xl text-xl font-semibold bg-secondary text-primary">
                  {name.split(" ").map(n => n[0]).join("") || "?"}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 rounded-2xl bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Camera className="size-5 text-background" />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-lg leading-tight truncate">{name || "Your name"}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">{email}</span>
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Login email</span>
              </div>
            </div>

            <Button variant="outline" size="sm" className="rounded-full px-5 shrink-0">
              Edit
            </Button>
          </div>
        </div>
      </section>

      {/* Public profile */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Public Profile</h2>
          <p className="mt-1 text-muted-foreground">Shown on shared links and your public portfolio</p>
        </div>

        <div className="rounded-2xl bg-card p-6 shadow-sm space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="publicName" className="text-sm font-medium">Public Name</Label>
              <Input
                id="publicName"
                defaultValue={name}
                placeholder="How you want to be known"
                className="rounded-xl"
              />
              <p className="text-xs text-muted-foreground">Can differ from your account name</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground" />
                Location
              </Label>
              <Input id="location" placeholder="City, Country (optional)" className="rounded-xl" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium">Short Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="A few words about yourself or your work..."
              className="rounded-xl resize-none min-h-20"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground text-right">{bio.length} / 160 characters</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Links</Label>
            <div className="space-y-3">
              {socialLinks.map((link, index) => {
                const Icon = detectIcon(link)
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary transition-colors">
                      <Icon className="size-4 text-primary transition-all" />
                    </div>
                    <Input
                      value={link}
                      onChange={e => updateLink(index, e.target.value)}
                      onBlur={e => handleBlur(index, e.target.value)}
                      placeholder={`Link to social ${index + 1}`}
                      className="rounded-xl flex-1"
                    />
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button className="rounded-full px-8">Save Changes</Button>
          </div>
        </div>
      </section>

    </div>
  )
}
