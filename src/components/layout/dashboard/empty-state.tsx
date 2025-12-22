"use client"

import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/50 bg-card/50 backdrop-blur-sm px-6 py-16">
      <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
        <BookOpen className="size-8 text-primary" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-foreground">You haven&apos;t created any projects yet</h3>
      <p className="mt-2 max-w-sm text-center text-sm text-muted-foreground">
        Start by creating a photo book to preserve your favorite memories.
      </p>
      <Button className="mt-6">Create Photobook</Button>
    </div>
  )
}
