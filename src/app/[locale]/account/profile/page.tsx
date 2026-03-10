"use client"

import { useEffect, useRef, useState } from "react"
import { ref as storageRef, uploadBytesResumable } from "firebase/storage"
import { useUserStore } from "@/hooks/useUserStore"
import { saveUserProfile } from "@/lib/user-profile"
import { auth, storage } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Camera, MapPin, Link, Loader2,
  Instagram, Github, Facebook, Twitter, Linkedin, Youtube, Globe, Twitch,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import ProfileSettingsSkeleton from "./profile-skeleton"

const AVATAR_MAX_BYTES = 10 * 1024 * 1024 // 10 MB — Cloud Function handles the resize

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
  const [publicName, setPublicName] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [socialLinks, setSocialLinks] = useState(["", "", "", ""])
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editSaving, setEditSaving] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
    ])
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
        await saveUserProfile({ displayName: editName })
      }
      setEditing(false)
    } catch (err: any) {
      setEditError(err.message)
    } finally {
      setEditSaving(false)
    }
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset input so the same file can be re-selected after an error
    e.target.value = ""
    if (!file) return

    const uid = auth.currentUser?.uid
    if (!uid) return

    if (file.size > AVATAR_MAX_BYTES) {
      setAvatarError("Image must be smaller than 10 MB")
      return
    }

    const ext = file.name.split(".").pop() ?? "jpg"
    // Cloud Function triggers on: avatars/{uid}/original.{ext}
    const path = `avatars/${uid}/original.${ext}`
    const fileRef = storageRef(storage, path)

    setAvatarUploading(true)
    setAvatarError(null)

    const task = uploadBytesResumable(fileRef, file, { contentType: file.type })
    task.on(
      "state_changed",
      null,
      (err) => {
        setAvatarError(err.message)
        setAvatarUploading(false)
      },
      () => {
        // Upload done — Cloud Function will resize and update photoURL in Firestore.
        // The Firestore listener in the app will update the store automatically.
        setAvatarUploading(false)
      }
    )
  }

  if (loading) {
    return <ProfileSettingsSkeleton />
  }

  const displayName = profile?.displayName ?? ""
  const email = profile?.email ?? ""

  const updateLink = (index: number, value: string) => {
    setSocialLinks(prev => prev.map((l, i) => (i === index ? value : l)))
  }

  function formatUrl(url: string): string {
    const trimmed = url.trim()
    if (!trimmed) return ""
    if (/^(https?:\/\/|\/\/)/i.test(trimmed)) return trimmed
    return `https://${trimmed}`
  }

  const handleBlur = (index: number, value: string) => {
    if (value.trim() !== "") {
      updateLink(index, formatUrl(value))
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveUserProfile({
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
              <Avatar className="size-20 rounded-2xl shrink-0">
                <AvatarImage src={profile?.photoURL ?? "/placeholder.svg?height=80&width=80"} alt="Profile" />
                <AvatarFallback className="rounded-2xl text-xl font-semibold bg-secondary text-primary">
                  {editName.split(" ").map(n => n[0]).join("") || "?"}
                </AvatarFallback>
              </Avatar>

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
              {/* Avatar with upload overlay */}
              <div className="relative group shrink-0">
                <Avatar className="size-25 rounded-2xl">
                  <AvatarImage src={profile?.photoURL ?? "/placeholder.svg?height=80&width=80"} alt="Profile" />
                  <AvatarFallback className="rounded-2xl text-xl font-semibold bg-secondary text-primary">
                    {displayName.split(" ").map(n => n[0]).join("") || "?"}
                  </AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute inset-0 rounded-2xl bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 disabled:cursor-not-allowed"
                >
                  {avatarUploading
                    ? <Loader2 className="size-5 text-background animate-spin" />
                    : <Camera className="size-5 text-background" />
                  }
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-semibold text-lg leading-tight truncate">{displayName || "Your name"}</p>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-muted-foreground">{email}</span>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Login email</span>
                </div>
                {avatarUploading && <p className="text-xs text-muted-foreground mt-1">Uploading photo...</p>}
                {avatarError && <p className="text-xs text-destructive mt-1">{avatarError}</p>}
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
            <Button className="rounded-full px-8" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}
