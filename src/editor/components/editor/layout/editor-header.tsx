'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { useUiSelector } from '@/editor/lib/store'
import { MODE_REGISTRY } from '@/editor/lib/modes'
import type { DeviceView } from '@/editor/lib/types'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Monitor, Tablet, Smartphone, Image as ImageIcon, Eye, Check, Loader2, ChevronRight, Home, CloudUpload, Globe, EyeOff, ChevronDown, RefreshCw, QrCode, SlidersHorizontal, Sparkles, Pencil } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { saveProject } from '@/lib/projects'
import { useAutoSave } from '@/hooks/useAutoSave'
import { projectKeys } from '@/hooks/useProjectsQuery'
import { useUserStore } from '@/hooks/useUserStore'
import { useRenameMutation, useUnpublishMutation } from '@/hooks/useProjectMutations'
import { useUiStore } from '@/editor/lib/store/ui'
import { useContentStore } from '@/editor/lib/store/content'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PublishModal } from '@/editor/components/modals/publish-modal'
import { buildPublishedProjectUrl, getStoredPublishSlug, normalizeSlug } from '@/lib/slug'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import QRCodeSVG from 'react-qr-code'
import { toast } from 'sonner'

interface EditorHeaderProps {
  projectId: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function EditorHeader({ projectId }: EditorHeaderProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const [menuPublishView, setMenuPublishView] = useState<'publish' | 'qr'>('publish')
  const [isQrDialogOpen, setIsQrDialogOpen] = useState(false)
  // Slug pre-filled after returning from a credit topup checkout
  const [afterTopupSlug, setAfterTopupSlug] = useState<string | null>(null)
  const [afterTopupAccessToken, setAfterTopupAccessToken] = useState<string | null>(null)
  const t = useTranslations('editor.layout')
  const tMenuPublish = useTranslations('editor.menu.publish')
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)
  const { isDirty, saveError, isSaving } = useAutoSave(projectId, isPublishModalOpen)
  const renameMutation = useRenameMutation()
  const unpublishMutation = useUnpublishMutation()

  const {
    deviceView, setDeviceView, toggleMediaLibrary, projectName, setProjectName,
    isPublished, setIsPublished, clearPublishedInfo, publishedSlug, publishedAccessToken, editorMode, projectStatus,
    setIsPreviewOpen,
  } = useUiSelector((state) => ({
    deviceView: state.deviceView,
    setDeviceView: state.setDeviceView,
    toggleMediaLibrary: state.toggleMediaLibrary,
    projectName: state.projectName,
    setProjectName: state.setProjectName,
    isPublished: state.isPublished,
    setIsPublished: state.setIsPublished,
    clearPublishedInfo: state.clearPublishedInfo,
    publishedSlug: state.publishedSlug,
    publishedAccessToken: state.publishedAccessToken,
    editorMode: state.editorMode,
    projectStatus: state.projectStatus,
    setIsPreviewOpen: state.setIsPreviewOpen,
  }))

  const setIsModerationOpen = useUiStore((s) => s.setIsModerationOpen)
  const setIsAiChatOpen = useUiStore((s) => s.setIsAiChatOpen)
  const eventPhotosCount    = useContentStore((s) => s.eventPhotos.length)
  const hasAiGenerated = useAiBriefStore((s) => s.hasGenerated)

  const [localName, setLocalName] = useState(projectName ?? '')
  const [isRenamePopoverOpen, setIsRenamePopoverOpen] = useState(false)

  const modeUiConfig = MODE_REGISTRY[editorMode].uiConfig

  useEffect(() => {
    setLocalName(projectName ?? '')
  }, [projectName])

  // When new changes arrive after a save, reset the check icon back to upload icon
  useEffect(() => {
    if (isDirty && saveState === 'saved') setSaveState('idle')
  }, [isDirty, saveState])

