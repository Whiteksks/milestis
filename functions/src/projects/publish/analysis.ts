import { siteConfig } from "../../config/environment";
import { buildPublishedUrl } from "../../config/project";
import type { ProjectMode } from "../projectInterface";
import { getSlugModePolicy } from "./slug/policy";

export const QUOTE_TTL_MS = 10 * 60 * 1000;
export const BODY_SIZE_LIMIT_BYTES = 1024;

/**
 * Counts unique photos by image ID so multiple variants count as one.
 * Falls back to counting unique Storage URLs when no image IDs are found.
 */
export function countUniquePhotos(content: unknown): number {
	const json = JSON.stringify(content);
	const unique = new Set<string>();
	// Accept public and private paths, with either / or %2F before "images".
	const re = /"https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+(?:\/|%2F)images%2F([^%"]+)%2F[^"]+"/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(json)) !== null) {
		unique.add(m[1]);
	}
	if (unique.size === 0) {
		const urls = json.match(/"https:\/\/firebasestorage\.googleapis\.com\/v0\/b\/[^"]+"/g);
		return urls ? new Set(urls).size : 0;
	}
	return unique.size;
}

export function buildDomain(mode: ProjectMode, slug: string): string {
	const policy = getSlugModePolicy(mode);
	return buildPublishedUrl(siteConfig.publishedSiteUrl, slug, policy.routeKind === "subdomain");
}
