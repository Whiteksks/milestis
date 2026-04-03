"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { createProject } from "@/lib/projects"
import { toastProject } from "@/lib/toast"
import { projectKeys } from "@/hooks/useProjectsQuery"
import { useUserStore } from "@/hooks/useUserStore"

type ProjectMode = "portfolio" | "photobook"

const adjectives = [
  // Световые и цветовые
  "golden", "vivid", "radiant", "amber", "velvet", "neon", "monochrome", "sepia",
  // Атмосферные
  "misty", "serene", "ethereal", "hidden", "quiet", "infinite", "urban", "wild",
  // Эмоциональные
  "tender", "nostalgic", "bold", "solitary", "dreamy", "timeless", "honest",
  // Временные
  "eternal", "daily", "midnight", "autumn", "distant", "instant", "vintage"
]

const nouns = [
  // Фотографические
  "lens", "frame", "exposure", "portrait", "archive", "glimpse", "focus", "shot",
  // Художественные
  "canvas", "gallery", "palette", "sketch", "vision", "composition", "artifact",
  // Метафоричные
  "voyage", "horizon", "echo", "essence", "rhythm", "fragment", "symmetry",
  // Описательные
  "journal", "chapter", "haven", "mirage", "odyssey", "reverie", "atlas"
]

export function randomProjectName(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${adj} ${noun}`
}

export function useCreateProject() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const queryClient = useQueryClient()
  const uid = useUserStore((s) => s.profile?.uid ?? null)

  const [loadingMode, setLoadingMode] = useState<ProjectMode | null>(null)

  async function handleCreate(mode: ProjectMode) {
    if (loadingMode) return
    setLoadingMode(mode)
    const promise = createProject(randomProjectName(), mode)
    toastProject.create(promise)
    try {
      const projectId = await promise
      if (uid) {
        void queryClient.invalidateQueries({ queryKey: projectKeys.active(uid) })
      }
      router.push(`/${locale}/design/${projectId}/edit`)
    } catch {
      setLoadingMode(null)
    }
  }

  return { handleCreate, loadingMode }
}
