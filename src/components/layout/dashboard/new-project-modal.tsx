"use client"

import { BookOpen, Layout, Loader2, Sparkles, ArrowRight } from "lucide-react"
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
  icon: typeof BookOpen
  title: string
  description: string
  detail: string
  badge?: string
  accent: boolean
}[] = [
  {
    mode: "photobook",
    icon: BookOpen,
    title: "Memory Book",
    description: "Preserve your most cherished moments in a beautifully designed photo book.",
    detail: "Wedding albums · Birthday stories · Travel diaries",
    accent: true,
  },
  {
    mode: "portfolio",
    icon: Layout,
    title: "Portfolio Site",
    description: "Showcase your work with a sleek personal site — no design skills needed.",
    detail: "Photography · Creative work · Personal brand",
    accent: false,
  },
]

function OptionCard({ opt, loadingMode, onCreate }: {
  opt: typeof options[0]
  loadingMode: ProjectMode | null
  onCreate: (mode: ProjectMode) => void
}) {
  const Icon = opt.icon
  const isLoading = loadingMode === opt.mode
  const isDisabled = !!loadingMode

  return (
    <button
      disabled={isDisabled}
      onClick={() => onCreate(opt.mode)}
      className={cn(
        "group relative flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60",
        opt.accent
          ? "border-primary/25 bg-gradient-to-br from-primary/8 to-primary/3 hover:border-primary/50 hover:from-primary/12 hover:to-primary/6 hover:shadow-md"
          : "border-border bg-card hover:bg-accent/30 hover:border-border hover:shadow-md"
      )}
    >
      {/* Icon */}
      <div className={cn(
        "flex size-12 items-center justify-center rounded-xl transition-colors",
        opt.accent ? "bg-primary/15" : "bg-secondary group-hover:bg-accent"
      )}>
        {isLoading
          ? <Loader2 className="size-5 animate-spin text-primary" />
          : <Icon className={cn("size-5", opt.accent ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        }
      </div>

      {/* Text */}
      <div className="flex-1 space-y-1.5">
        <p className="font-semibold text-base leading-tight">{opt.title}</p>
        <p className="text-sm text-muted-foreground leading-relaxed">{opt.description}</p>
        <p className="text-xs text-muted-foreground/60 pt-0.5">{opt.detail}</p>
      </div>

      {/* Arrow */}
      <div className={cn(
        "flex items-center gap-1.5 text-xs font-medium transition-colors",
        opt.accent ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {isLoading ? "Creating…" : "Get started"}
        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  )
}

function ModalBody({ onClose }: { onClose?: () => void }) {
  const { handleCreate, loadingMode } = useCreateProject()

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Headline */}
      <div className="space-y-1">
        <h2 className="font-serif text-2xl font-semibold leading-tight">Start something new</h2>
        <p className="text-sm text-muted-foreground">Choose a project type to begin your story.</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        description="Choose a type to get started"
      >
        <ModalBody onClose={() => onOpenChange(false)} />
      </MobileDrawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="sr-only">New Project</DialogTitle>
      <DialogContent className="sm:max-w-lg rounded-3xl p-0 overflow-hidden gap-0">
        <ModalBody />
      </DialogContent>
    </Dialog>
  )
}
