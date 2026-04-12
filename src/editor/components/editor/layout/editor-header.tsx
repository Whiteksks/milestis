'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUiSelector } from '@/editor/lib/store'
import type { DeviceView } from '@/editor/lib/types'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Monitor, Tablet, Smartphone, Image as ImageIcon, Eye, Check, Loader2, ChevronRight, Home, CloudUpload, Globe, EyeOff, ChevronDown, Download } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { saveProject } from '@/lib/projects'
import { useAutoSave } from '@/hooks/useAutoSave'
import { projectKeys } from '@/hooks/useProjectsQuery'
import { useUserStore } from '@/hooks/useUserStore'
import { useRenameMutation, useUnpublishMutation } from '@/hooks/useProjectMutations'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ExportModal } from '@/editor/components/modals/export-modal'
import { PublishExportedModal } from '@/editor/components/modals/publish-exported-modal'
import { getProjectConfig } from '@/lib/projects/project-type-config'

interface EditorHeaderProps {
  projectId: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function EditorHeader({ projectId }: EditorHeaderProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [isExportModalOpen, setIsExportModalOpen] = useState(false)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)
  const { save: autoSave, isDirty } = useAutoSave(projectId)
  const renameMutation = useRenameMutation()
  const unpublishMutation = useUnpublishMutation()

  const {
    deviceView, setDeviceView, toggleMediaLibrary, projectName, setProjectName, markClean,
    isPublished, setIsPublished, clearPublishedInfo, publishedSlug, publishedAccessToken, editorMode,
    isExported, setIsPreviewOpen,
  } = useUiSelector((state) => ({
    deviceView: state.deviceView,
    setDeviceView: state.setDeviceView,
    toggleMediaLibrary: state.toggleMediaLibrary,
    projectName: state.projectName,
    setProjectName: state.setProjectName,
    markClean: state.markClean,
    isPublished: state.isPublished,
    setIsPublished: state.setIsPublished,
    clearPublishedInfo: state.clearPublishedInfo,
    publishedSlug: state.publishedSlug,
    publishedAccessToken: state.publishedAccessToken,
    editorMode: state.editorMode,
    isExported: state.isExported,
    setIsPreviewOpen: state.setIsPreviewOpen,
  }))

  const [localName, setLocalName] = useState(projectName ?? '')

  useEffect(() => {
    setLocalName(projectName ?? '')
  }, [projectName])

