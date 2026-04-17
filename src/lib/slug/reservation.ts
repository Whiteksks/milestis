import type { SlugMode } from "./policy"
import { getSlugModePolicy } from "./policy"

export function getSlugReservationDocId(mode: SlugMode, slug: string): string {
  return getSlugModePolicy(mode).namespace === "global" ? slug : `${mode}:${slug}`
}