import JSZip from "jszip";
import type { RenderInput, RenderOutput } from "./types";

// ─── Config ──────────────────────────────────────────────────────────────────

/** URL of the Next.js app (e.g. https://milestis.site). Set via Firebase Function env. */
const NEXT_APP_URL = process.env.NEXT_APP_URL;
/** Shared secret that the Next.js render API route validates. */
const RENDER_SECRET = process.env.EXPORT_RENDER_SECRET;

// ─── Types ────────────────────────────────────────────────────────────────────

interface RenderApiResponse {
	html: string;
	imageUrls: string[];
	background: string; // Tailwind class e.g. "bg-[#F5F1EB]"
	foreground: string; // Tailwind class e.g. "text-[#2C2419]"
	projectName: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Download a remote URL to a Buffer. Throws on non-2xx response. */
async function fetchBuffer(url: string): Promise<Buffer> {
	const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });
	if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
	return Buffer.from(await res.arrayBuffer());
}

/**
 * Derive a safe, unique filename from a Firebase Storage URL.
 * firebase.../o/public%2Fprojects%2Fhero.jpg?alt=media  →  hero.jpg
 * Falls back to "img-{index}.bin" on parse errors.
 */
function storageUrlToFilename(url: string, index: number): string {
	try {
		const parsed = new URL(url);
		// The Storage object path sits between /o/ and the query string.
		const rawPath = parsed.pathname.split("/o/")[1] ?? "";
		const decoded = decodeURIComponent(rawPath.split("?")[0]);
		const base = decoded.split("/").pop() ?? "";
		// Strip any remaining unsafe characters (tokens, etc.)
		const safe = base.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
		return safe || `img-${index}`;
	} catch {
		return `img-${index}`;
	}
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

/**
 * Wrap the rendered portfolio HTML in a full, self-contained HTML document.
 *
 * Styles strategy:
 *   • Tailwind Play CDN v3 — scans the DOM at runtime and generates all
 *     used utility classes, including arbitrary values like bg-[#F5F1EB]
 *     and container queries (@container, @md:*).
 *   • Requires an internet connection on first view (CDN is cached after that).
 *   • All project images are bundled locally in assets/ so offline viewing
 *     still shows content; only the CDN CSS requires the network.
 */
function buildHtmlPage(opts: {
	projectName: string;
	background: string;
	foreground: string;
	body: string;
}): string {
	const { projectName, background, foreground, body } = opts;
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(projectName)}</title>
  <!-- Google Fonts: same as editor (Alice → sans, Cormorant Garamond → serif, IBM Plex Mono → mono) -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Alice&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <!-- Tailwind Play CDN: generates all used utilities at runtime -->
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    /* Font variables: mirror Next.js layout.tsx font assignments */
    :root {
      --font-sans: 'Alice', ui-sans-serif, system-ui, sans-serif;
      --font-serif: 'Cormorant Garamond', ui-serif, Georgia, serif;
      --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
    }
    /* Base resets */
    *, ::before, ::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; min-height: 100%; }
    body { margin: 0; min-height: 100vh; }
    /* Ensure @container queries work (Tailwind CDN includes the plugin) */
    .\\@container { container-type: inline-size; }
  </style>
  <script>
    /* Apply font variables to Tailwind so font-sans/serif/mono use the correct families */
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Alice', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            serif: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
            mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
          },
        },
      },
    }
  </script>
</head>
<body class="${background} ${foreground}">
${body}
</body>
</html>`;
}

// ─── Main renderer ────────────────────────────────────────────────────────────

/**
 * Renders a portfolio project to a self-contained ZIP archive.
 *
 * Artefacts:
 *   index.html  — full static page (Tailwind CDN + rendered template HTML)
 *   assets/     — all project images downloaded from Firebase Storage
 */
export async function renderZip(input: RenderInput): Promise<RenderOutput> {
	if (!NEXT_APP_URL) throw new Error("NEXT_APP_URL env var is not set.");
	if (!RENDER_SECRET) throw new Error("EXPORT_RENDER_SECRET env var is not set.");

	// ── 1. Extract template / theme IDs from stored project data ────────────
	const themeData = (input.theme ?? {}) as Record<string, unknown>;
	const contentData = (input.content ?? {}) as Record<string, unknown>;

	const templateId = (themeData.currentTemplateId as string | undefined) ?? "minimal";
	const themeId = (themeData.currentTheme as string | undefined) ?? "parchment";
	const sectionContent = (contentData.sectionContent ?? {}) as Record<string, unknown>;
	const sectionVisibility = (contentData.sectionVisibility ?? {}) as Record<string, boolean>;

	// ── 2. Call the Next.js SSR render endpoint ──────────────────────────────
	const renderRes = await fetch(`${NEXT_APP_URL}/api/export/render-portfolio`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"x-render-key": RENDER_SECRET,
		},
		body: JSON.stringify({
			templateId,
			themeId,
			sectionContent,
			sectionVisibility,
			projectName: input.projectName,
		}),
		signal: AbortSignal.timeout(60_000),
	});

	if (!renderRes.ok) {
		const errText = await renderRes.text().catch(() => renderRes.statusText);
		throw new Error(`Render API returned ${renderRes.status}: ${errText}`);
	}

	const renderData = (await renderRes.json()) as RenderApiResponse;

	// ── 3. Download images in parallel ──────────────────────────────────────
	/** url → local asset filename */
	const imageMap = new Map<string, string>();
	/** Collected image data (filename + bytes) for the ZIP */
	const imageFiles: Array<{ filename: string; buffer: Buffer }> = [];
	// Deduplicate by original URL (imageUrls are already deduplicated)
	const seenFilenames = new Set<string>();

	await Promise.allSettled(
		renderData.imageUrls.map(async (url, index) => {
			let filename = storageUrlToFilename(url, index);
			// Handle duplicate names (e.g. two images called "thumb.jpg")
			if (seenFilenames.has(filename)) {
				const ext = filename.includes(".") ? `.${filename.split(".").pop()}` : "";
				filename = `${filename.replace(/\.[^.]+$/, "")}-${index}${ext}`;
			}
			seenFilenames.add(filename);

			try {
				const buffer = await fetchBuffer(url);
				imageMap.set(url, `./assets/${filename}`);
				imageFiles.push({ filename, buffer });
			} catch {
				// Non-fatal: image stays as remote URL in the HTML.
				// The portfolio is still viewable when online.
			}
		}),
	);

	// ── 4. Patch image URLs in HTML to point to local assets ────────────────
	let patchedHtml = renderData.html;
	for (const [originalUrl, localPath] of imageMap) {
		patchedHtml = patchedHtml.split(originalUrl).join(localPath);
	}

	// ── 5. Build full HTML page ──────────────────────────────────────────────
	const fullHtml = buildHtmlPage({
		projectName: input.projectName,
		background: renderData.background,
		foreground: renderData.foreground,
		body: patchedHtml,
	});

	// ── 6. Assemble ZIP ──────────────────────────────────────────────────────
	const zip = new JSZip();
	zip.file("index.html", fullHtml);

	const assets = zip.folder("assets")!;
	for (const { filename, buffer } of imageFiles) {
		assets.file(filename, buffer);
	}

	const zipBuffer = await zip.generateAsync({
		type: "nodebuffer",
		compression: "DEFLATE",
		compressionOptions: { level: 6 },
	});

	return {
		buffer: zipBuffer,
		mimeType: "application/zip",
		extension: "zip",
	};
}
