const REFERRAL_STORAGE_KEY = "milestis_ref"

/** Builds the shareable invite link that carries the current user's uid as the referral code. */
export function buildReferralLink(uid: string, locale: string): string {
  const origin = typeof window !== "undefined" ? window.location.origin : ""
  return `${origin}/${locale}/auth/login?ref=${uid}`
}

/** Reads `?ref=` from the current URL (if present) and persists it so it survives the magic-link redirect. */
export function captureReferralParam(): void {
  if (typeof window === "undefined") return
  const ref = new URLSearchParams(window.location.search).get("ref")
  if (ref) window.localStorage.setItem(REFERRAL_STORAGE_KEY, ref)
}

/** Reads the stored referral code without clearing it. */
export function peekReferralCode(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(REFERRAL_STORAGE_KEY)
}

/** Reads and removes the stored referral code — call once the code has been sent to createUser. */
export function consumeReferralCode(): string | null {
  const ref = peekReferralCode()
  if (ref && typeof window !== "undefined") window.localStorage.removeItem(REFERRAL_STORAGE_KEY)
  return ref
}
