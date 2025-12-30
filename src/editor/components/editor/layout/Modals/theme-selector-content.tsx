'use client'

import { useThemeStore } from '@/editor/lib/store'
import { themes } from '@/editor/lib/themes'
import type { Theme } from '@/editor/lib/types'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface ThemeSelectorContentProps {
  onClose?: () => void
}

export function ThemeSelectorContent({ onClose }: ThemeSelectorContentProps) {
  const { currentTheme, setTheme } = useThemeStore()

  const handleSelectTheme = (themeId: Theme) => {
    setTheme(themeId)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {themes.map((theme) => {
          const isSelected = currentTheme === theme.id

          return (
            <button
              key={theme.id}
              onClick={() => handleSelectTheme(theme.id as Theme)}
              className={cn(
                'group relative flex flex-col items-stretch text-left rounded-2xl transition-all duration-300 overflow-hidden border',
                isSelected
                  ? 'border-slate-900 shadow-sm ring-1 ring-slate-900/5'
                  : 'border-slate-100 hover:border-slate-200 hover:shadow-lg hover:shadow-slate-900/5 hover:-translate-y-0.5 bg-white'
              )}
            >
              {/* Preview Section */}
              <div 
                className={cn(
                  "h-32 w-full flex flex-col items-center justify-center relative border-b border-black/5 transition-transform duration-500 group-hover:scale-105",
                  theme.background,
                  theme.foreground,
                  theme.fontTitle
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-slate-900 text-white shadow-sm rounded-full p-1.5 z-10 animate-in fade-in zoom-in duration-200">
                    <Check className="h-3 w-3" />
                  </div>
                )}

                <div className="space-y-2 opacity-90 scale-90">
                  <div className="text-xs font-medium tracking-wide text-center uppercase">
                    {theme.name}
                  </div>
                  <div className={cn('h-1 w-12 mx-auto rounded-full opacity-80', theme.primary)}></div>
                  <div className="flex gap-1.5 justify-center mt-3 opacity-40">
                    <div className="h-2 w-12 bg-current rounded-sm" />
                    <div className="h-2 w-6 bg-current rounded-sm" />
                  </div>
                </div>
              </div>
              
              {/* Info Section */}
              <div className="p-4 bg-white relative z-10">
                <h3 className={cn(
                  "font-medium text-sm transition-colors tracking-tight",
                  isSelected ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
                )}>
                  {theme.name}
                </h3>
                <p className="text-[11px] text-slate-400 line-clamp-1 mt-1 font-medium">
                  {theme.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>

      {onClose && (
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
          >
            Close
          </Button>
        </div>
      )}
    </div>
  )
}