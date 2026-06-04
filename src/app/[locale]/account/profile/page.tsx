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
  const [socialLinks, setSocialLinks] = useState<SocialLinksTuple>(["" , "", "", ""])
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
          await toastUser.saveName(saveUserProfile({ displayName: editName }))
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
    })
  }

  return (
    <div className="space-y-16 max-w-5xl mx-auto pb-12">
      
      {/* Identity Section */}
      <section className="space-y-6">
        <div className="space-y-1 px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{t('account.profile.title')}</h2>
          <p className="text-sm text-muted-foreground/90">{t('account.profile.subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-colors duration-300 hover:border-border/100">
          {editing ? (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <UserAvatar shape="square" size="lg" className="rounded-xl shadow-inner border border-border/40" />

              <div className="flex-1 min-w-0 space-y-3 w-full">
                <div className="space-y-1.5">
                  <Label htmlFor="editName" className="text-xs font-medium text-muted-foreground">{t('account.profile.displayNameLabel')}</Label>
                  <Input
                    id="editName"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                    className="rounded-xl h-10 transition-all border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary"
                  />
                </div>
                {editError && <p className="text-xs font-medium text-destructive">{editError}</p>}
              </div>

              <div className="flex gap-2.5 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0">
                <Button variant="outline" size="sm" className="rounded-full h-9 px-4 border-border/80 hover:bg-secondary/60 transition-colors" onClick={() => setEditing(false)} disabled={isSavingEdit}>
                  {t('account.profile.cancel')}
                </Button>
                <Button size="sm" className="rounded-full h-9 px-5 shadow-sm transition-opacity hover:opacity-90" onClick={handleEditSave} disabled={isSavingEdit}>
                  {isSavingEdit ? t('account.profile.saving') : t('account.profile.save')}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <UserAvatar shape="square" size="xl" uploadable className="rounded-2xl shadow-sm border border-border/50" />

              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-semibold text-xl tracking-tight leading-none text-foreground truncate">
                  {displayName || t('account.profile.yourName')}
                </p>
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <span className="text-sm text-muted-foreground/90">{email}</span>
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary tracking-wide">
                    {t('account.profile.loginEmail')}
                  </span>
                </div>
              </div>

              <Button variant="outline" size="sm" className="rounded-full h-9 px-5 shrink-0 border-border/80 hover:bg-secondary/60 transition-colors w-full sm:w-auto" onClick={handleEditOpen}>
                {t('account.profile.editButton')}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Public Profile Section */}
      <section className="space-y-6">
        <div className="space-y-1 px-1">
          <h2 className="font-serif text-2xl md:text-3xl tracking-tight text-foreground">{t('account.publicProfile.title')}</h2>
          <p className="text-sm text-muted-foreground/90">{t('account.publicProfile.subtitle')}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-6 transition-colors duration-300 hover:border-border/100">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="publicName" className="text-sm font-medium text-foreground">{t('account.publicProfile.publicNameLabel')}</Label>
              <Input
                id="publicName"
                value={publicName}
                onChange={e => setPublicName(e.target.value)}
                placeholder={t('account.publicProfile.publicNamePlaceholder')}
                className="rounded-xl h-10 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
              />
              <p className="text-xs text-muted-foreground/70 pl-0.5">{t('account.publicProfile.canDiffer')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-foreground flex items-center gap-2">
                <MapPin className="size-4 text-muted-foreground/80" />
                {t('account.publicProfile.locationLabel')}
              </Label>
              <Input
                id="location"
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t('account.publicProfile.locationPlaceholder')}
                className="rounded-xl h-10 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-sm font-medium text-foreground">{t('account.publicProfile.bioLabel')}</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder={t('account.publicProfile.bioPlaceholder')}
              className="rounded-xl resize-none min-h-[100px] p-3.5 border-border/80 focus-visible:ring-primary/20 focus-visible:border-primary transition-all leading-relaxed"
              maxLength={160}
            />
            <p className="text-[11px] font-medium text-muted-foreground/60 text-right pr-1">
              {bio.length} / 160 {t('account.publicProfile.characters')}
            </p>
          </div>

          <div className="space-y-3 border-t border-border/40 pt-5">
            <Label className="text-sm font-medium text-foreground pl-0.5">Social Links</Label>
            <div className="rounded-xl bg-secondary/20 p-2 border border-border/30">
              <SocialLinksEditor value={socialLinks} onChange={setSocialLinks} />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border/40">
            <Button className="rounded-full h-10 px-8 shadow-sm font-medium hover:opacity-90 transition-opacity" onClick={handleSave} disabled={isSavingProfile}>
              {isSavingProfile ? t('account.profile.saving') : t('account.profile.saveChanges')}
            </Button>
          </div>
        </div>
      </section>

    </div>
  )
}