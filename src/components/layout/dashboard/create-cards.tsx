"use client"

import { BookOpen, Layout, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function CreateCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Create Photobook Card */}
      <Card className="group relative overflow-hidden rounded-3xl border-border/40 bg-card/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.01]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5">
              <BookOpen className="size-7 text-primary" />
            </div>
            <Badge variant="secondary" className="rounded-full text-xs font-normal px-3">
              <Sparkles className="mr-1 size-3" />
              Uses credits
            </Badge>
          </div>
          <CardTitle className="mt-5 text-xl">Create Photobook</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Create an interactive photo book using ready-made presets. Perfect for preserving memories.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-3">
            <Button className="flex-1 rounded-full">Create</Button>
            <Button variant="outline" className="flex-1 rounded-full bg-transparent border-border/60">
              Browse presets
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Create Portfolio Site Card */}
      <Card className="group relative overflow-hidden rounded-3xl border-border/40 bg-card/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.01]">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent/40 to-accent/10">
              <Layout className="size-7 text-accent-foreground" />
            </div>
          </div>
          <CardTitle className="mt-5 text-xl">Create Portfolio Site</CardTitle>
          <CardDescription className="text-sm leading-relaxed">
            Build a clean personal site without design skills. Showcase your work professionally.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex gap-3">
            <Button className="flex-1 rounded-full">Create</Button>
            <Button variant="outline" className="flex-1 rounded-full bg-transparent border-border/60">
              View examples
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
