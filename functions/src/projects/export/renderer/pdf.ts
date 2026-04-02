import type { RenderInput, RenderOutput } from "./types";

/**
 * Renders a photobook project to PDF.
 *
 * TODO: Replace stub with a real implementation (e.g. Puppeteer headless
 * Chrome rendering the photobook preview page, or a server-side PDF library).
 */
export async function renderPdf(_input: RenderInput): Promise<RenderOutput> {
	return {
		buffer: Buffer.from("%PDF-1.4 stub — PDF generation not yet implemented\n"),
		mimeType: "application/pdf",
		extension: "pdf",
	};
}
