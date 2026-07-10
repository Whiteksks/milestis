"use client"

import { Loader2, ArrowRight } from "lucide-react"
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { DialogTitle } from "@radix-ui/react-dialog"
import type { ProjectMode } from "@/lib/projects/project-type-config"
import { useTranslations } from "next-intl"

interface NewProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const options: {
  mode: ProjectMode
  number: string
  titleKey: string
  descriptionKey: string
}[] = [
  {
    mode: "photobook",
    number: "01",
    titleKey: "createCards.photobook.title",
    descriptionKey: "createCards.photobook.description",
  },
  {
    mode: "portfolio",
    number: "02",
    titleKey: "createCards.portfolio.title",
    descriptionKey: "createCards.portfolio.description",
  },
  {
    mode: "event",
    number: "03",
    titleKey: "createCards.event.title",
    descriptionKey: "createCards.event.description",
  },
]

function OptionCard({ opt, loadingMode, onCreate }: {
  opt: typeof options[0]
  loadingMode: ProjectMode | null
  onCreate: (mode: ProjectMode) => void
}) {
  const t = useTranslations()
  const isLoading = loadingMode === opt.mode
  const isDisabled = !!loadingMode

  return (
    <button
      disabled={isDisabled}
      onClick={() => onCreate(opt.mode)}
      className={cn(
        "group relative flex flex-col justify-between text-left transition-all duration-500 ease-out",
        "min-h-[240px] sm:min-h-[280px] border border-border/40 p-5 md:p-6",
        "rounded-2xl bg-transparent hover:bg-muted/5 hover:border-border",
        "disabled:opacity-40"
      )}
    >
      {/* Топ: Моноширинный номер */}
      <div className="flex items-center justify-between w-full">
        <span className="font-mono text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground">
          {opt.number}
        </span>
      </div>

      {/* Середина: Заголовок и описание */}
      <div className="mt-6 flex-1">
        <p className="font-serif text-xl font-medium tracking-tight text-foreground md:text-2xl mb-2">
          {t(opt.titleKey)}
        </p>
        <p className="text-xs text-muted-foreground/90 leading-relaxed font-light line-clamp-3">
          {t(opt.descriptionKey)}
        </p>
      </div>

      {/* Низ: Анимированный экшен в углу */}
      <div className="mt-5 flex justify-end h-5 items-center overflow-hidden text-sm font-medium">
        {isLoading ? (
          <span className="flex items-center gap-1.5 text-primary">
            <Loader2 className="size-3.5 animate-spin" />
            <span className="text-[10px] uppercase tracking-wider font-mono">{t('createCards.creating')}</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-muted-foreground transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:text-foreground">
            <span className="text-[10px] uppercase tracking-wider font-mono opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
              {t('createCards.create')}
            </span>
            <ArrowRight className="size-4 text-muted-foreground/60 transition-colors duration-300 group-hover:text-foreground" />
          </span>
        )}
      </div>
    </button>
  )
}

function ModalBody({ onClose: _onClose }: { onClose?: () => void }) {
  const { handleCreate, loadingMode } = useCreateProject()
  const t = useTranslations()

  return (
    <div className="flex flex-col p-6 md:p-10">
      <header className="mb-10 space-y-2.5 text-center sm:text-left">
        <h2 className="font-serif text-3xl font-light tracking-tight italic">
          {t('createModal.title')}
        </h2>
        <div className="h-px w-12 bg-primary/20 mx-auto sm:mx-0" />
        <p className="text-xs text-muted-foreground mt-2">{t('createModal.description')}</p>
      </header>

      {/* Строгая линия из 3-х колонок на десктопе */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {options.map((opt) => (
          <OptionCard
            key={opt.mode}
            opt={opt}
            loadingMode={loadingMode}
            onCreate={handleCreate}
          />
        ))}
      </div>
    </div>
  )
}

export function NewProjectModal({ open, onOpenChange }: NewProjectModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        onOpenChange={onOpenChange}
        title="New Project"
        description="Choose your format"
      >
        <ModalBody onClose={() => onOpenChange(false)} />
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">New Project</DialogTitle>
      <DialogDescription className="sr-only">Choose your format</DialogDescription>
      {/* Немного увеличили ширину до max-w-4xl, чтобы 3 колонки дышали идеально */}
      <DialogContent className="sm:max-w-4xl rounded-3xl border border-border/30 p-0 bg-background overflow-hidden">
        <ModalBody />
      </DialogContent>
    </Dialog>
  )
}