"use client"

import { ArrowRight, Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
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

function OptionCard({
  opt,
  loadingMode,
  onCreate,
}: {
  opt: (typeof options)[number]
  loadingMode: ProjectMode | null
  onCreate: (mode: ProjectMode) => void
}) {
  const t = useTranslations()
  const isLoading = loadingMode === opt.mode
  const isDisabled = !!loadingMode

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={() => onCreate(opt.mode)}
      className={cn(
        "group relative flex h-full min-h-[280px] flex-col text-left",
        "rounded-2xl border border-border/50 bg-card p-5 md:p-6",
        "transition-colors duration-300",
        "hover:border-border hover:bg-muted/5",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:pointer-events-none disabled:opacity-40"
      )}
    >
      {/* Top Bar: Number */}
      <div className="flex h-6 items-center justify-between">
        <span className="font-mono text-xs font-medium uppercase tracking-widest text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground">
          {opt.number}
        </span>
      </div>

      {/* Fixed Main Content Area */}
      <div className="mt-6 flex flex-1 flex-col justify-start">
        {/* Title Container with minimum height alignment */}
        <div className="min-h-[3rem] flex items-start">
          <h3 className="font-serif text-2xl font-medium leading-tight tracking-tight text-foreground">
            {t(opt.titleKey)}
          </h3>
        </div>

        {/* Description with fixed clamping and spacing */}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground line-clamp-3">
          {t(opt.descriptionKey)}
        </p>
      </div>

      {/* Bottom Action Section pinned to bottom */}
      <div className="mt-6 flex items-center justify-between border-t border-border/30 pt-4">
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
          {isLoading
            ? t("createCards.creating")
            : t("createCards.create")}
        </span>

        <span
          className={cn(
            "flex size-7 items-center justify-center rounded-xs",
            "border border-border/60",
            "transition-colors duration-300",
            "group-hover:border-primary/40 group-hover:text-primary"
          )}
        >
          {isLoading ? (
            <Loader2 className="size-3.5 animate-spin text-primary" />
          ) : (
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          )}
        </span>
      </div>

      {/* Hover Line */}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-5 h-px w-0 bg-primary transition-[width] duration-300 group-hover:w-8"
      />
    </button>
  )
}

function ModalBody() {
  const { handleCreate, loadingMode } = useCreateProject()
  const t = useTranslations()

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60">
            {t("createModal.description")}
          </span>

          <div className="h-px flex-1 bg-border/60" />
        </div>

        <h2 className="font-serif text-3xl font-medium tracking-tight text-foreground">
          {t("createModal.title")}
        </h2>
      </header>

      {/* Options Grid */}
      <div className="grid gap-2 sm:grid-cols-3 items-stretch">
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

export function NewProjectModal({
  open,
  onOpenChange,
}: NewProjectModalProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        onOpenChange={onOpenChange}
        title="New Project"
        description="Choose your format"
      >
        <ModalBody />
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">New Project</DialogTitle>

      <DialogDescription className="sr-only">
        Choose your format
      </DialogDescription>

      <DialogContent
        className={cn(
          "overflow-hidden rounded-2xl border border-border/40",
          "bg-background p-0 sm:max-w-4xl"
        )}
      >
        <ModalBody />
      </DialogContent>
    </Dialog>
  )
}