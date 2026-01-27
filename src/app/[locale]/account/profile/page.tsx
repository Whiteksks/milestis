"use client"

import { useUserStore } from "@/hooks/useUserStore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Camera, Globe, Instagram, Palette, MapPin, Info } from "lucide-react"
import ProfileSettingsSkeleton from "./loading"

export default function ProfileSettings() {
  // Берём данные пользователя из Zustand
  const { profile, loading } = useUserStore()

  if (loading) {
    return <ProfileSettingsSkeleton />
  }

  const name = profile?.displayName ?? ""
  const email = profile?.email ?? ""

  return (
    <div className="space-y-8">
      {/* Profile Card - Personal Identity */}
      <Card className="rounded-3xl border-border/30 bg-linear-to-br from-card via-card/95 to-accent/10 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Decorative header band */}
          <div className="h-20 bg-linear-to-r from-primary/20 via-accent/30 to-primary/10" />

          <div className="px-8 pb-8 -mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
              {/* Large Avatar with edit overlay */}
              <div className="relative group">
                <Avatar className="size-28 rounded-3xl border-4 border-background shadow-xl">
                  <AvatarImage src="/placeholder.svg?height=112&width=112" alt="Profile" />
                  <AvatarFallback className="rounded-3xl text-2xl font-semibold bg-primary/10 text-primary">
                    {name.split(" ").map(n => n[0]).join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute inset-0 rounded-3xl bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Camera className="size-6 text-background" />
                </button>
              </div>

              {/* Name and Email */}
              <div className="flex-1 space-y-1 pb-2">
                <h2 className="text-2xl font-semibold text-foreground">{name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-sm">{email}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    Login email
                  </span>
                </div>
              </div>

              {/* Edit button */}
              <Button variant="outline" className="rounded-xl bg-background/80 hover:bg-background">
                Edit Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Public Profile Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <h3 className="text-lg font-semibold text-foreground">Public Profile</h3>
        </div>

        <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6 space-y-6">
            {/* Info note */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/30 border border-accent/50">
              <Info className="size-5 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-muted-foreground">
                This information may be shown on your public portfolio or shared links.
              </p>
            </div>

            {/* Public Name and Location row */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="publicName" className="text-sm font-medium">
                  Public Name
                </Label>
                <Input
                  id="publicName"
                  defaultValue={name}
                  placeholder="How you want to be known"
                  className="rounded-xl bg-background/50"
                />
                <p className="text-xs text-muted-foreground">Can differ from your account name</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="size-4 text-muted-foreground" />
                  Location
                </Label>
                <Input id="location" placeholder="City, Country (optional)" className="rounded-xl bg-background/50" />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-sm font-medium">
                Short Bio
              </Label>
              <Textarea
                id="bio"
                placeholder="A few words about yourself or your work..."
                className="rounded-xl bg-background/50 resize-none min-h-20"
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground text-right">0 / 160 characters</p>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Social Links</Label>

              <div className="grid gap-4">
                {/* Website */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Globe className="size-5 text-muted-foreground" />
                  </div>
                  <Input placeholder="https://yourwebsite.com" className="rounded-xl bg-background/50 flex-1" />
                </div>

                {/* Instagram */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Instagram className="size-5 text-muted-foreground" />
                  </div>
                  <Input placeholder="@username" className="rounded-xl bg-background/50 flex-1" />
                </div>

                {/* Behance */}
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted/50 flex items-center justify-center shrink-0">
                    <Palette className="size-5 text-muted-foreground" />
                  </div>
                  <Input placeholder="Behance profile URL" className="rounded-xl bg-background/50 flex-1" />
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end pt-2">
              <Button className="rounded-xl px-6">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
