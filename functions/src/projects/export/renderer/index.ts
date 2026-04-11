import type { ProjectMode } from "../../projectInterface";
import type { RenderInput, RenderOutput } from "./types";
import { renderPdf } from "./pdf";

export type { RenderInput, RenderOutput };

/**
 * Dispatches to the appropriate renderer based on project mode.
 *   photobook → PDF
 *   portfolio → no file rendered (client handles publish-only flow)
 */
export async function renderExport(
	mode: ProjectMode,
	input: RenderInput,
): Promise<RenderOutput | null> {
	switch (mode) {
		case "photobook":
			return renderPdf(input);
		case "portfolio":
			return null;
	}
}
