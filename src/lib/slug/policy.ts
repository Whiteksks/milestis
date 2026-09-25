export const SLUG_MODE_POLICY = {
  menu: { namespace: "global", routeKind: "subdomain" },
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
  return typeof value === "string" && Object.hasOwn(SLUG_MODE_POLICY, value)
}

export function getSlugModePolicy(mode: SlugMode): SlugModePolicy {
  return SLUG_MODE_POLICY[mode]
}