  // When new changes arrive after a save, reset the check icon back to upload icon
  useEffect(() => {
    if (isDirty && saveState === 'saved') setSaveState('idle')
  }, [isDirty, saveState])

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
    if (saveState === 'saving') return
    setSaveState('saving')
    try {
      await saveProject(projectId)
      markClean()
      setSaveState('saved')
      invalidateProjectsCache()
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (err) {
      console.error('[Save] Failed to save project:', err)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2000)
    }
  }

  async function handleOpenExportModal() {
    // Auto-save before opening the export modal (photobook only).
    if (isDirty) {
      setSaveState('saving')
      try {
        await saveProject(projectId)
        markClean()
        setSaveState('saved')
        invalidateProjectsCache()
        setTimeout(() => setSaveState('idle'), 2000)
      } catch (err) {
        console.error('[Export] Save before export failed:', err)
        setSaveState('error')
        setTimeout(() => setSaveState('idle'), 2000)
        return
      }
    }
    setIsExportModalOpen(true)
  }

  function handleUnpublish() {
    unpublishMutation.mutate(projectId, {
      onSuccess: () => {
        setIsPublished(false)
        clearPublishedInfo()
      },
    })
  }

  async function handleHomeClick() {
    if (isDirty) {
      try {
        await saveProject(projectId)
        markClean()
        invalidateProjectsCache()
      } catch {
        // Keep navigation behavior unchanged if save fails.
      }
    } else {
      await autoSave()
    }
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
  }, [])

  return (
    <header className="relative h-16 border-b border-border bg-editor-surface z-50">
      <div className="h-full flex items-center px-6 justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHomeClick}
            className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground shrink-0"
            title="Back to Dashboard"
          >
            <Home className="size-4" />
          </Button>
          <span className="font-serif text-base font-medium text-foreground tracking-tight select-none shrink-0">
            Milestis
          </span>
          <ChevronRight className="size-4 text-muted-foreground/50 shrink-0" />
          <input
            value={localName}
            onChange={(e) => setLocalName(e.target.value)}
            onBlur={handleRename}
            maxLength={30}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.currentTarget.blur()
              if (e.key === 'Escape') { setLocalName(projectName ?? ''); e.currentTarget.blur() }
            }}
            placeholder="Untitled"
            className="min-w-0 w-32 max-w-[180px] bg-transparent text-sm font-medium text-foreground px-1.5 py-0.5 border-b border-border/50 hover:border-border/80 focus:border-border  focus:outline-none transition-colors truncate"
          />
          {/* Inline save icon — always visible, color reflects save state */}
          <Button
            variant="ghost"
            size="lg"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            title="Save (Ctrl+S)"
            className={[
              'h-8 w-6 rounded-full transition-colors shrink-0',
              saveState === 'saved' ? 'text-emerald-500 hover:text-emerald-500' :
              saveState === 'error' ? 'text-destructive hover:text-destructive' :
              'text-muted-foreground/70 hover:text-foreground',
            ].join(' ')}
          >
            {saveState === 'saving' ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="size-4" />
            ) : (
              <CloudUpload className="size-4.5" />
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
                { id: 'desktop', icon: Monitor, label: 'Desktop' },
                { id: 'tablet', icon: Tablet, label: 'Tablet' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile' },
                { id: 'fullscreen', icon: Monitor, label: 'Full Screen' }
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
            <span className="hidden sm:inline font-medium">Media</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
            className="gap-2 text-muted-foreground hover:text-foreground hidden sm:inline-flex rounded-full h-8 px-4 transition-all text-xs font-medium"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>

          <Separator orientation="vertical" className="h-4 bg-border/40 mx-1 hidden sm:block" />

          {isPublished ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={unpublishMutation.isPending}
                  className="gap-1.5 shadow-sm inline-flex rounded-full h-8 px-2.5 sm:px-5 transition-all text-xs font-medium text-emerald-600 dark:text-emerald-400"
                >
                  {unpublishMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Globe className="h-3 w-3" />
                  )}
                  <span className="hidden sm:inline">Published</span>
                  <ChevronDown className="h-3 w-3 hidden sm:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {publishedSlug && (
                  <DropdownMenuItem
                    onClick={() => {
                      const url =
                        editorMode === 'portfolio'
                          ? `https://${publishedSlug}.milestis.site`
                          : `https://milestis.site/${publishedSlug}?token=${publishedAccessToken ?? ''}`
                      window.open(url, '_blank')
                    }}
                  >
                    <Globe className="size-4" />
                    View site
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleOpenExportModal}>
                  {editorMode === 'portfolio' ? <Globe className="size-4" /> : <Download className="size-4" />}
                  {getProjectConfig(editorMode as 'portfolio' | 'photobook').republishLabel}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleUnpublish} className="text-destructive focus:text-destructive">
                  <EyeOff className="size-4" />
                  Unpublish
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : editorMode === 'portfolio' ? (
            // Portfolio: paid publish modal
            <Button
              size="sm"
              onClick={handleOpenExportModal}
              disabled={saveState === 'saving'}
              className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm inline-flex rounded-full h-8 px-2.5 sm:px-5 transition-all text-xs font-medium"
            >
              <Globe className="h-3 w-3" />
              <span className="hidden sm:inline">Publish</span>
            </Button>
          ) : isExported ? (
            // Photobook exported but not published
            <div className="flex items-center gap-1.5">
              <Button
                size="sm"
                onClick={() => setIsPublishModalOpen(true)}
                className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm inline-flex rounded-full h-8 px-2.5 sm:px-5 transition-all text-xs font-medium"
              >
                <Globe className="h-3 w-3" />
                <span className="hidden sm:inline">Publish</span>
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleOpenExportModal}
                disabled={saveState === 'saving'}
                className="gap-2 text-muted-foreground hover:text-foreground inline-flex rounded-full h-8 px-2.5 sm:px-4 transition-all text-xs font-medium"
              >
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">Re-export</span>
              </Button>
            </div>
          ) : (
            // Photobook not yet exported
            <Button
              size="sm"
              onClick={handleOpenExportModal}
              disabled={saveState === 'saving'}
              className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm inline-flex rounded-full h-8 px-2.5 sm:px-5 transition-all text-xs font-medium"
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">Export PDF</span>
            </Button>
          )}
        </div>
      </div>

      {/* Export / Publish modal (both modes, costs credits) */}
      <ExportModal
        open={isExportModalOpen}
        onOpenChange={setIsExportModalOpen}
        projectId={projectId}
        mode={editorMode as 'portfolio' | 'photobook'}
        isExported={isExported}
      />
      {/* Photobook: publish after export (free) */}
      <PublishExportedModal
        open={isPublishModalOpen && editorMode === 'photobook'}
        onOpenChange={setIsPublishModalOpen}
        projectId={projectId}
        mode="photobook"
      />
    </header>
  )
}
