"use client"

import { MoreHorizontal, Edit, Trash2, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    status: "draft" | "published" | "archived"
    thumbnail: string
    updatedAt: string
  }
}

const statusStyles = {
  draft: "bg-muted text-muted-foreground rounded-full",
  published: "bg-primary/10 text-primary rounded-full",
  archived: "bg-secondary text-secondary-foreground rounded-full",
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl border-border/40 bg-card/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:scale-[1.02]">
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl">
        <Image
          src={project.thumbnail || "/placeholder.svg"}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, 420px"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
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
                <Eye className="mr-2 size-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg">
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer rounded-lg" variant="destructive">
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute bottom-2 left-2">
          <Badge variant="secondary" className={`${statusStyles[project.status]} text-xs px-3`}>
            {project.status}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="truncate font-medium text-foreground">{project.title}</h3>
        <p className="mt-1 text-xs text-muted-foreground">Updated {project.updatedAt}</p>
      </CardContent>
    </Card>
  )
}
