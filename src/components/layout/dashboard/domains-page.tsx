"use client"

import { Globe, Copy, ExternalLink, MoreHorizontal, BookOpen, Layout } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Project {
  id: string
  name: string
  type: "photobook" | "site"
  status: "published" | "draft"
  domain: string
  cover: string
}

const projects: Project[] = [
  {
    id: "1",
    name: "Summer Wedding 2024",
    type: "photobook",
    status: "published",
    domain: "summer-wedding-2024.milestis.app",
    cover: "/placeholder.svg?height=80&width=120",
  },
  {
    id: "2",
    name: "Photography Portfolio",
    type: "site",
    status: "published",
    domain: "jane-portfolio.milestis.app",
    cover: "/placeholder.svg?height=80&width=120",
  },
  {
    id: "3",
    name: "Birthday Memories",
    type: "photobook",
    status: "draft",
    domain: "—",
    cover: "/placeholder.svg?height=80&width=120",
  },
]

export function DomainsPage() {
  const handleCopyLink = (domain: string) => {
    navigator.clipboard.writeText(`https://${domain}`)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Domains</h1>
        <p className="text-muted-foreground">Manage and share your published projects</p>
      </div>

      {/* Projects & Domains Card */}
      <Card className="rounded-3xl border-muted-foreground/10 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">Your Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="flex items-center gap-4 rounded-2xl border border-muted-foreground/10 bg-muted/30 p-4 transition-colors hover:bg-muted/50"
            >
              {/* Cover Thumbnail */}
              <div className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                <img src={project.cover || "/placeholder.svg"} alt={project.name} className="size-full object-cover" />
              </div>

              {/* Project Info */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="truncate font-medium text-foreground">{project.name}</h3>
                  <Badge variant="secondary" className="shrink-0 rounded-full bg-primary/10 text-xs text-primary">
                    {project.type === "photobook" ? (
                      <>
                        <BookOpen className="mr-1 size-3" />
                        Photobook
                      </>
                    ) : (
                      <>
                        <Layout className="mr-1 size-3" />
                        Site
                      </>
                    )}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={`shrink-0 rounded-full text-xs ${
                      project.status === "published"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {project.status === "published" ? "Published" : "Draft"}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-sm text-muted-foreground">
                  {project.status === "published" ? project.domain : "Not published yet"}
                </p>
              </div>

              {/* Actions */}
              <div className="flex shrink-0 items-center gap-2">
                {project.status === "published" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-full"
                    onClick={() => handleCopyLink(project.domain)}
                  >
                    <Copy className="mr-2 size-4" />
                    Copy link
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost" className="rounded-full">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl">
                    {project.status === "published" && (
                      <>
                        <DropdownMenuItem className="rounded-lg">
                          <Copy className="mr-2 size-4" />
                          Copy link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="rounded-lg">
                          <ExternalLink className="mr-2 size-4" />
                          Open project
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem className="rounded-lg">
                      <Globe className="mr-2 size-4" />
                      {project.status === "published" ? "Domain settings" : "Publish project"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
                <Globe className="size-8 text-muted-foreground" />
              </div>
              <h3 className="mb-1 font-medium text-foreground">No projects yet</h3>
              <p className="text-sm text-muted-foreground">Create a photobook or portfolio to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Note */}
      <Card className="rounded-2xl border-primary/20 bg-primary/5">
        <CardContent className="flex items-start gap-3 py-4">
          <Globe className="mt-0.5 size-5 shrink-0 text-primary" />
          <div className="text-sm">
            <p className="font-medium text-foreground">About Milestis domains</p>
            <p className="mt-1 text-muted-foreground">
              All published projects get a free milestis.app subdomain. Custom domains are coming soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
