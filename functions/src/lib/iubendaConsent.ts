// Iubenda temporarily disabled
// import { logger } from "firebase-functions/v2";

// const CONSENT_API_URL = "https://consent.iubenda.com/consent";

export interface IubendaConsentSubject {
	id: string;
	email?: string | null;
}

/**
 * Records explicit user consent via the iubenda Consent Solution HTTP API.
 *
 * Always fire-and-forget: await this call wrapped with `.catch(() => {})` so
 * that iubenda failures never break the primary business logic.
 *
 * Requires the `IUBENDA_PRIVATE_API_KEY` environment variable to be set.
 * Local dev: add it to `functions/.env` (already git-ignored).
 * Production: set it as a Cloud Run environment variable in the Firebase
 * console → Functions → (function) → Edit → Runtime environment variables.
 */
// Iubenda temporarily disabled — kept as a no-op so call sites still compile
export async function recordIubendaConsent(
	subject: IubendaConsentSubject,
	legalNoticeIdentifiers: string[],
	proof: string,
): Promise<void> {
	return;
	/*
	const apiKey = process.env.IUBENDA_PRIVATE_API_KEY;
	if (!apiKey || apiKey === "your_private_api_key_here") {
		logger.warn("[iubendaConsent] IUBENDA_PRIVATE_API_KEY is not configured — skipping consent recording.");
		return;
	}

	const body = {
		timestamp: new Date().toISOString(),
		subject: {
			id: subject.id,
			...(subject.email ? { email: subject.email } : {}),
		},
		legal_notices: legalNoticeIdentifiers.map((identifier) => ({ identifier })),
		proofs: [{ content: proof, form: "" }],
		preferences: Object.fromEntries(legalNoticeIdentifiers.map((id) => [id, true])),
	};

	try {
		const resp = await fetch(CONSENT_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"ApiKey": apiKey,
			},
			body: JSON.stringify(body),
		});

		if (!resp.ok) {
			const text = await resp.text().catch(() => "");
			logger.warn(`[iubendaConsent] API returned ${resp.status} for subject ${subject.id}: ${text}`);
		} else {
			logger.info(`[iubendaConsent] Consent recorded for subject ${subject.id}.`);
		}
	} catch (err) {
		logger.warn("[iubendaConsent] Network error while recording consent:", err);
	}
	*/
}
