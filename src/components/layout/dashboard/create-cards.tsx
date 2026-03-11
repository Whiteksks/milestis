"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { BookOpen, Layout, Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createProject, CreateProjectError } from "@/lib/create-project-api"

type ProjectMode = "portfolio" | "photobook"

const cards: { mode: ProjectMode; icon: typeof BookOpen; title: string; description: string; badge: string | null; secondary: string; placeholder: string }[] = [
  {
    mode: "photobook",
    icon: BookOpen,
    title: "Memory Book",
    description: "Create an interactive photo book with ready-made presets. Perfect for preserving memories.",
    badge: "Uses credits",
    secondary: "Browse presets",
    placeholder: "Summer 2025",
  },
  {
    mode: "portfolio",
    icon: Layout,
    title: "Portfolio Site",
    description: "Build a clean personal site without design skills. Showcase your work beautifully.",
    badge: null,
    secondary: "View examples",
    placeholder: "My Portfolio",
  },
]

interface DialogState {
  open: boolean
  mode: ProjectMode
  name: string
  loading: boolean
  error: string | null
}

const INITIAL_DIALOG: DialogState = {
  open: false,
  mode: "portfolio",
  name: "",
  loading: false,
  error: null,
}

export function CreateCards() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  const [dialog, setDialog] = useState<DialogState>(INITIAL_DIALOG)

  function openDialog(mode: ProjectMode) {
    setDialog({ ...INITIAL_DIALOG, open: true, mode })
  }

  function closeDialog() {
    if (dialog.loading) return
    setDialog(INITIAL_DIALOG)
  }

  async function handleCreate() {
    const name = dialog.name.trim()
    if (!name) return
    setDialog((d) => ({ ...d, loading: true, error: null }))
    try {
      const projectId = await createProject(name, dialog.mode)
      router.push(`/${locale}/design/${projectId}/edit`)
    } catch (err) {
      const message = err instanceof CreateProjectError ? err.message : "Something went wrong. Please try again."
      setDialog((d) => ({ ...d, loading: false, error: message }))
    }
  }

  const currentCard = cards.find((c) => c.mode === dialog.mode)

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.title}
            className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex size-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
                <card.icon className="size-5 text-primary" />
              </div>
              {card.badge && (
                <span className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Sparkles className="size-3" />
                  {card.badge}
                </span>
              )}
            </div>

            <h3 className="font-serif text-xl font-semibold">{card.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.description}</p>

            <div className="mt-6 flex gap-3">
              <Button className="rounded-full gap-2 px-6" onClick={() => openDialog(card.mode)}>
                Create
              </Button>
              <Button variant="ghost" className="rounded-full px-6 text-muted-foreground hover:text-foreground">
                {card.secondary}
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={dialog.open} onOpenChange={(open) => { if (!open) closeDialog() }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New {currentCard?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                value={dialog.name}
                onChange={(e) => setDialog((d) => ({ ...d, name: e.target.value }))}
                placeholder={currentCard?.placeholder}
                disabled={dialog.loading}
                onKeyDown={(e) => { if (e.key === "Enter") handleCreate() }}
                autoFocus
              />
            </div>
            {dialog.error && (
              <p className="text-sm text-destructive">{dialog.error}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={closeDialog} disabled={dialog.loading}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={dialog.loading || !dialog.name.trim()}>
                {dialog.loading && <Loader2 className="mr-2 size-4 animate-spin" />}
                {dialog.loading ? "Creating…" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
