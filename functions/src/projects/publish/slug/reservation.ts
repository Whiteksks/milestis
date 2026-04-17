import type { ProjectMode } from "../../projectInterface";
import { getSlugModePolicy } from "./policy";

export function getSlugReservationDocId(mode: ProjectMode, slug: string): string {
	return getSlugModePolicy(mode).namespace === "global" ? slug : `${mode}:${slug}`;
}