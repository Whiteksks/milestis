import type { ProjectMode } from "../projectInterface";

/**
 * Per-mode behaviour flags for the exportProject Cloud Function.
 *
 * Adding a new project mode:
 *  1. Add its key to `ProjectMode` in projectInterface.ts
 *  2. Add an entry here — the function logic adapts automatically.
 *  3. Add a renderer case in renderer/index.ts if it produces a file.
 */
export interface ExportModeConfig {
	/**
	 * Whether a `publish` payload is required in the request body.
	 * When true, requests without a publish payload are rejected with 400.
	 */
	requiresPublish: boolean;

	/**
	 * Whether the mode produces a downloadable file (e.g. PDF).
	 * When true, the renderer is called and the result is uploaded to Storage.
	 */
	rendersFile: boolean;

	/**
	 * Whether `isExported: true` should be set on the project document.
	 * This flag drives the two-step "exported but not yet published" UI state.
	 * Only needed for modes where export and publish are separate steps.
	 */
	setsIsExported: boolean;

	/**
	 * Human-readable label used in log messages and error context.
	 */
	label: string;

	/**
	 * Credit cost for this export operation.
	 * Can be overridden per-mode if costs ever diverge.
	 */
	creditCost: number;
}

export const EXPORT_MODE_CONFIG: Record<ProjectMode, ExportModeConfig> = {
	portfolio: {
		label: "Portfolio",
		requiresPublish: true,   // publish is the only outcome — no ghost/download
		rendersFile: false,      // no file generated; media migrated + site published
		setsIsExported: false,   // no two-step flow
		creditCost: 10,
	},
	photobook: {
		label: "Photobook",
		requiresPublish: false,  // publish is optional — PDF download works standalone
		rendersFile: true,       // generates a PDF
		setsIsExported: true,    // enables "exported but not yet published" header state
		creditCost: 10,
	},
};

export function getModeConfig(mode: ProjectMode): ExportModeConfig {
	return EXPORT_MODE_CONFIG[mode];
}
