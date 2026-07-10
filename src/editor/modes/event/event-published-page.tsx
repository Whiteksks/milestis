"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { collection, doc, onSnapshot, orderBy, query, where } from "firebase/firestore"
import { toast } from "sonner"
import { db } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import type { ThemeConfig } from "@/editor/lib/config/themes"
import type { EventTemplateProps } from "@/editor/lib/template-types"
import type { EventGuestPhoto } from "./content-types"

// ─── Template components (loaded lazily per-template) ────────────────────────

const TemplateEventFilm = dynamic(
  () => import('./templates/template-event-film').then((m) => m.TemplateEventFilm),
  { ssr: false },
)
const TemplateEventCosmos = dynamic(
  () => import('./templates/template-event-cosmos').then((m) => m.TemplateEventCosmos),
  { ssr: false },
)
const TemplateEventParallax = dynamic(
  () => import('./templates/template-event-parallax').then((m) => m.TemplateEventParallax),
  { ssr: false },
)
const TemplateEventBubbles = dynamic(
  () => import('./templates/template-event-bubbles').then((m) => m.TemplateEventBubbles),
  { ssr: false },
)
const TemplateEventCoverflow = dynamic(
  () => import('./templates/template-event-coverflow').then((m) => m.TemplateEventCoverflow),
  { ssr: false },
)

const TEMPLATE_MAP: Record<string, React.ComponentType<EventTemplateProps>> = {
  'event-film':      TemplateEventFilm,
  'event-cosmos':    TemplateEventCosmos,
  'event-parallax':  TemplateEventParallax,
  'event-bubbles':   TemplateEventBubbles,
  'event-coverflow': TemplateEventCoverflow,
}

// ─── Constants ────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const MAX_FILE_SIZE_MB = 20

// ─── Types ────────────────────────────────────────────────────────────────

interface UploadItem {
  id: string
  name: string
  state: "uploading" | "pending" | "error"
}

// ─── Component ────────────────────────────────────────────────────────────

interface EventPublishedPageProps {
  projectId: string
  templateId?: string
  theme: ThemeConfig
  initialPhotos?: EventGuestPhoto[]
  initialMaxPhotos?: number
  initialMaxPhotosPerGuest?: number
}

async function getFirebaseUploadAuth() {
  const [{ auth }, { signInAnonymously }] = await Promise.all([
    import("@/lib/firebase/firebase"),
    import("firebase/auth"),
  ])

  return { auth, signInAnonymously }
}

