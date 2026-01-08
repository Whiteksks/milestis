'use client'

import { useUiSelector } from '@/editor/lib/store'
import { Button } from '@/components/ui/button'
import { Monitor, Tablet, Smartphone, Image as ImageIcon, Eye, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EditorHeader() {
  const { deviceView, setDeviceView, toggleMediaLibrary, editorMode, setEditorMode } = useUiSelector((state) => ({
    deviceView: state.deviceView,
    setDeviceView: state.setDeviceView,
    toggleMediaLibrary: state.toggleMediaLibrary,
    editorMode: state.editorMode,
    setEditorMode: state.setEditorMode,
  }))

  return (
    <header className="relative h-16 border-b border-border/40 bg-background/80 backdrop-blur-xl z-50">
      <div className="h-full flex items-center px-6 justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col justify-center">
            <h1 className="text-sm font-semibold text-foreground tracking-tight">
              Photobook Editor
            </h1>
            <p className="text-[10px] text-muted-foreground font-medium">
              Design your portfolio
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditorMode('portfolio')}
              className={cn(
                'h-7 px-4 rounded-lg text-xs font-medium transition-all',
                editorMode === 'portfolio'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              Portfolio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditorMode('photobook')}
              className={cn(
                'h-7 px-4 rounded-lg text-xs font-medium transition-all',
                editorMode === 'photobook'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              )}
            >
              Photobook
            </Button>
          </div>
        </div>

        {/* CENTER — VIEWPORT */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="hidden md:flex items-center gap-1 p-1 bg-muted/50 rounded-xl">
            {[
              { id: 'desktop', icon: Monitor, label: 'Desktop' },
              { id: 'tablet', icon: Tablet, label: 'Tablet' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' },
              { id: 'fullscreen', icon: Monitor, label: 'Full Screen' }
            ].map(({ id, icon: Icon, label }) => (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => setDeviceView(id as any)}
                className={cn(
                  'h-7 px-3 rounded-lg transition-all',
                  deviceView === id
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="ml-2 hidden lg:inline text-xs font-medium">
                  {label}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMediaLibrary}
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl h-9 px-4 transition-all"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Media</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 hidden sm:inline-flex rounded-xl h-9 px-4 transition-all"
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Preview</span>
          </Button>

          <div className="w-px h-4 bg-border/50 mx-1 hidden sm:block" />

          <Button
            size="sm"
            className="gap-2 bg-foreground hover:bg-foreground/90 text-background shadow-md hidden sm:inline-flex rounded-xl h-9 px-5 transition-all"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Publish</span>
          </Button>

          {/* Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:hidden rounded-xl text-muted-foreground"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 sm:hidden bg-foreground text-background rounded-xl"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
