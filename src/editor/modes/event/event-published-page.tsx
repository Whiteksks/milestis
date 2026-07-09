"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from "firebase/firestore"
import Image from "next/image"
import { toast } from "sonner"
import { auth, db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// ─── Constants ────────────────────────────────────────────────────────────

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const MAX_FILE_SIZE_MB = 20

// ─── Types ────────────────────────────────────────────────────────────────

interface ApprovedPhoto {
  id: string
  storageRef: string
  thumbUrl?: string
}

interface UploadItem {
  id: string
  name: string
  state: "uploading" | "pending" | "error"
  errorMessage?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function getPhotoUrl(photo: ApprovedPhoto): string {
  if (photo.thumbUrl) return photo.thumbUrl
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ""
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(photo.storageRef)}?alt=media`
}

// ─── Component ────────────────────────────────────────────────────────────

interface EventPublishedPageProps {
  projectId: string
  eventName: string
}

export function EventPublishedPage({ projectId, eventName }: EventPublishedPageProps) {
  const [uid, setUid] = useState<string | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [accessToken, setAccessToken] = useState<string>("")
  const [guestCount, setGuestCount] = useState(0)
  const [approvedPhotos, setApprovedPhotos] = useState<ApprovedPhoto[]>([])
  const [approvedCount, setApprovedCount] = useState(0)
  const [maxPhotos, setMaxPhotos] = useState(200)
  const [maxPhotosPerGuest, setMaxPhotosPerGuest] = useState(5)
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const canUpload = authReady && guestCount < maxPhotosPerGuest && approvedCount < maxPhotos

  // ── Read access token from URL ──────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setAccessToken(params.get("share") ?? "")
  }, [])

  // ── Read real limits from Firestore ─────────────────────────────────────
  useEffect(() => {
    if (!projectId) return
    getDoc(doc(db, "projects", projectId)).then((snap) => {
      if (!snap.exists()) return
      const cfg = snap.data().eventConfig as { maxPhotos?: number; maxPhotosPerGuest?: number } | undefined
      if (typeof cfg?.maxPhotos === "number") setMaxPhotos(cfg.maxPhotos)
      if (typeof cfg?.maxPhotosPerGuest === "number") setMaxPhotosPerGuest(cfg.maxPhotosPerGuest)
    }).catch(() => { /* use defaults */ })
  }, [projectId])

  // ── Anonymous auth ──────────────────────────────────────────────────────
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        setAuthReady(true)
      } else {
        try {
          const { user: anon } = await signInAnonymously(auth)
          setUid(anon.uid)
          setAuthReady(true)
        } catch {
          toast.error("Could not connect. Please refresh the page.")
        }
      }
    })
  }, [])

  // ── Guest upload quota ──────────────────────────────────────────────────
  useEffect(() => {
    if (!uid || !projectId) return
    return onSnapshot(
      doc(db, "projects", projectId, "eventGuestQuota", uid),
      (snap) => setGuestCount(snap.exists() ? (snap.data().count as number) : 0),
    )
  }, [uid, projectId])

  // ── Real-time approved gallery ──────────────────────────────────────────
  useEffect(() => {
    if (!authReady || !projectId) return
    const q = query(
      collection(db, "projects", projectId, "eventPhotos"),
      where("status", "==", "approved"),
      orderBy("uploadedAt", "desc"),
    )
    return onSnapshot(q, (snap) => {
      setApprovedPhotos(snap.docs.map((d) => ({
        id: d.id,
        storageRef: d.data().storageRef as string,
        thumbUrl: d.data().thumbUrl as string | undefined,
      })))
      setApprovedCount(snap.size)
    })
  }, [projectId, authReady])

  // ── Upload logic ────────────────────────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    if (!uid || !accessToken) return

    const itemId = crypto.randomUUID()
    setUploads((prev) => [...prev, { id: itemId, name: file.name, state: "uploading" }])

    try {
      const idToken = await auth.currentUser?.getIdToken()
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
        body: file,
      })

      if (!putRes.ok) throw new Error("File transfer failed. Please try again.")

      setUploads((prev) =>
        prev.map((u) => (u.id === itemId ? { ...u, state: "pending" } : u)),
      )
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed."
      toast.error(message)
      setUploads((prev) =>
        prev.map((u) => (u.id === itemId ? { ...u, state: "error", errorMessage: message } : u)),
      )
    }
  }, [uid, accessToken, projectId])

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files)
    const remaining = maxPhotosPerGuest - guestCount - uploads.filter((u) => u.state !== "error").length
    const toUpload = fileArray.slice(0, Math.max(0, remaining))

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

  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = () => setIsDragging(false)
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (canUpload) handleFiles(e.dataTransfer.files)
  }

  const isFull = approvedCount >= maxPhotos

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">

      {/* ── Header ── */}
      <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur-sm px-4 py-3">
        <div className="mx-auto max-w-2xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="font-serif text-lg font-semibold truncate">{eventName}</h1>
            <p className="text-xs text-muted-foreground">
              {approvedCount} / {maxPhotos} photos
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 space-y-6">

        {/* ── Upload zone ── */}
        {isFull ? (
          <div className="rounded-2xl border bg-muted/30 p-8 text-center">
            <p className="font-medium">Event gallery is full</p>
            <p className="mt-1 text-sm text-muted-foreground">All {maxPhotos} photo slots have been filled. Thank you!</p>
          </div>
        ) : (
          <section>
            <div
              className={cn(
                "rounded-2xl border-2 border-dashed transition-colors cursor-pointer",
                "flex flex-col items-center justify-center gap-3 p-10 text-center",
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/30",
                !canUpload && "pointer-events-none opacity-50",
              )}
              onClick={() => canUpload && fileInputRef.current?.click()}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <div className="rounded-full bg-muted p-4">
                <svg className="size-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                </svg>
              </div>

              {!authReady ? (
                <p className="text-sm text-muted-foreground">Connecting…</p>
              ) : guestCount >= maxPhotosPerGuest ? (
                <>
                  <p className="font-medium">You&apos;ve uploaded your {maxPhotosPerGuest} photos</p>
                  <p className="text-sm text-muted-foreground">Thank you for contributing!</p>
                </>
              ) : (
                <>
                  <p className="font-medium">Tap to add photos</p>
                  <p className="text-sm text-muted-foreground">
                    {maxPhotosPerGuest - guestCount} upload{maxPhotosPerGuest - guestCount !== 1 ? "s" : ""} remaining for you
                    &nbsp;·&nbsp; JPG, PNG, WebP or HEIC &nbsp;·&nbsp; max {MAX_FILE_SIZE_MB} MB
                  </p>
                  <Button size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                    Choose photos
                  </Button>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              multiple
              className="sr-only"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </section>
        )}

        {/* ── Upload queue ── */}
        {uploads.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Your uploads</h2>
            {uploads.map((u) => (
              <div key={u.id} className="flex items-center gap-3 rounded-lg border px-3 py-2.5 text-sm">
                <span className={cn(
                  "size-2 shrink-0 rounded-full",
                  u.state === "uploading" && "animate-pulse bg-blue-500",
                  u.state === "pending"   && "bg-amber-400",
                  u.state === "error"     && "bg-destructive",
                )} />
                <span className="min-w-0 flex-1 truncate text-foreground">{u.name}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {u.state === "uploading" && "Uploading…"}
                  {u.state === "pending"   && "Under review"}
                  {u.state === "error"     && "Failed"}
                </span>
              </div>
            ))}
          </section>
        )}

        {/* ── Approved gallery ── */}
        {approvedPhotos.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Gallery · {approvedCount} photo{approvedCount !== 1 ? "s" : ""}
            </h2>
            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {approvedPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md bg-muted">
                  <Image
                    src={getPhotoUrl(photo)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 33vw, 25vw"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {approvedPhotos.length === 0 && uploads.length === 0 && !isFull && (
          <p className="text-center text-sm text-muted-foreground py-4">
            No photos yet. Be the first to add one!
          </p>
        )}

      </div>
    </main>
  )
}
