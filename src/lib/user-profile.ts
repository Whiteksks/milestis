import { doc, serverTimestamp, setDoc } from "firebase/firestore"
import { updateEmail, updateProfile } from "firebase/auth"
import { auth, db } from "@/lib/firebase"

export interface UserProfileUpdate {
  displayName?: string
  profileTemplate?: {
    name?: string
    location?: string
    bio?: string
    sociallinks?: {
      link1?: string
      link2?: string
      link3?: string
      link4?: string
    }
  }
  settings?: {
    language?: "ru" | "en" | "kz"
    notifications?: {
      project_updates?: boolean
      project_reminders?: boolean
      project_milestones?: boolean
      whats_new?: boolean
      personalized_recommendations?: boolean
      seasonal_specials?: boolean
    }
  }
}

export async function saveUserProfile(update: UserProfileUpdate): Promise<void> {
  const user = auth.currentUser
  if (!user) {
    throw new Error("User is not authenticated")
  }

  const userRef = doc(db, "users", user.uid)
  const payload = {
    ...(typeof update.displayName === "string" ? { displayName: update.displayName } : {}),
    ...(update.profileTemplate ? { profileTemplate: update.profileTemplate } : {}),
    ...(update.settings ? { settings: update.settings } : {}),
    updatedAt: serverTimestamp(),
  }

  await setDoc(userRef, payload, { merge: true })

  if (typeof update.displayName === "string" && update.displayName !== user.displayName) {
    await updateProfile(user, { displayName: update.displayName })
  }
}

export async function changeUserEmail(newEmail: string): Promise<void> {
  const user = auth.currentUser
  if (!user) {
    throw new Error("User is not authenticated")
  }

  await updateEmail(user, newEmail)

  const userRef = doc(db, "users", user.uid)
  await setDoc(
    userRef,
    {
      email: newEmail,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  )
}
