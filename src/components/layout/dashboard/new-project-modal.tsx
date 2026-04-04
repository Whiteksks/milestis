"use client"

import { Loader2, ArrowRight } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { MobileDrawer } from "@/components/ui/custom/mobile-drawer"
import { useCreateProject } from "@/hooks/useCreateProject"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { DialogTitle } from "@radix-ui/react-dialog"

interface NewProjectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type ProjectMode = "portfolio" | "photobook"

const options: {
  mode: ProjectMode
  title: string
  description: string
}[] = [
  {
    mode: "photobook",
    title: "Memory Book",
    description: "A timeless digital experience to preserve your most cherished stories.",
  },
  {
    mode: "portfolio",
    title: "Portfolio site",
    description: "A sleek, modern website to showcase your work and achievements.",
  },
]

function OptionCard({ opt, loadingMode, onCreate }: {
  opt: typeof options[0]
  loadingMode: ProjectMode | null
  onCreate: (mode: ProjectMode) => void
}) {
  const isLoading = loadingMode === opt.mode
  const isDisabled = !!loadingMode

  return (
    <button
      disabled={isDisabled}
      onClick={() => onCreate(opt.mode)}
      className={cn(
        "group relative flex flex-col justify-between gap-10 border border-border/40 p-8 text-left transition-all duration-300",
        "rounded-2xl hover:bg-accent/30 hover:border-border/80 hover:shadow-sm",
        "disabled:opacity-40"
      )}
    >
      {/* Топ: Текст */}
      <div className="space-y-2">
        <p className="font-serif text-2xl font-medium tracking-tight italic">
          {opt.title}
        </p>
        <p className="text-base text-muted-foreground/90 leading-relaxed font-light max-w-[280px]">
          {opt.description}
        </p>
      </div>

      {/* Низ: Кнопка */}
      <div className="flex items-center gap-2 text-sm font-medium tracking-wide">
        {isLoading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <>
            <span>Create</span>
            <ArrowRight className="size-4 opacity-70 transition-transform duration-300 group-hover:translate-x-1" />
          </>
        )}
      </div>
    </button>
  )
}

function ModalBody({ onClose }: { onClose?: () => void }) {
  const { handleCreate, loadingMode } = useCreateProject()

  return (
    <div className="flex flex-col p-4 md:p-8">
      <header className="mb-14 space-y-2.5 text-center sm:text-left">
        <h2 className="font-serif text-3xl font-light tracking-tight italic">
          New Creation
        </h2>
        <div className="h-px w-14 bg-primary/20 mx-auto sm:mx-0" />
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
      <DialogContent className="sm:max-w-3xl rounded-3xl border border-border/30 p-0 bg-background overflow-hidden">
        <ModalBody />
      </DialogContent>
    </Dialog>
  )
}