import type { ProjectMode } from "../projectInterface";

export const PUBLISHED_PROJECT_SLUGS_COLLECTION = "published_project_slugs";

export function getPublishedSlugReservationDocId(mode: ProjectMode, slug: string): string {
	return `${mode}:${slug}`;
}