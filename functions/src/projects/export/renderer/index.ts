import type { ProjectMode } from "../../projectInterface";
import type { RenderInput, RenderOutput } from "./types";
import { renderPdf } from "./pdf";
import { renderZip } from "./zip";

export type { RenderInput, RenderOutput };

/**
 * Dispatches to the appropriate renderer based on project mode.
 *   photobook → PDF
 *   portfolio → ZIP
 */
export async function renderExport(
	mode: ProjectMode,
	input: RenderInput,
): Promise<RenderOutput> {
	switch (mode) {
		case "photobook":
			return renderPdf(input);
		case "portfolio":
			return renderZip(input);
	}
}
