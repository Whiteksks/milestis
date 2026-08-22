import { SLUG_BLOCKLIST, SLUG_MAX_LENGTH, SLUG_MIN_LENGTH, SLUG_REGEX } from "./constants"

export function normalizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
}

/**
 * Live-typing variant: converts a trailing space to a trailing hyphen instead of
 * silently dropping it, so typing a space behaves the same as pasting one mid-string.
 * The trailing hyphen is stripped later by `normalizeSlug` on submit/validation.
 */
export function normalizeSlugInput(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+/, "")
}

export function isSlugBlocked(slug: string): boolean {
  return SLUG_BLOCKLIST.has(slug)
}

export function getSlugValidationError(slug: string): string | null {
  if (
    !slug ||
    slug.length < SLUG_MIN_LENGTH ||
    slug.length > SLUG_MAX_LENGTH ||
    !SLUG_REGEX.test(slug)
  ) {
    return `slug must be ${SLUG_MIN_LENGTH}-${SLUG_MAX_LENGTH} lowercase alphanumeric characters or hyphens.`
  }

  return null
}

export function isSlugValid(slug: string): boolean {
  return getSlugValidationError(slug) === null
}