"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Copy, ExternalLink, Share2, Globe, BookOpen, Layout, Check, Plus } from "lucide-react"

interface Project {
  id: string
  name: string
  type: "photobook" | "portfolio"
  cover: string
  status: "published" | "draft"
  domain: string | null
  isCustomDomain: boolean
}

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Summer Memories 2024",
    type: "photobook",
    cover: "/placeholder.svg?height=80&width=120",
    status: "published",
    domain: "summer2024.milestis.app",
    isCustomDomain: false,
  },
  {
    id: "2",
    name: "Sarah's Portfolio",
    type: "portfolio",
    cover: "/placeholder.svg?height=80&width=120",
    status: "published",
    domain: "sarahcreates.com",
    isCustomDomain: true,
  },
  {
    id: "3",
    name: "Wedding Album",
    type: "photobook",
    cover: "/placeholder.svg?height=80&width=120",
    status: "draft",
    domain: null,
    isCustomDomain: false,
  },
]

export default function DomainsSettingsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [projects] = useState<Project[]>(mockProjects)

  const handleCopyLink = (project: Project) => {
    const link = project.domain ? `https://${project.domain}` : `https://${project.id}.milestis.app`
    navigator.clipboard.writeText(link)
    setCopiedId(project.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getProjectLink = (project: Project) => {
    return project.domain ? `https://${project.domain}` : `https://${project.id}.milestis.app`
  }

  if (projects.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Domains</h2>
          <p className="mt-1 text-muted-foreground">Manage your project links and sharing settings</p>
        </div>

        <Card className="border-border/50 bg-card/60 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-2xl bg-muted/50 p-4">
              <Globe className="size-10 text-muted-foreground/60" />
            </div>
            <h3 className="mb-2 text-lg font-medium">No projects yet</h3>
            <p className="mb-6 max-w-sm text-center text-sm text-muted-foreground">
              You haven&apos;t published any projects yet. Create your first project to start sharing with the world.
            </p>
            <Button className="rounded-full">
              <Plus className="mr-2 size-4" />
              Create your first project
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Domains</h2>
        <p className="mt-1 text-muted-foreground">Manage your project links and sharing settings</p>
      </div>

      <Card className="border-border/50 bg-card/60 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Projects & Domains</CardTitle>
          <CardDescription>All your projects and their sharing links in one place</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group flex items-center gap-4 rounded-xl border border-border/40 bg-background/50 p-4 transition-all duration-200 hover:border-border/60 hover:bg-background/80"
            >
              {/* Project Cover */}
              <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                <Image
                  src={project.cover || "/placeholder.svg"}
                  alt={project.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>

              {/* Project Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate font-medium">{project.name}</h4>
                  <Badge
                    variant={project.status === "published" ? "default" : "secondary"}
                    className="shrink-0 rounded-full text-xs"
                  >
                    {project.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>

                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  {project.type === "photobook" ? <BookOpen className="size-3.5" /> : <Layout className="size-3.5" />}
                  <span className="capitalize">{project.type === "photobook" ? "Photobook" : "Portfolio Site"}</span>
                </div>

                {/* Domain Info */}
                <div className="mt-2 flex items-center gap-2">
                  {project.domain ? (
                    <>
                      <Globe className="size-3.5 text-primary" />
                      <span className="text-sm font-medium text-primary">{project.domain}</span>
                      {!project.isCustomDomain && (
                        <Badge variant="outline" className="rounded-full text-[10px] px-1.5 py-0">
                          Default
                        </Badge>
                      )}
                    </>
                  ) : (
                    <span className="text-sm italic text-muted-foreground/60">No domain connected yet</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  onClick={() => handleCopyLink(project)}
                  disabled={project.status === "draft"}
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-transparent"
                      disabled={project.status === "draft"}
                    >
                      <Share2 className="mr-1.5 size-3.5" />
                      Share
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem className="rounded-lg" onClick={() => handleCopyLink(project)}>
                      <Copy className="mr-2 size-4" />
                      Copy link
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="rounded-lg"
                      onClick={() => window.open(getProjectLink(project), "_blank")}
                    >
                      <ExternalLink className="mr-2 size-4" />
                      Open project
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="rounded-lg">
                      <Share2 className="mr-2 size-4" />
                      Share via link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Info Note */}
      <div className="flex items-start gap-3 rounded-xl bg-muted/40 px-4 py-3">
        <Globe className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          All published projects get a free shareable link. You can also connect your own custom domain for a more
          personal touch.
        </p>
      </div>
    </div>
  )
}