  // Detect return from Polar credit topup checkout and auto-open publish modal
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    if (params.get('afterTopup') !== '1') return
    const slug = params.get('slug') ?? ''
    if (!slug) return
    const accessToken = params.get('accessToken')
    // Clean up URL so refreshing doesn't re-trigger
    window.history.replaceState({}, '', window.location.pathname)
    setAfterTopupSlug(slug)
    setAfterTopupAccessToken(accessToken)
    setIsPublishModalOpen(true)
  }, []) // mount only

  async function handleRename() {
    const trimmed = localName.trim()
    if (!trimmed) { setLocalName(projectName ?? ''); return }
    if (trimmed === projectName) return
    renameMutation.mutate(
      { projectId, name: trimmed },
      {
        onSuccess: () => setProjectName(trimmed),
        onError: () => setLocalName(projectName ?? ''),
      }
    )
  }

  function invalidateProjectsCache() {
    if (uid) void queryClient.invalidateQueries({ queryKey: projectKeys.active(uid) })
  }

  async function handleSave() {
    if (isPublishModalOpen || saveState === 'saving') return
    setSaveState('saving')
    try {
      await saveProject(projectId)
      setSaveState(useUiStore.getState().isDirty ? 'idle' : 'saved')
      invalidateProjectsCache()
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (err) {
      console.error('[Save] Failed to save project:', err)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2000)
    }
  }

  async function handleOpenPublishModal() {
    setMenuPublishView('publish')
    // Auto-save before publishing.
    if (isDirty) {
      setSaveState('saving')
      try {
        await saveProject(projectId)
        if (useUiStore.getState().projectId !== projectId) return
        if (useUiStore.getState().isDirty) { setSaveState('idle'); return }
        setSaveState('saved')
        invalidateProjectsCache()
        setTimeout(() => setSaveState('idle'), 2000)
      } catch (err) {
        console.error('[Publish] Save before publish failed:', err)
        setSaveState('error')
        setTimeout(() => setSaveState('idle'), 2000)
        return
      }
    }
    setIsPublishModalOpen(true)
  }

  function handleUnpublish() {
    unpublishMutation.mutate(projectId, {
      onSuccess: () => {
        setIsPublished(false)
        if (editorMode !== 'menu') clearPublishedInfo()
      },
    })
  }

  function handleRepublish() {
    void handleOpenPublishModal()
  }

  async function handleHomeClick() {
    if (isDirty) {
      try {
        await saveProject(projectId)
        invalidateProjectsCache()
      } catch {
        setSaveState('error')
        toast.error(t('header.saveFailed'))
        return
      }
    }
    if (useUiStore.getState().projectId !== projectId || useUiStore.getState().isDirty) return
    router.push(`/${locale}/dashboard`)
  }

  // Ctrl+S / Cmd+S — triggers full visual animation
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, saveState, isPublishModalOpen])

  return (
    <header className="relative h-16 border-b border-border bg-editor-surface z-50">
      <div className="h-full flex items-center px-2 md:px-6 justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHomeClick}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0"
            title={t('header.backToDashboard')}
          >
            <Home className="size-4" />
          </Button>
          <span className="hidden sm:inline font-serif text-base font-medium text-foreground tracking-tight select-none shrink-0">
            Milestis
          </span>
          <ChevronRight className="hidden sm:block size-4 text-muted-foreground/50 shrink-0" />
          <input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleRename}
            maxLength={30}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
              if (e.key === 'Escape') { setLocalName(projectName ?? ''); e.currentTarget.blur() }
            }}
            placeholder={t('header.projectNamePlaceholder')}
            className="hidden sm:block min-w-0 w-32 max-w-[180px] bg-transparent text-sm font-medium text-foreground px-1.5 py-0.5 border-b border-border/50 hover:border-border/80 focus:border-border focus:outline-none transition-colors truncate"
          />
          {/* Mobile: project name field takes up too much header space — collapse it into an icon
              that opens a small popover with the rename input instead. */}
          <Popover open={isRenamePopoverOpen} onOpenChange={setIsRenamePopoverOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0 sm:hidden"
                title={t('header.projectNamePlaceholder')}
              >
                <Pencil className="size-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-56 p-2">
              <input
                autoFocus
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                onBlur={handleRename}
                maxLength={30}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.currentTarget.blur()
                  if (e.key === 'Escape') setLocalName(projectName ?? '')
                  if (e.key === 'Enter' || e.key === 'Escape') { e.currentTarget.blur(); setIsRenamePopoverOpen(false) }
                }}
                placeholder={t('header.projectNamePlaceholder')}
                className="w-full bg-transparent text-sm font-medium text-foreground px-2 py-1.5 border-b border-border/50 focus:border-border focus:outline-none transition-colors"
              />
            </PopoverContent>
          </Popover>
          {/* Inline save icon — always visible, color reflects save state */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handleSave}
            disabled={saveState === 'saving' || isSaving}
            title={saveError || saveState === 'error' ? t('header.saveFailed') : saveState === 'idle' && isDirty ? t('header.unsavedChanges') : t('header.saveShortcut')}
            className={[
              'relative h-8 w-6 rounded-full transition-colors shrink-0',
              saveState === 'saved' ? 'text-emerald-500 hover:text-emerald-500' :
              saveState === 'error' || saveError ? 'text-destructive hover:text-destructive' :
              saveState === 'idle' && isDirty ? 'text-amber-500 hover:text-amber-500' :
              'text-muted-foreground/70 hover:text-foreground',
            ].join(' ')}
          >
            {saveState === 'saving' || isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="size-4" />
            ) : (
              <CloudUpload className="size-4.5" />
            )}
            {saveState === 'idle' && isDirty && (
              <span className="absolute top-0.5 right-0 h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            )}
          </Button>
        </div>

        {/* CENTER — VIEWPORT */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="hidden md:flex items-center gap-0.5 p-1 bg-muted/70 rounded-lg border border-border/60">
            <ToggleGroup
              type="single"
              value={deviceView}
              onValueChange={(v) => { if (v) setDeviceView(v as DeviceView) }}
              className="gap-2"
            >
              {[
                { id: 'desktop', icon: Monitor, label: t('header.desktop') },
                { id: 'tablet', icon: Tablet, label: t('header.tablet') },
                { id: 'mobile', icon: Smartphone, label: t('header.mobile') },
                { id: 'fullscreen', icon: Monitor, label: t('header.fullscreen') }
              ].map(({ id, icon: Icon, label }) => (
                <ToggleGroupItem
                  key={id}
                  value={id}
                  title={label}
                  className="h-6 w-6 !rounded-lg data-[state=on]:bg-accent/80 text-muted-foreground hover:text-foreground data-[state=on]:text-foreground"
                >
                  <Icon className="size-4" />
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-1.5">
          {!modeUiConfig.hideMediaButton && !modeUiConfig.hideAiButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAiChatOpen(true)}
              className="relative hidden md:inline-flex gap-2 text-primary hover:bg-primary/15 hover:text-primary rounded-full h-8 px-4 transition-all text-xs"
              title={t('header.aiAssistant')}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline font-medium">{t('header.aiAssistant')}</span>
              {!hasAiGenerated && (
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
              )}
            </Button>
          )}

          {!modeUiConfig.hideMediaButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.currentTarget.blur()
                toggleMediaLibrary()
              }}
              className="gap-2 text-muted-foreground hover:text-foreground rounded-full h-8 px-4 transition-all text-xs"
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline font-medium">{t('header.media')}</span>
            </Button>
          )}

          {!modeUiConfig.hidePreviewButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(true)}
              className="gap-2 text-muted-foreground hover:text-foreground inline-flex rounded-full h-8 px-2.5 sm:px-4 transition-all text-xs font-medium"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('header.preview')}</span>
            </Button>
          )}

          {editorMode === 'event' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsModerationOpen(true)}
              disabled={eventPhotosCount === 0}
              title={t('header.moderation')}
              className="gap-2 text-muted-foreground hover:text-foreground rounded-full h-8 px-2.5 sm:px-4 transition-all text-xs font-medium disabled:opacity-40"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t('header.moderation')}</span>
            </Button>
          )}

          <Separator orientation="vertical" className="h-4 bg-border/40 mx-1 hidden sm:block" />

          {modeUiConfig.hidePublishButton ? null : isPublished ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={unpublishMutation.isPending}
                  className="gap-1.5 shadow-sm inline-flex rounded-full h-8 px-3 sm:px-5 transition-all text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  {unpublishMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  <span>{t('header.published')}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {editorMode === 'menu' && <>
                  <DropdownMenuItem onClick={() => { setMenuPublishView('publish'); setIsPublishModalOpen(true) }}>
                    <RefreshCw className="size-4" />
                    {tMenuPublish('updateTitle')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setMenuPublishView('qr'); setIsPublishModalOpen(true) }}>
                    <QrCode className="size-4" />
                    {tMenuPublish('download')}
                  </DropdownMenuItem>
                </>}
                {publishedSlug && (
                  <DropdownMenuItem
                    onClick={() => {
                      const url = buildPublishedProjectUrl(
                        editorMode,
                        publishedSlug,
                        publishedAccessToken,
                      )
                      window.open(url, '_blank')
                    }}
                  >
                    <Globe className="size-4" />
                    {t('header.viewSite')}
                  </DropdownMenuItem>
                )}
                {editorMode === 'event' && publishedSlug && (
                  <DropdownMenuItem onClick={() => setIsQrDialogOpen(true)}>
                    <QrCode className="size-4" />
                    {t('header.showQrCode')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleUnpublish} className="text-destructive focus:text-destructive">
                  <EyeOff className="size-4" />
                  {t('header.unpublish')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : projectStatus === 'archived' ? (
            <Button
              size="sm"
              onClick={handleRepublish}
              disabled={saveState === 'saving'}
              className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm inline-flex rounded-full h-8 px-3 sm:px-5 transition-all text-xs font-medium"
            >
              <RefreshCw className="h-3 w-3" />
              <span>{t('header.republish')}</span>
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleOpenPublishModal}
              disabled={saveState === 'saving'}
              className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm inline-flex rounded-full h-8 px-3 sm:px-5 transition-all text-xs font-medium"
            >
              <Globe className="h-3 w-3" />
              <span>{t('header.publish')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Shared publication window; each mode owns its publishing flow. */}
      <PublishModal
        open={isPublishModalOpen}
        onOpenChange={(o) => {
          setIsPublishModalOpen(o)
          if (!o) {
            setAfterTopupSlug(null)
            setAfterTopupAccessToken(null)
          }
        }}
        projectId={projectId}
        mode={editorMode}
        menuView={menuPublishView}
        initialSlug={afterTopupSlug ?? getStoredPublishSlug(projectId) ?? (editorMode !== 'portfolio' ? (normalizeSlug(projectName ?? '') || undefined) : undefined)}
        initialAccessToken={afterTopupAccessToken ?? undefined}
        autoAdvance={afterTopupSlug !== null}
        republishMode={projectStatus === 'archived' && !isPublished}
      />

      {/* QR code dialog for event mode */}
      {editorMode === 'event' && publishedSlug && publishedAccessToken && (
        <Dialog open={isQrDialogOpen} onOpenChange={setIsQrDialogOpen}>
          <DialogContent className="flex flex-col items-center gap-6 max-w-xs">
            <DialogHeader>
              <DialogTitle>{t('header.qrCodeTitle')}</DialogTitle>
            </DialogHeader>
            <div className="bg-white p-4 rounded-xl">
              <QRCodeSVG
                value={buildPublishedProjectUrl('event', publishedSlug, publishedAccessToken)}
                size={220}
              />
            </div>
            <p className="text-xs text-muted-foreground text-center break-all">
              {buildPublishedProjectUrl('event', publishedSlug, publishedAccessToken)}
            </p>
          </DialogContent>
        </Dialog>
      )}
    </header>
  )
}
