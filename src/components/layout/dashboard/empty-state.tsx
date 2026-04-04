"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useTranslations } from "next-intl"

export function EmptyState() {
  const { handleCreate, loadingMode } = useCreateProject()
  const loading = loadingMode === "photobook"
  const t = useTranslations()

  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center p-4 text-center">
      
      {/* Минималистичный акцент: просто тонкая линия вместо иконок и фонов */}
      <div className="mb-12 h-px w-8 bg-foreground/20" />

      <div className="max-w-[300px] space-y-4">
        <h3 className="font-serif text-3xl font-light tracking-tight">
          {t('emptyState.noProjects')}
        </h3>
        
        <p className="text-sm font-light leading-relaxed text-muted-foreground/60">
          {t('emptyState.description')}
        </p>
      </div>

      <div className="mt-12">
        <Button 
          variant="outline"
          className="h-11 rounded-full border-foreground/10 px-8 text-xs uppercase tracking-[0.15em] font-medium transition-colors hover:bg-foreground hover:text-background"
          disabled={loading} 
          onClick={() => handleCreate("photobook")}
        >
          {loading && <Loader2 className="mr-2 size-3 animate-spin" />}
          {t('emptyState.createMemoryBook')}
        </Button>
      </div>
    </div>
  )
}