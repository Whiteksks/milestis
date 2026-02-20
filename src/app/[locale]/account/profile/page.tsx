"use client"

import { useUserStore } from "@/hooks/useUserStore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Globe, Instagram, Palette, MapPin } from "lucide-react"
import ProfileSettingsSkeleton from "./profile-skeleton"

export default function ProfileSettings() {
  const { profile, loading } = useUserStore()

  if (loading) {
    return <ProfileSettingsSkeleton />
  }

  const name = profile?.displayName ?? ""
  const email = profile?.email ?? ""

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
              placeholder="A few words about yourself or your work..."
              className="rounded-xl resize-none min-h-20"
              maxLength={160}
            />
            <p className="text-xs text-muted-foreground text-right">0 / 160 characters</p>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Social Links</Label>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Globe className="size-4 text-primary" />
                </div>
                <Input placeholder="https://yourwebsite.com" className="rounded-xl flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Instagram className="size-4 text-primary" />
                </div>
                <Input placeholder="@instagram" className="rounded-xl flex-1" />
              </div>
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  <Palette className="size-4 text-primary" />
                </div>
                <Input placeholder="Behance profile URL" className="rounded-xl flex-1" />
              </div>
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
