/**
 * Allowed CORS origins for all Cloud Functions.
 * Add new domains here — one place to update.
 */
export const ALLOWED_ORIGINS: RegExp[] = [
	/localhost/,
	/milestis\.com$/,
	/milestis\.site$/,
	/\.hosted\.app$/,
];
