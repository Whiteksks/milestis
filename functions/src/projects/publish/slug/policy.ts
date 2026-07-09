import type { ProjectMode } from "../../projectInterface";

export type SlugNamespace = "global" | "token";

export interface SlugModePolicy {
	namespace: SlugNamespace;
	routeKind: "subdomain" | "path";
}

export const SLUG_MODE_POLICY = {
	portfolio: {
		namespace: "global",
		routeKind: "subdomain",
	},
	photobook: {
		namespace: "token",
		routeKind: "path",
	},
	// Events use shareCode-based routing (/e/[shareCode]), not slugs.
	event: {
		namespace: "token",
		routeKind: "path",
	},
} as const satisfies Record<ProjectMode, SlugModePolicy>;

export function getSlugModePolicy(mode: ProjectMode): SlugModePolicy {
	return SLUG_MODE_POLICY[mode];
}