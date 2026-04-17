export type SlugMode = "portfolio" | "photobook"

export interface SlugModePolicy {
  namespace: "global" | "mode"
  routeKind: "subdomain" | "path"
}

export const SLUG_MODE_POLICY = {
  portfolio: {
    namespace: "global",
    routeKind: "subdomain",
  },
  photobook: {
    namespace: "mode",
    routeKind: "path",
  },
} as const satisfies Record<SlugMode, SlugModePolicy>

export function isSlugMode(value: string | null | undefined): value is SlugMode {
  return value === "portfolio" || value === "photobook"
}

export function getSlugModePolicy(mode: SlugMode): SlugModePolicy {
  return SLUG_MODE_POLICY[mode]
}