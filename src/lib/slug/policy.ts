export const SLUG_MODE_POLICY = {
  portfolio: {
    namespace: "global",
    routeKind: "subdomain",
  },
  photobook: {
    namespace: "token",
    routeKind: "path",
  },
  event: {
    namespace: "token",
    routeKind: "path",
  },
} as const

export type SlugMode = keyof typeof SLUG_MODE_POLICY
export type SlugModePolicy = (typeof SLUG_MODE_POLICY)[SlugMode]

export function isSlugMode(value: string | null | undefined): value is SlugMode {
  return typeof value === "string" && value in SLUG_MODE_POLICY
}

export function getSlugModePolicy(mode: SlugMode): SlugModePolicy {
  return SLUG_MODE_POLICY[mode]
}