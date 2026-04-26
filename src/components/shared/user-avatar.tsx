"use client"

import { useRef, useState } from "react"
import { ref as storageRef, uploadBytesResumable } from "firebase/storage"
import { Camera, Loader2 } from "lucide-react"
import BoringAvatar from "boring-avatars"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUserStore } from "@/hooks/useUserStore"
import { auth, storage } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"


const AVATAR_MAX_BYTES = 10 * 1024 * 1024 // 10 MB — Cloud Function handles the resize

type AvatarShape = "circle" | "square"
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl"

interface UserAvatarProps {
  /** Shape of the avatar: "circle" (default) or "square" (rounded-2xl) */
  shape?: AvatarShape
  /** Named size preset */
  size?: AvatarSize
  /**
   * When true, hovering over the avatar reveals a camera button that opens
   * the native file picker and uploads the image to Firebase Storage.
   * Status messages (uploading / error) are rendered below the avatar.
   */
  uploadable?: boolean
  /** Extra classes applied to the avatar wrapper div */
  className?: string
  /** Called after the upload task completes successfully */
  onUploaded?: () => void
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  xs: "size-6",
  sm: "size-8",
  md: "size-10",
  lg: "size-20",
  xl: "size-25",
}

/**
 * Universal user avatar component.
 *
 * - Reads the current user profile from the global store automatically.
 * - Supports circle and square shapes.
 * - Has a built-in upload flow (enabled via `uploadable`): hover → camera icon
 *   → file picker → uploads to `avatars/{uid}/original.{ext}` in Firebase Storage.
 *   The Cloud Function then resizes the image and updates the Firestore photoURL,
 *   which propagates back to the store and re-renders the avatar automatically.
 */
export function UserAvatar({
  shape = "circle",
  size = "md",
  uploadable = false,
  className,
  onUploaded,
}: UserAvatarProps) {
  const { profile } = useUserStore()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const displayName = profile?.displayName ?? ""
  const photoURL = profile?.photoURL ?? ""
  const avatarSeed = profile?.uid ?? displayName ?? "default"

  const rounded = shape === "square" ? "rounded-2xl" : "rounded-full"

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    // Reset so the same file can be re-selected after an error
    e.target.value = ""
    if (!file) return

    const uid = auth.currentUser?.uid
    if (!uid) return

    if (file.size > AVATAR_MAX_BYTES) {
      setError("Image must be smaller than 10 MB")
      return
    }

    const ext = file.name.split(".").pop() ?? "jpg"
    const path = `avatars/${uid}/original.${ext}`
    const sRef = storageRef(storage, path)

    setUploading(true)
    setError(null)

    const task = uploadBytesResumable(sRef, file, { contentType: file.type })
    task.on(
      "state_changed",
      null,
      (err) => {
        setError(err.message)
        setUploading(false)
      },
      () => {
        setUploading(false)
        onUploaded?.()
      },
    )
  }

  const avatarEl = (
    <div className={cn("relative group shrink-0", SIZE_CLASSES[size], className)}>
      <Avatar className={cn("size-full", rounded)}>
        <AvatarImage src={photoURL || undefined} alt={displayName || "Avatar"} />
        <AvatarFallback className={cn(rounded, "overflow-hidden")}>
          <BoringAvatar
            size="100%"
            name={avatarSeed}
            variant="beam"
            colors={["#F4A8C0", "#F9C784", "#C4B5E0", "#9ECFB8", "#89C4D4"]}
          />
        </AvatarFallback>
      </Avatar>

      {uploadable && (
        <>
          <Button
            variant="ghost"
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label="Change profile photo"
            className={cn(
              "absolute inset-0 h-full w-full p-0",
              "flex items-center justify-center",
              "bg-transparent hover:bg-foreground/40",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              "disabled:cursor-not-allowed",
              rounded 
            )}
          >
            {uploading ? (
              <Loader2 className="h-1/3 w-1/3 text-background animate-spin" />
            ) : (
              <Camera className="h-1/3 w-1/3 text-background" />
            )}
          </Button>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  )

  if (!uploadable) return avatarEl

  return (
    <div className="flex flex-col items-start gap-1 shrink-0">
      {avatarEl}
      {uploading && (
        <p className="text-xs text-muted-foreground">Uploading photo...</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
