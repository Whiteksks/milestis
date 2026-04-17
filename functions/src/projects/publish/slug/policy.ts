import type { ProjectMode } from "../../projectInterface";

export type SlugNamespace = "global" | "mode";

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
		namespace: "mode",
		routeKind: "path",
	},
} as const satisfies Record<ProjectMode, SlugModePolicy>;

export function getSlugModePolicy(mode: ProjectMode): SlugModePolicy {
	return SLUG_MODE_POLICY[mode];
}