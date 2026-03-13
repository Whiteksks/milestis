'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useUiSelector } from '@/editor/lib/store'
import type { DeviceView } from '@/editor/lib/types'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Monitor, Tablet, Smartphone, Image as ImageIcon, Eye, Upload, Check, Loader2, ChevronRight, Home, CloudUpload } from 'lucide-react'
import { saveProject } from '@/lib/save-project'
import { renameProject } from '@/lib/rename-project'
import { useAutoSave } from '@/hooks/useAutoSave'
import { toastProject } from '@/lib/toast'

interface EditorHeaderProps {
  projectId: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function EditorHeader({ projectId }: EditorHeaderProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const params = useParams()
  const router = useRouter()
  const locale = params.locale as string
  const { save: autoSave, isDirty } = useAutoSave(projectId)

  const { deviceView, setDeviceView, toggleMediaLibrary, projectName, setProjectName, markClean } = useUiSelector((state) => ({
    deviceView: state.deviceView,
    setDeviceView: state.setDeviceView,
    toggleMediaLibrary: state.toggleMediaLibrary,
    projectName: state.projectName,
    setProjectName: state.setProjectName,
    markClean: state.markClean,
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
    try {
      await toastProject.rename(renameProject(projectId, trimmed))
      setProjectName(trimmed)
    } catch {
      setLocalName(projectName ?? '')
    }
  }

  async function handleSave() {
    if (saveState === 'saving') return
    setSaveState('saving')
    try {
      await saveProject(projectId)
      markClean()
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (err) {
      console.error('[Save] Failed to save project:', err)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2000)
    }
  }

  async function handleHomeClick() {
    await autoSave()
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
    <header className="relative h-16 border-b border-border/80 bg-card/95 z-50 shadow-[0_2px_16px_0_hsl(var(--foreground)/0.06)]">
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
          <div className="hidden md:flex items-center gap-0.5 p-1 bg-muted/40 rounded-lg border border-border/30">
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
            className="gap-2 text-muted-foreground hover:text-foreground hidden sm:inline-flex rounded-full h-8 px-4 transition-all text-xs font-medium"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>

          <Separator orientation="vertical" className="h-4 bg-border/40 mx-1 hidden sm:block" />

          <Button
            size="sm"
            className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm hidden sm:inline-flex rounded-full h-8 px-5 transition-all text-xs font-medium"
          >
            <Upload className="h-3 w-3" />
            Publish
          </Button>
        </div>
      </div>
    </header>
  )
}
