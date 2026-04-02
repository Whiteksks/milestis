import type { FieldValue } from "firebase-admin/firestore";
import type { ProjectMode } from "../projectInterface";

// ─── Cost ────────────────────────────────────────────────────────────────────

export const EXPORT_COST_CREDITS = 10;

// ─── Input ───────────────────────────────────────────────────────────────────

export interface ExportPublishInput {
	slug: string;
	/** Plaintext token (photobook only). Stored hashed in published_projects. */
	accessToken?: string;
}

export interface ExportInput {
	projectId: string;
	/** When provided, registers the project as published alongside the export. */
	publish?: ExportPublishInput;
}

// ─── Cloud Function response ─────────────────────────────────────────────────

export interface ExportOutput {
	ok: true;
	exportId: string;
	versionNumber: number;
	fileDownloadUrl: string;
	/** Present only when the request included a publish payload. */
	publishedSlug?: string;
	balance: {
		total: number;
		purchased: number;
		subscription: number;
		bonus: number;
	};
}

// ─── Firestore record (projects/{id}/exports/{exportId}) ─────────────────────

export interface ExportRecord {
	exportId: string;
	versionNumber: number;
	mode: ProjectMode;
	creditCost: number;
	filePath: string;
	fileDownloadUrl: string;
	mimeType: string;
	/** Set when the export also triggered a publish. */
	publishedSlug?: string;
	createdAt: FieldValue;
}
