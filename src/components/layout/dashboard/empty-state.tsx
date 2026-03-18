"use client"

import { BookOpen, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useTranslations } from "next-intl"

export function EmptyState() {
  const { handleCreate, loadingMode } = useCreateProject()
  const loading = loadingMode === "photobook"
  const t = useTranslations()

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl bg-secondary">
        <BookOpen className="size-6 text-primary" />
      </div>
      <h3 className="mt-5 font-serif text-2xl">{t('emptyState.noProjects')}</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        {t('emptyState.description')}
      </p>
      <Button className="mt-6 rounded-full px-8 gap-2" disabled={loading} onClick={() => handleCreate("photobook")}>
        {loading && <Loader2 className="size-4 animate-spin" />}
        {t('emptyState.createMemoryBook')}
      </Button>
    </div>
  )
}
