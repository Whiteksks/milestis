"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { createProject } from "@/lib/create-project-api"
import { toastProject } from "@/lib/toast"
import { projectKeys } from "@/hooks/useProjectsQuery"
import { useUserStore } from "@/hooks/useUserStore"

type ProjectMode = "portfolio" | "photobook"

const adjectives = [
  "golden", "summer", "bright", "quiet", "fresh",
  "warm", "misty", "tender", "vivid", "calm",
  "gentle", "secret", "serene", "radiant", "timeless",
]
const nouns = [
  "memories", "journey", "story", "moments", "chapter",
  "escape", "lens", "voyage", "canvas", "light",
  "bloom", "horizon", "portrait", "archive", "collection",
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
