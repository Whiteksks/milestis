import type { ProjectMode } from "../../projectInterface";

export interface RenderInput {
	projectId: string;
	projectName: string;
	mode: ProjectMode;
	content: Record<string, unknown> | null;
	theme: Record<string, unknown> | null;
}

export type RenderExtension = "pdf" | "zip";

export interface RenderOutput {
	buffer: Buffer;
	mimeType: string;
	extension: RenderExtension;
}
