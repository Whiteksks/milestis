"use client"

import { useState } from "react"
import { doc, updateDoc, serverTimestamp } from "firebase/firestore"
import { useTranslations } from "next-intl"
import { ArrowRight, Loader2, PartyPopper } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"
import { Button } from "@/components/ui/button"
import { db } from "@/lib/firebase"
import { useIsMobile } from "@/hooks/use-mobile"
import { useCreateProject } from "@/hooks/useCreateProject"
import { selectCurrentUid, selectProfileHydrating, useUserStore } from "@/hooks/useUserStore"

async function markWelcomeSeen(uid: string) {
  try {
    await updateDoc(doc(db, "users", uid), {
      "settings.hasSeenWelcome": true,
      updatedAt: serverTimestamp(),
    })
  } catch {
    // Non-critical — worst case the modal reappears on next load.
  }
}

function WelcomeModalBody({ onDismiss }: { onDismiss: () => void }) {
  const t = useTranslations()
  const { handleCreate, loadingMode } = useCreateProject()
  const isCreating = loadingMode !== null

  return (
    <div className="p-6 md:p-8 text-center space-y-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto">
        <PartyPopper className="h-8 w-8 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          {t("welcomeModal.title")}
        </h2>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("welcomeModal.description")}
        </p>
      </div>

      <div className="space-y-3">
        <Button
          onClick={() => { onDismiss(); handleCreate("photobook") }}
          disabled={isCreating}
          className="w-full h-12 text-base font-semibold rounded-xl group"
        >
          {isCreating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          {t("welcomeModal.cta")}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
        <button
          type="button"
          onClick={onDismiss}
          className="w-full text-center text-xs font-light text-muted-foreground/70 underline underline-offset-4 transition-colors hover:text-foreground"
        >
          {t("welcomeModal.dismiss")}
        </button>
      </div>
    </div>
  )
}

export function WelcomeModal() {
  const uid = useUserStore(selectCurrentUid)
  const hydrating = useUserStore(selectProfileHydrating)
  const hasSeenWelcome = useUserStore((state) => state.profile?.settings?.hasSeenWelcome)
  const isMobile = useIsMobile()
  // Local dismiss so the dialog closes instantly, before the Firestore write round-trips.
  const [dismissed, setDismissed] = useState(false)

  const open = !hydrating && !!uid && hasSeenWelcome === false && !dismissed

  const handleDismiss = () => {
    setDismissed(true)
    if (uid) void markWelcomeSeen(uid)
  }

  if (isMobile) {
    return (
      <MobileDrawer open={open} onOpenChange={(next) => { if (!next) handleDismiss() }}>
        <WelcomeModalBody onDismiss={handleDismiss} />
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) handleDismiss() }}>
      <DialogTitle className="sr-only">Welcome</DialogTitle>
      <DialogDescription className="sr-only">Welcome to Milestis</DialogDescription>
      <DialogContent className="overflow-hidden rounded-2xl border border-border/40 bg-background p-0 sm:max-w-md">
        <WelcomeModalBody onDismiss={handleDismiss} />
      </DialogContent>
    </Dialog>
  )
}
