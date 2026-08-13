"use client"

import { useEffect, useState, useTransition } from "react"
import { useTranslations } from "next-intl"
import { useShallow } from "zustand/react/shallow"
import { selectProfileHydrating, useUserStore } from "@/hooks/useUserStore"
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
  const t = useTranslations()
  const { profile, loading } = useUserStore(
    useShallow((state) => ({
      profile: state.profile,
      loading: selectProfileHydrating(state),
    }))
  )
  const [publicName, setPublicName] = useState("")
  const [location, setLocation] = useState("")
  const [bio, setBio] = useState("")
  const [socialLinks, setSocialLinks] = useState<SocialLinksTuple>(["", "", "", ""])
  const [isSavingProfile, startSaveProfile] = useTransition()
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [isSavingEdit, startSaveEdit] = useTransition()
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
  }, [profile])

  const handleEditOpen = () => {
    setEditName(profile?.displayName ?? "")
    setEditError(null)
    setEditing(true)
  }

  const handleEditSave = () => {
    setEditError(null)
    startSaveEdit(async () => {
      try {
        if (editName !== (profile?.displayName ?? "")) {
          toastUser.saveName(saveUserProfile({ displayName: editName }))
        }
        setEditing(false)
      } catch (err: unknown) {
        setEditError((err as Error).message)
      }
    })
  }

  if (loading) {
    return <ProfileSettingsSkeleton />
  }

  const displayName = profile?.displayName ?? ""
  const email = profile?.email ?? ""

  const handleSave = () => {
    startSaveProfile(async () => {
      toastUser.saveProfile(
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
    })
  }

  return (
    <div className="mx-auto max-w-5xl space-y-10 pb-12">
      
      {/* Identity Section */}
      <section className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t('account.profile.title')}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t('account.profile.subtitle')}</p>

        {/* Fixed height container for smooth transition without layout shifts */}
        <div className="rounded-xs border border-border bg-card p-5 md:p-6 min-h-[116px] flex items-center">
          <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <UserAvatar 
                shape="square" 
                size="xl" 
                uploadable={!editing} 
                className="shrink-0 rounded-lg border border-border" 
              />

              <div className="flex-1 min-w-0 space-y-1">
                {editing ? (
                  <div className="space-y-1.5 max-w-xs">
                    <Label htmlFor="editName" className="font-sans text-xs font-medium text-muted-foreground">
                      {t('account.profile.displayNameLabel')}
                    </Label>
                    <Input
                      id="editName"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      autoFocus
                      className="h-9 rounded-xs border-border bg-background font-sans text-sm focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                    {editError && <p className="font-sans text-xs font-medium text-destructive">{editError}</p>}
                  </div>
                ) : (
                  <>
                    <p className="font-serif text-xl font-medium tracking-tight text-foreground truncate sm:text-2xl">
                      {displayName || t('account.profile.yourName')}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="font-sans text-sm text-muted-foreground">{email}</span>
                      <span className="rounded-xs border border-border bg-secondary/80 px-2 py-0.5 font-sans text-[11px] text-secondary-foreground">
                        {t('account.profile.loginEmail')}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center justify-end gap-2 pt-2 sm:pt-0">
              {editing ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-xs border-border px-3.5 font-sans text-xs hover:bg-secondary/60"
                    onClick={() => setEditing(false)}
                    disabled={isSavingEdit}
                  >
                    {t('account.profile.cancel')}
                  </Button>
                  <Button
                    size="sm"
                    className="h-9 rounded-xs bg-foreground px-4 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90"
                    onClick={handleEditSave}
                    disabled={isSavingEdit}
                  >
                    {isSavingEdit ? t('account.profile.saving') : t('account.profile.save')}
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 w-full rounded-xs border-border px-4 font-sans text-xs hover:bg-secondary/60 sm:w-auto"
                  onClick={handleEditOpen}
                >
                  {t('account.profile.editButton')}
                </Button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Public Profile Section */}
      <section className="space-y-2">
        <div className="flex items-center gap-4">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-foreground sm:text-3xl">
            {t('account.publicProfile.title')}
          </h2>
          <span className="h-px flex-1 bg-border/80" />
        </div>
        <p className="font-sans text-sm text-muted-foreground">{t('account.publicProfile.subtitle')}</p>

        <div className="space-y-5 rounded-xs border border-border bg-card p-5 md:p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="publicName" className="font-sans text-sm font-medium text-foreground">
                {t('account.publicProfile.publicNameLabel')}
              </Label>
              <Input
                id="publicName"
                value={publicName}
                onChange={(e) => setPublicName(e.target.value)}
                placeholder={t('account.publicProfile.publicNamePlaceholder')}
                className="h-9 rounded-xs border-border bg-background font-sans text-sm focus-visible:ring-1 focus-visible:ring-foreground"
              />
              <p className="font-sans text-xs text-muted-foreground">{t('account.publicProfile.canDiffer')}</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="location" className="flex items-center gap-1.5 font-sans text-sm font-medium text-foreground">
                <MapPin className="size-4 text-muted-foreground/80" />
                {t('account.publicProfile.locationLabel')}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t('account.publicProfile.locationPlaceholder')}
                className="h-9 rounded-xs border-border bg-background font-sans text-sm focus-visible:ring-1 focus-visible:ring-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio" className="font-sans text-sm font-medium text-foreground">
              {t('account.publicProfile.bioLabel')}
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={t('account.publicProfile.bioPlaceholder')}
              className="min-h-[90px] resize-none rounded-xs border-border bg-background p-3 font-sans text-sm leading-relaxed focus-visible:ring-1 focus-visible:ring-foreground"
              maxLength={160}
            />
            <p className="text-right font-sans text-xs tabular-nums text-muted-foreground">
              {bio.length} / 160 {t('account.publicProfile.characters')}
            </p>
          </div>

          <div className="space-y-2 border-t border-border/80 pt-4">
            <Label className="font-sans text-sm font-medium text-foreground">
              Social Links
            </Label>
            <SocialLinksEditor value={socialLinks} onChange={setSocialLinks} />
          </div>

          <div className="flex justify-end border-t border-border/80 pt-4">
            <Button
              className="h-9 rounded-xs bg-foreground px-5 font-sans text-xs font-medium text-background transition-colors hover:bg-foreground/90"
              onClick={handleSave}
              disabled={isSavingProfile}
            >
              {isSavingProfile ? t('account.profile.saving') : t('account.profile.saveChanges')}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}