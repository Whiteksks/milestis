"use client"

import { MoreHorizontal, Edit, Trash2, Eye, BookOpen, Layout } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

export interface ProjectCardProject {
  id: string
  title: string
  description?: string
  type?: "photobook" | "site"
  status: "draft" | "published" | "archived"
  thumbnail: string
  updatedAt: string
}

interface ProjectCardProps {
  project: ProjectCardProject
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground",
  published: "bg-primary/10 text-primary",
  archived: "bg-secondary text-secondary-foreground",
}

const typeLabels = {
  photobook: { icon: BookOpen, label: "Photobook" },
  site: { icon: Layout, label: "Site" },
}

export function ProjectCard({ project }: ProjectCardProps) {
  const typeInfo = project.type ? typeLabels[project.type] : null

  return (
    <Card className="group overflow-hidden rounded-2xl shadow-sm transition-all hover:shadow-md">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-muted">
        <Image
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Hover action overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-foreground/30 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Button size="sm" className="rounded-full shadow-md">
            <Edit className="mr-1.5 size-3.5" />
            Edit
          </Button>
          <Button variant="secondary" size="sm" className="rounded-full shadow-md">
            <Eye className="mr-1.5 size-3.5" />
            View
          </Button>
        </div>

        {/* More menu */}
        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="size-8 rounded-full shadow-md">
                <MoreHorizontal className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl">
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Eye className="mr-2 size-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Edit className="mr-2 size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg" variant="destructive">
                <Trash2 className="mr-2 size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom badges row */}
        <div className="absolute bottom-2 left-2 flex items-center gap-1.5">
          {typeInfo && (
            <span className="flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-0.5 text-xs font-medium backdrop-blur-sm">
              <typeInfo.icon className="size-3" />
              {typeInfo.label}
            </span>
          )}
          <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[project.status]}`}>
            {project.status}
          </span>
        </div>
      </div>

      <CardContent className="p-3">
        <p className="truncate text-sm font-medium">{project.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">Edited {project.updatedAt}</p>
      </CardContent>
    </Card>
  )
}
