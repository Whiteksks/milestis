"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/hooks/useUserStore"
import { saveUserProfile } from "@/lib/user"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { MapPin } from "lucide-react"
import { UserAvatar } from "@/components/shared/user-avatar"
import ProfileSettingsSkeleton from "./profile-skeleton"
import { SocialLinksEditor, type SocialLinksTuple } from "@/components/shared/social-links-editor"
import { toastUser } from "@/lib/toast"

export default function ProfileSettings() {
  const { profile, loading } = useUserStore()
  const [publicName, setPublicName] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [socialLinks, setSocialLinks] = useState<SocialLinksTuple>(["" , "", "", ""])
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  useEffect(() => {
    if (!profile) return
    setPublicName(profile.profileTemplate?.name ?? "")
    setLocation(profile.profileTemplate?.location ?? "")
    setBio(profile.profileTemplate?.bio ?? "")
    setSocialLinks([
      profile.profileTemplate?.sociallinks?.link1 ?? "",
      profile.profileTemplate?.sociallinks?.link2 ?? "",
      profile.profileTemplate?.sociallinks?.link3 ?? "",
      profile.profileTemplate?.sociallinks?.link4 ?? "",
    ] as SocialLinksTuple)
  }, [profile?.uid])

  const handleEditOpen = () => {
    setEditName(profile?.displayName ?? "")
    setEditError(null)
    setEditing(true)
  }

  const handleEditSave = async () => {
    setEditSaving(true)
    setEditError(null)
    try {
      if (editName !== (profile?.displayName ?? "")) {
        await toastUser.saveName(saveUserProfile({ displayName: editName }))
      }
      setEditing(false)
    } catch (err: any) {
      setEditError(err.message)
    } finally {
      setEditSaving(false)
    }
  }

  if (loading) {
    return <ProfileSettingsSkeleton />
  }

  const displayName = profile?.displayName ?? ""
  const email = profile?.email ?? ""

  const handleSave = async () => {
    setSaving(true)
    try {
      await toastUser.saveProfile(
        saveUserProfile({
          profileTemplate: {
            name: publicName || undefined,
            location: location || undefined,
            bio: bio || undefined,
            sociallinks: {
              link1: socialLinks[0] || undefined,
              link2: socialLinks[1] || undefined,
              link3: socialLinks[2] || undefined,
              link4: socialLinks[3] || undefined,
            },
          },
        })
      )
    } finally {
      setSaving(false)
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
          {editing ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <UserAvatar shape="square" size="lg" />

              <div className="flex-1 min-w-0 space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="editName" className="text-xs text-muted-foreground">Display name</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
                {editError && <p className="text-xs text-destructive">{editError}</p>}
              </div>

              <div className="flex gap-2 shrink-0">
                <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => setEditing(false)} disabled={editSaving}>
                  Cancel
                </Button>
                <Button size="sm" className="rounded-full px-4" onClick={handleEditSave} disabled={editSaving}>
                  {editSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <UserAvatar shape="square" size="xl" uploadable />

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg leading-tight truncate">{displayName || "Your name"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{email}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Login email</span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="rounded-full px-5 shrink-0" onClick={handleEditOpen}>
                Edit
              </Button>
            </div>
          )}
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
                value={publicName}
                onChange={e => setPublicName(e.target.value)}
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
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder="City, Country (optional)"
                className="rounded-xl"
              />
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
            <SocialLinksEditor value={socialLinks} onChange={setSocialLinks} />
          </div>

          <div className="flex justify-end pt-2">
            <Button className="rounded-full px-8" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
