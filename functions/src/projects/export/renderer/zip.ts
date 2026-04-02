import type { RenderInput, RenderOutput } from "./types";

/**
 * Renders a portfolio project to a ZIP archive containing source files.
 *
 * TODO: Replace stub with a full implementation that:
 *   - Downloads all images from public/{projectId}/ and bundles them.
 *   - Generates a static HTML/CSS site from the content + theme data.
 *   - Packages everything into a portable ZIP.
 */
export async function renderZip(input: RenderInput): Promise<RenderOutput> {
	// Stub — produces a minimal text archive so the pipeline can be tested end-to-end.
	const readme = [
		`# ${input.projectName}`,
		``,
		`Exported from Milestis on ${new Date().toISOString().split("T")[0]}.`,
		``,
		`> ZIP generation is not yet fully implemented.`,
		`> This archive contains only the project metadata.`,
		``,
		`## Files`,
		`- content.json  — project content (text, layout, media references)`,
		`- theme.json    — visual theme settings`,
	].join("\n");

	// A minimal valid ZIP-like placeholder. Replace with a real JSZip/archiver call.
	const content = [
		readme,
		"--- content.json ---",
		JSON.stringify(input.content ?? null, null, 2),
		"--- theme.json ---",
		JSON.stringify(input.theme ?? null, null, 2),
	].join("\n\n");

	return {
		buffer: Buffer.from(content, "utf8"),
		mimeType: "application/zip",
		extension: "zip",
	};
}
