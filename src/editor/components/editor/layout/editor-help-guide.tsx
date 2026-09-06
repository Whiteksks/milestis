'use client'

import { useState } from 'react'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { Sparkles, LayoutList, Wand2, Link2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { DrawerClose } from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { db } from '@/lib/firebase'
import { useIsMobile } from '@/hooks/use-mobile'
import { selectCurrentUid, selectProfileHydrating, useUserStore } from '@/hooks/useUserStore'
import { useUiSelector } from '@/editor/lib/store'
import { useUiStore } from '@/editor/lib/store/ui'
import { useModeSections } from '@/editor/hooks/use-mode-sections'
import { MODE_REGISTRY } from '@/editor/lib/modes'
import { MobileDrawer } from './mobile/mobile-drawer'

async function markEditorHelpSeen(uid: string) {
  try {
    await updateDoc(doc(db, 'users', uid), {
      'settings.hasSeenEditorHelp': true,
      updatedAt: serverTimestamp(),
    })
  } catch {
    // Non-critical — worst case the guide reappears on next visit.
  }
}

function GuideBlock({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        {icon}
        {title}
      </h3>
      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  )
}

function EditorHelpGuideBody() {
  const t = useTranslations('editor.layout.helpGuide')
  const { editorMode, sections } = useModeSections()
  const isPortfolio = editorMode === 'portfolio'
  const hideSectionsTab = MODE_REGISTRY[editorMode].uiConfig.hideSectionsTab

  return (
    <div className="space-y-5 px-4 pb-2 sm:px-0">
      <GuideBlock icon={<Sparkles className="h-4 w-4 text-primary" />} title={t('aiTitle')} body={t('aiBody')} />
      <GuideBlock icon={<Wand2 className="h-4 w-4 text-primary" />} title={t('featuresTitle')} body={t('featuresBody')} />

      {!hideSectionsTab && (
        <div>
          <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <LayoutList className="h-4 w-4 text-primary" />
            {t('sectionsTitle')}
          </h3>
          <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
            {t(isPortfolio ? 'sectionsBodyPortfolio' : 'sectionsBodyPhotobook')}
          </p>
          {sections.length > 0 && (
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {sections.map((section) => (
                <li
                  key={section.id}
                  className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs text-foreground/80"
                >
                  {section.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <GuideBlock
        icon={<Link2 className="h-4 w-4 text-primary" />}
        title={t('linkTitle')}
        body={t(isPortfolio ? 'linkBodyPortfolio' : 'linkBodyPhotobook')}
      />

      <p className="text-xs text-muted-foreground/80 leading-relaxed">
        {t.rich('policyBody', {
          policy_link: (chunks) => (
            <Link
              href="/policies/acceptable-use-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-foreground transition-colors"
            >
              {chunks}
            </Link>
          ),
        })}
      </p>
    </div>
  )
}

/**
 * Persistent help trigger that explains what the AI assistant does vs. what the user edits
 * themselves per section. Auto-opens once per user on their first editor visit
 * (settings.hasSeenEditorHelp). Desktop trigger is a floating button; on mobile the trigger
 * lives in the bottom sheet's nav bar instead (see mobile-editor-sheet.tsx) so it doesn't sit
 * on top of the canvas — both drive the same isHelpGuideOpen store flag.
 */
export function EditorHelpGuide() {
  const t = useTranslations('editor.layout.helpGuide')
  const uid = useUserStore(selectCurrentUid)
  const hydrating = useUserStore(selectProfileHydrating)
  const hasSeenEditorHelp = useUserStore((state) => state.profile?.settings?.hasSeenEditorHelp)
  const isPreviewOpen = useUiSelector((state) => state.isPreviewOpen)
  const isMobile = useIsMobile()

  const isHelpGuideOpen = useUiSelector((state) => state.isHelpGuideOpen)
  const setIsHelpGuideOpen = useUiStore((s) => s.setIsHelpGuideOpen)

  // Local dismiss so the dialog closes instantly, before the Firestore write round-trips.
  const [autoOpenDismissed, setAutoOpenDismissed] = useState(false)

  const shouldAutoOpen = !hydrating && !!uid && hasSeenEditorHelp !== true && !autoOpenDismissed
  const open = (shouldAutoOpen || isHelpGuideOpen) && !isPreviewOpen

  function handleClose() {
    setIsHelpGuideOpen(false)
    if (shouldAutoOpen) {
      setAutoOpenDismissed(true)
      if (uid) void markEditorHelpSeen(uid)
    }
  }

  return (
    <>
      {/* Desktop trigger lives in the left floating actions group (floating-design-buttons.tsx);
          mobile trigger lives in the bottom sheet's nav bar (mobile-editor-sheet.tsx). */}

      {isMobile ? (
        <MobileDrawer
          open={open}
          onOpenChange={(next) => { if (!next) handleClose() }}
          title={t('title')}
          showHeader
          footer={
            <DrawerClose asChild>
              <Button className="w-full">{t('gotIt')}</Button>
            </DrawerClose>
          }
        >
          <EditorHelpGuideBody />
        </MobileDrawer>
      ) : (
        <Dialog open={open} onOpenChange={(next) => { if (!next) handleClose() }}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t('title')}</DialogTitle>
              <DialogDescription className="sr-only">{t('title')}</DialogDescription>
            </DialogHeader>
            <EditorHelpGuideBody />
            <Button onClick={handleClose} className="w-full">{t('gotIt')}</Button>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
