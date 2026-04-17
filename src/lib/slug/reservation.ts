import type { SlugMode } from "./policy"
import { getSlugModePolicy } from "./policy"

/**
 * Returns the Firestore doc ID for a slug reservation.
 * - global namespace (subdomain modes): the slug itself
 * - token namespace (path+token modes): the hashed access token
 */
export function getSlugReservationDocId(
  mode: SlugMode,
  slug: string,
  hashedToken?: string,
): string {
  const { namespace } = getSlugModePolicy(mode)
  if (namespace === "global") return slug
  if (!hashedToken) throw new Error(`hashedToken is required for ${mode} reservation`)
  return hashedToken
}