'use client'

import { useState } from 'react'
import { Layout, Palette, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils' // Стандартная утилита shadcn для классов

export function StyleSwitcher() {
  const [style, setStyle] = useState('minimal') // 'minimal' или 'vibrant'

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {/* Спокойный стиль */}
        <div
          onClick={() => setStyle('minimal')}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
            style === 'minimal' 
              ? "border-primary bg-primary/5 shadow-sm" 
              : "border-border/40 bg-background/50 hover:border-border hover:bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={cn(
              "rounded-lg p-2",
              style === 'minimal' ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            )}>
              <Layout className="h-4 w-4" />
            </div>
            {style === 'minimal' && <CheckCircle2 className="h-4 w-4 text-primary" />}
          </div>
          <div>
            <p className="text-sm font-semibold">Спокойный</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Минимализм и эстетика. Много свободного места.
            </p>
          </div>
        </div>

        {/* Яркий стиль */}
        <div
          onClick={() => setStyle('vibrant')}
          className={cn(
            "relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200",
            style === 'vibrant' 
              ? "border-orange-500 bg-orange-500/5 shadow-sm" 
              : "border-border/40 bg-background/50 hover:border-border hover:bg-muted/30"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={cn(
              "rounded-lg p-2",
              style === 'vibrant' ? "bg-orange-500/20 text-orange-500" : "bg-muted text-muted-foreground"
            )}>
              <Palette className="h-4 w-4" />
            </div>
            {style === 'vibrant' && <CheckCircle2 className="h-4 w-4 text-orange-500" />}
          </div>
          <div>
            <p className="text-sm font-semibold">Яркий</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              Энергия и краски. Акцент на эмоции и динамику.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}