export function EventPublishedPage({
  projectId,
  templateId = "event-gallery",
  theme,
  initialPhotos = [],
  initialMaxPhotos = 100,
  initialMaxPhotosPerGuest = 2,
}: EventPublishedPageProps) {
  const [uid, setUid] = useState<string | null>(null)
  const [authState, setAuthState] = useState<"idle" | "signing-in" | "ready" | "error">("idle")
  const [accessToken, setAccessToken] = useState<string>("")
  const [guestCount, setGuestCount] = useState(0)
  const [approvedPhotos, setApprovedPhotos] = useState<EventGuestPhoto[]>(initialPhotos)
  const [maxPhotos, setMaxPhotos] = useState(initialMaxPhotos)
  const [maxPhotosPerGuest, setMaxPhotosPerGuest] = useState(initialMaxPhotosPerGuest)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activeUploads = uploads.filter((u) => u.state === "uploading").length
  const isFull = approvedPhotos.length >= maxPhotos
  const quotaReached = guestCount >= maxPhotosPerGuest

  // ── Read access token from URL ──────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setAccessToken(params.get("share") ?? "")
  }, [])

  // ── Hydrate public data from the server payload ─────────────────────────
  useEffect(() => {
    setApprovedPhotos(initialPhotos)
  }, [initialPhotos])

  useEffect(() => {
    setMaxPhotos(initialMaxPhotos)
  }, [initialMaxPhotos])

  useEffect(() => {
    setMaxPhotosPerGuest(initialMaxPhotosPerGuest)
  }, [initialMaxPhotosPerGuest])

  // ── Guest upload quota ──────────────────────────────────────────────────
  useEffect(() => {
    if (!uid || !projectId) return
    return onSnapshot(
      doc(db, "projects", projectId, "eventGuestQuota", uid),
      (snap) => setGuestCount(snap.exists() ? (snap.data().count as number) : 0),
    )
  }, [uid, projectId])

  // ── Real-time approved gallery (public — no auth required) ───────────────
  useEffect(() => {
    if (!projectId) return
    const q = query(
      collection(db, "projects", projectId, "eventPhotos"),
      where("status", "==", "approved"),
      orderBy("uploadedAt", "desc"),
    )
    return onSnapshot(
      q,
      (snap) => {
        setApprovedPhotos(snap.docs.map((d) => ({
          id: d.id,
          storageRef: d.data().storageRef as string,
          uploadedAt: (d.data().uploadedAt?.toMillis?.() as number | undefined) ?? null,
          thumbUrl: d.data().thumbUrl as string | undefined,
          fullUrl: d.data().fullUrl as string | undefined,
        })))
      },
      (error) => {
        const code = typeof error === "object" && error !== null && "code" in error
          ? String((error as { code?: unknown }).code ?? "")
          : ""
        if (code !== "permission-denied") {
          console.error("Failed to subscribe to event photos:", error)
        }
      },
    )
  }, [projectId])

  // ── Auto-clear finished upload tray items ──────────────────────────────
  useEffect(() => {
    const pendingIds = uploads.filter((u) => u.state === "pending").map((u) => u.id)
    if (pendingIds.length === 0) return
    const timer = setTimeout(() => {
      setUploads((prev) => prev.filter((u) => !pendingIds.includes(u.id)))
    }, 3500)
    return () => clearTimeout(timer)
  }, [uploads])

  // ── Upload logic ────────────────────────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    if (!uid || !accessToken) return

    // Read file bytes into memory FIRST — before any async network calls.
    // On iOS/mobile the File handle can become stale after awaiting getIdToken
    // or the signed-URL fetch, causing the browser to crash the page.
    let fileBuffer: ArrayBuffer
    try {
      fileBuffer = await file.arrayBuffer()
    } catch {
      toast.error(`${file.name}: could not read file.`)
      return
    }

    const itemId = crypto.randomUUID()
    setUploads((prev) => [...prev, { id: itemId, name: file.name, state: "uploading" }])

    try {
      const { auth } = await getFirebaseUploadAuth()
      const idToken = await auth.currentUser?.getIdToken()
      if (!idToken) throw new Error("Could not connect. Please refresh the page.")
      const fnUrl = process.env.NEXT_PUBLIC_UPLOAD_EVENT_PHOTO_URL
      if (!fnUrl) throw new Error("Upload service not configured.")

      const res = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`,
        },
        body: JSON.stringify({ projectId, accessToken, contentType: file.type, fileName: file.name }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const code = (data as { error?: string }).error ?? "UNKNOWN"
        if (code === "GUEST_QUOTA_EXCEEDED") throw new Error("You've reached your upload limit.")
        if (code === "EVENT_FULL") throw new Error("The event photo limit has been reached.")
        if (code === "UNAUTHORIZED_EVENT") throw new Error("This event link is invalid.")
        throw new Error("Upload failed. Please try again.")
      }

      const { uploadUrl } = (await res.json()) as { uploadUrl: string }

      const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: fileBuffer,
      })

      if (!putRes.ok) throw new Error("File transfer failed. Please try again.")

      setUploads((prev) =>
        prev.map((u) => (u.id === itemId ? { ...u, state: "pending" } : u)),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed."
      toast.error(message)
      setUploads((prev) =>
        prev.map((u) => (u.id === itemId ? { ...u, state: "error" } : u)),
      )
    }
  }, [uid, accessToken, projectId])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const inFlight = uploads.filter((u) => u.state !== "error").length
    const remaining = Math.max(0, maxPhotosPerGuest - guestCount - inFlight)
    const toUpload = fileArray.slice(0, remaining)

    for (const file of toUpload) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name}: unsupported format. Use JPG, PNG, WebP or HEIC.`)
        continue
      }
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        toast.error(`${file.name}: file is too large (max ${MAX_FILE_SIZE_MB} MB).`)
        continue
      }
      uploadFile(file)
    }

    if (fileArray.length > toUpload.length) {
      toast.info(`Only ${remaining} upload(s) remaining for you.`)
    }
  }, [guestCount, maxPhotosPerGuest, uploads, uploadFile])

  const onFabClick = async () => {
    if (authState === "signing-in") return
    if (authState === "error") { toast.error("Connection failed. Please reload."); return }
    if (isFull)       { toast.info("This event gallery is full."); return }
    if (quotaReached) { toast.info(`You've already uploaded your ${maxPhotosPerGuest} photos.`); return }

    if (authState === "idle") {
      // Lazy sign-in — only happens when the user actually wants to upload
      setAuthState("signing-in")
      try {
        const { auth, signInAnonymously } = await getFirebaseUploadAuth()
        if (auth.currentUser) {
          setUid(auth.currentUser.uid)
          setAuthState("ready")
          fileInputRef.current?.click()
          return
        }
        const { user } = await signInAnonymously(auth)
        setUid(user.uid)
        setAuthState("ready")
        // Fall through to open file picker immediately after auth
      } catch {
        setAuthState("error")
        toast.error("Could not connect. Please refresh the page.")
        return
      }
    }

    fileInputRef.current?.click()
  }

  // ── Resolve template component ──────────────────────────────────────────
  const TemplateComponent = TEMPLATE_MAP[templateId] ?? TemplateEventCoverflow

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Template renders the gallery (cosmos / parallax / film / etc.) ── */}
      <TemplateComponent theme={theme} eventPhotos={approvedPhotos} />

      {/* ── Upload tray — floats above the FAB, only when there are uploads ── */}
      {uploads.length > 0 && (
        <div className="fixed right-4 z-50 flex flex-col gap-1.5 items-end" style={{ bottom: 'calc(5.5rem + env(safe-area-inset-bottom, 0px))' }}>
          {uploads.map((u) => (
            <div
              key={u.id}
              className="flex items-center gap-2 rounded-full border bg-background/90 backdrop-blur-sm px-3 py-1.5 text-xs shadow-md max-w-[200px]"
            >
              <span className={cn(
                "size-1.5 shrink-0 rounded-full",
                u.state === "uploading" && "animate-pulse bg-blue-500",
                u.state === "pending"   && "bg-amber-400",
                u.state === "error"     && "bg-destructive",
              )} />
              <span className="truncate text-foreground">{u.name}</span>
              <span className="shrink-0 text-muted-foreground">
                {u.state === "uploading" && "…"}
                {u.state === "pending"   && "✓"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Camera FAB ── */}
      <button
        type="button"
        aria-label="Upload photos"
        onClick={onFabClick}
        style={{ bottom: 'calc(1.5rem + env(safe-area-inset-bottom, 0px))' }}
        className={cn(
          "fixed right-6 z-50",
          "size-14 rounded-full shadow-lg",
          "flex items-center justify-center",
          "bg-foreground text-background transition-opacity",
          authState === "signing-in" && "opacity-60",
        )}
      >
        {authState === "signing-in" ? (
          <svg className="size-5 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        ) : (
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        )}

        {/* Active uploads badge */}
        {activeUploads > 0 && (
          <span className="absolute -top-1 -right-1 size-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
            {activeUploads}
          </span>
        )}
      </button>

      {/* ── Hidden file input ── */}
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          // Reset so selecting the same file again still triggers onChange
          e.target.value = ''
        }}
      />

    </>
  )
}
