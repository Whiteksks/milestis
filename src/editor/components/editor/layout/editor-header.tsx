'use client'

import { useState } from 'react'
import { useUiSelector } from '@/editor/lib/store'
import type { DeviceView } from '@/editor/lib/types'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { Monitor, Tablet, Smartphone, Image as ImageIcon, Eye, Upload, Save, Check, Loader2 } from 'lucide-react'
import { saveProject } from '@/lib/save-project'

interface EditorHeaderProps {
  projectId: string
}

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function EditorHeader({ projectId }: EditorHeaderProps) {
  const [saveState, setSaveState] = useState<SaveState>('idle')

  const { deviceView, setDeviceView, toggleMediaLibrary } = useUiSelector((state) => ({
    deviceView: state.deviceView,
    setDeviceView: state.setDeviceView,
    toggleMediaLibrary: state.toggleMediaLibrary,
  }))

  async function handleSave() {
    if (saveState === 'saving') return
    setSaveState('saving')
    try {
      await saveProject(projectId)
      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)
    } catch (err) {
      console.error('[Save] Failed to save project:', err)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 2500)
    }
  }

  return (
    <header className="relative h-16 border-b border-border/80 bg-card/95 z-50 shadow-[0_2px_16px_0_hsl(var(--foreground)/0.06)]">
      <div className="h-full flex items-center px-6 justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-5">
          <span className="font-serif text-base font-medium text-foreground tracking-tight select-none">
            Milestis
          </span>
        </div>

        {/* CENTER — VIEWPORT */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="hidden md:flex items-center gap-0.5 p-1 bg-muted/40 rounded-2xs border border-border/30">
            <ToggleGroup
              type="single"
              value={deviceView}
              onValueChange={(v) => { if (v) setDeviceView(v as DeviceView) }}
              className="gap-0"
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
                  className="h-6 w-8 p-0 rounded-full data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow-sm data-[state=off]:text-muted-foreground hover:text-foreground border-0"
                >
                  <Icon className="h-3.5 w-3.5" />
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
            variant="ghost"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className={[
              "gap-2 hidden sm:inline-flex rounded-full h-8 px-4 transition-all text-xs font-medium",
              saveState === 'saved'
                ? "text-emerald-600 hover:text-emerald-600"
                : saveState === 'error'
                ? "text-destructive hover:text-destructive"
                : "text-muted-foreground hover:text-foreground"
            ].join(' ')}
          >
            {saveState === 'saving' ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            {saveState === 'saving' ? 'Saving…' : saveState === 'saved' ? 'Saved' : saveState === 'error' ? 'Error' : 'Save'}
          </Button>

          <Separator orientation="vertical" className="h-4 bg-border/40 mx-1 hidden sm:block" />

          <Button
            size="sm"
            className="gap-2 bg-foreground hover:bg-foreground/85 text-background shadow-sm hidden sm:inline-flex rounded-full h-8 px-5 transition-all text-xs font-medium"
          >
            <Upload className="h-3 w-3" />
            Publish
          </Button>

          {/* Mobile */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSave}
            disabled={saveState === 'saving'}
            className="h-8 w-8 sm:hidden rounded-full text-muted-foreground"
          >
            {saveState === 'saving' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : saveState === 'saved' ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Save className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  )
}
