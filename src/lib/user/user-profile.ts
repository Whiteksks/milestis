import { doc, serverTimestamp, updateDoc } from "firebase/firestore"
import { updateProfile, verifyBeforeUpdateEmail } from "firebase/auth"
import { auth, db } from "@/lib/firebase/firebase"
import type { UserProfileTemplate, UserSettings } from "@/lib/user/user-update.dto"

export interface UserProfileUpdate {
  displayName?: string
  profileTemplate?: UserProfileTemplate
  settings?: {
    language?: UserSettings["language"]
    notifications?: Partial<UserSettings["notifications"]>
  }
}

// Recursively removes undefined values so Firestore never receives them.
// Uses constructor check to avoid recursing into FieldValue / Timestamp etc.
function stripUndefined(obj: Record<string, any>): Record<string, any> {
  const result: Record<string, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue
    if (value !== null && typeof value === "object" && value.constructor === Object) {
      result[key] = stripUndefined(value)
    } else {
      result[key] = value
    }
  }
  return result
}

export async function saveUserProfile(update: UserProfileUpdate): Promise<void> {
  const user = auth.currentUser
  if (!user) {
    throw new Error("User is not authenticated")
  }

  const userRef = doc(db, "users", user.uid)

  // Use dot-notation keys for nested fields so Firestore merges them
  // instead of overwriting the entire `settings` or `profileTemplate` object.
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() }

  if (typeof update.displayName === "string") {
    payload.displayName = update.displayName
  }
  if (update.profileTemplate) {
    // profileTemplate is always saved as a whole from the profile page
    payload.profileTemplate = update.profileTemplate
  }
  if (update.settings?.language !== undefined) {
    payload["settings.language"] = update.settings.language
  }
  if (update.settings?.notifications !== undefined) {
    payload["settings.notifications"] = update.settings.notifications
  }

  await updateDoc(userRef, stripUndefined(payload))

  if (typeof update.displayName === "string" && update.displayName !== user.displayName) {
    await updateProfile(user, { displayName: update.displayName })
  }
}

export async function changeUserEmail(newEmail: string): Promise<void> {
  const user = auth.currentUser
  if (!user) {
    throw new Error("User is not authenticated")
  }

  // Отправляет письмо подтверждения на новый адрес.
  // Email в Firebase Auth и Firestore изменится только после того,
  // как пользователь кликнет по ссылке. Обновление Firestore должно
  // происходить через Cloud Function триггер onUserUpdated, а не здесь.
  await verifyBeforeUpdateEmail(user, newEmail)
}
