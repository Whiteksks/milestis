import { auth } from "../firebase/firebase"
import {
  AuthError,
  EmailAuthProvider,
  GoogleAuthProvider,
  linkWithCredential,
  linkWithPopup,
  sendSignInLinkToEmail as firebaseSendSignInLinkToEmail,
  unlink,
} from "firebase/auth"
import { getFirebaseAuthErrorTranslationKey } from "../firebase/firebase-errors"

export const GOOGLE_PROVIDER_ID = GoogleAuthProvider.PROVIDER_ID // "google.com"
export const EMAIL_PROVIDER_ID = EmailAuthProvider.PROVIDER_ID  // "password"

/**
 * localStorage key used to persist the email address when a user initiates
 * the email-linking flow (Google-first account adding a magic link).
 * The /auth/finish page reads this key to decide between sign-in and linking.
 */
export const LINKING_EMAIL_KEY = "emailForLinking"

/** Returns the list of provider IDs currently linked to the signed-in user. */
export function getLinkedProviders(): string[] {
  return auth.currentUser?.providerData.map((p) => p.providerId) ?? []
}

/**
 * Link a Google account to the current user via a popup window.
 * Works for email-first users who want to add Google as a sign-in method.
 */
export async function linkGoogleAccount(): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = auth.currentUser
    if (!user) throw new Error("Not authenticated")
    await linkWithPopup(user, new GoogleAuthProvider())
    return { success: true, error: null }
  } catch (error) {
    const authError = error as AuthError
    return { success: false, error: getFirebaseAuthErrorTranslationKey(authError.code) }
  }
}

/**
 * Unlink the Google provider from the current user.
 * Should only be called when the email (magic link) provider is also linked,
 * so the user retains a way to sign in.
 */
export async function unlinkGoogleAccount(): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = auth.currentUser
    if (!user) throw new Error("Not authenticated")
    await unlink(user, GOOGLE_PROVIDER_ID)
    return { success: true, error: null }
  } catch (error) {
    const authError = error as AuthError
    return { success: false, error: getFirebaseAuthErrorTranslationKey(authError.code) }
  }
}

/**
 * Send a magic link to the given email address for the purpose of linking it
 * to the current (Google-first) account — not for signing in.
 *
 * Stores the email in localStorage under `LINKING_EMAIL_KEY` so the
 * /auth/finish page can detect the linking flow and call
 * `completeLinkWithEmailLink` instead of `signInWithEmailLink`.
 */
export async function sendEmailLinkForLinking(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const actionCodeSettings = {
      url: window.location.origin + "/auth/finish?flow=link",
      handleCodeInApp: true,
    }
    await firebaseSendSignInLinkToEmail(auth, email, actionCodeSettings)
    window.localStorage.setItem(LINKING_EMAIL_KEY, email)
    return { success: true, error: null }
  } catch (error) {
    const authError = error as AuthError
    return { success: false, error: getFirebaseAuthErrorTranslationKey(authError.code) }
  }
}

/**
 * Complete linking the email (magic link) provider to the currently signed-in user.
 * Must be called on the /auth/finish page when:
 *   - `auth.currentUser` is not null (user is already signed in, e.g. via Google)
 *   - `localStorage.getItem(LINKING_EMAIL_KEY)` contains the email to link
 *
 * Clears `LINKING_EMAIL_KEY` from localStorage on success.
 */
export async function completeLinkWithEmailLink(email: string): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = auth.currentUser
    if (!user) throw new Error("Not authenticated")
    const credential = EmailAuthProvider.credentialWithLink(email, window.location.href)
    await linkWithCredential(user, credential)
    window.localStorage.removeItem(LINKING_EMAIL_KEY)
    return { success: true, error: null }
  } catch (error) {
    const authError = error as AuthError
    return { success: false, error: getFirebaseAuthErrorTranslationKey(authError.code) }
  }
}
