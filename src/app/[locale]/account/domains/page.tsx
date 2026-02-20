"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy, ExternalLink, Share2, Globe, BookOpen, Layout, Check } from "lucide-react"

interface Project {
  id: string
  name: string
  type: "photobook" | "portfolio"
  cover: string
  domain: string
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Summer Memories 2024",
    type: "photobook",
    cover: "/placeholder.svg?height=80&width=120",
    domain: "summer2024.milestis.app",
  },
  {
    id: "2",
    name: "Wedding book",
    type: "photobook",
    cover: "/placeholder.svg?height=80&width=120",
    domain: "weddingbook.milestis.app",
  },
]

export default function DomainsSettingsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyLink = (project: Project) => {
    const link = `https://${project.domain}`
    navigator.clipboard.writeText(link)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getProjectLink = (project: Project) => {
    return `https://${project.domain}`
  }

  return (
    <div className="space-y-12">

      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Domains</h2>
          <p className="mt-1 text-muted-foreground">Share links for your published projects</p>
        </div>

        <div className="rounded-2xl bg-card shadow-sm">
          <div className="divide-y divide-border/40">
          {mockProjects.map((project) => (
            <div
              key={project.id}
              className="relative flex items-center gap-4 p-5"
            >
              {/* Mobile share (top-right, icon only) */}
              <div className="absolute right-2 top-2 z-10 sm:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Share2 className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => handleCopyLink(project)}>
                      <Copy className="mr-2 size-4" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(getProjectLink(project), "_blank")}
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Open project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Cover */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={project.cover}
                  alt={project.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-medium mr-4">{project.name}</h4>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {project.type === "photobook" ? (
                    <BookOpen className="size-3.5" />
                  ) : (
                    <Layout className="size-3.5" />
                  )}
                  <span>
                    {project.type === "photobook" ? "Photobook" : "Portfolio"}
                  </span>
                </div>

                <div className="mt-2 flex min-w-0 items-center gap-2 text-sm">
                  <Globe className="size-3.5 text-primary" />
                  <span className="truncate font-medium text-primary">
                    {project.domain}
                  </span>
                </div>
              </div>

              {/* Desktop actions */}
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleCopyLink(project)}
                >
                  {copiedId === project.id ? (
                    <>
                      <Check className="mr-1.5 size-3.5 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-1.5 size-3.5" />
                      Copy link
                    </>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-full">
                      <Share2 className="mr-1.5 size-3.5" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem onClick={() => handleCopyLink(project)}>
                      <Copy className="mr-2 size-4" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => window.open(getProjectLink(project), "_blank")}
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Open project
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Share2 className="mr-2 size-4" />
                      Share via link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
          </div>
        </div>
      </section>
    </div>
  )
}
