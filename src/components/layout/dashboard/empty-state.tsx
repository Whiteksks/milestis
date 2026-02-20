"use client"

import { BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-xl bg-secondary">
        <BookOpen className="size-6 text-primary" />
      </div>
      <h3 className="mt-5 font-serif text-2xl">No projects yet</h3>
      <p className="mt-2 max-w-xs text-sm text-muted-foreground">
        Create your first memory book to get started.
      </p>
      <Button className="mt-6 rounded-full px-8">Create Memory Book</Button>
    </div>
  )
}
