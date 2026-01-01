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
    <header className="relative h-16 border-b border-slate-100 bg-white/80 backdrop-blur-xl z-50">
      <div className="h-full flex items-center px-6 justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-6">
          <div className="flex flex-col justify-center">
            <h1 className="text-sm font-medium text-slate-900 tracking-tight">
              Photobook Editor
            </h1>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Design your portfolio
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-0.5 p-1 bg-slate-100/60 rounded-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditorMode('portfolio')}
              className={cn(
                'h-7 px-4 rounded-full text-xs font-medium transition-all',
                editorMode === 'portfolio'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Portfolio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditorMode('photobook')}
              className={cn(
                'h-7 px-4 rounded-full text-xs font-medium transition-all',
                editorMode === 'photobook'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              )}
            >
              Photobook
            </Button>
          </div>
        </div>

        {/* CENTER — VIEWPORT */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="hidden md:flex items-center gap-0.5 p-1 bg-slate-100/60 rounded-full">
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
                  'h-7 px-3 rounded-full transition-all',
                  deviceView === id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-400 hover:text-slate-900'
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
            className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 rounded-full h-9 px-4"
          >
            <ImageIcon className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-medium">Media</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 hidden sm:inline-flex rounded-full h-9 px-4"
          >
            <Eye className="h-4 w-4" />
            <span className="text-xs font-medium">Preview</span>
          </Button>

          <div className="w-px h-4 bg-slate-200 mx-1 hidden sm:block" />

          <Button
            size="sm"
            className="gap-2 bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 hidden sm:inline-flex rounded-full h-9 px-5 transition-all hover:scale-105 active:scale-95"
          >
            <Upload className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">Publish</span>
          </Button>

          {/* Mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 sm:hidden rounded-full"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            className="h-9 w-9 sm:hidden bg-slate-900 rounded-full"
          >
            <Upload className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
