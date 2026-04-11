/**
 * Per-project-type UI configuration.
 *
 * Add a new entry here when introducing a new project type.
 * Business logic (cloud functions, API calls) stays in its own layer —
 * this file only describes what to show and what actions are available.
 */

export const PROJECT_TYPE_CONFIG = {
  portfolio: {
    /** Human-readable label */
    label: 'Portfolio',

    // ── Editor header ─────────────────────────────────────────────────────
    /** Primary action button label (unpublished state) */
    primaryActionLabel: 'Publish',
    /** Label inside the published dropdown to re-trigger the action */
    republishLabel: 'Republish',

    // ── Archive page ──────────────────────────────────────────────────────
    /** Badge text shown next to the record in the archive */
    archiveBadge: 'SITE',
    /** Record title in the archive */
    archiveRecordTitle: 'Published Site',
    /** Portfolio publish produces no downloadable file */
    canDownloadFile: false,

    // ── Sharing ───────────────────────────────────────────────────────────
    requiresSlug: true,
    /** Build the canonical public URL for a published project */
    getShareUrl: (slug: string) => `https://${slug}.milestis.site`,

    // ── Billing ───────────────────────────────────────────────────────────
    creditCost: 10,

    // ── Publish / Export modal ─────────────────────────────────────────────
    modal: {
      title: 'Publish Portfolio',
      description: 'Your portfolio will be published on a custom subdomain. Credits are used to migrate your media and activate the site.',
      costLabel: 'Portfolio Publish',
      costDescription: 'Migrate media & publish site',
      actionLabel: 'Publish Portfolio',
      pendingLabel: 'Publishing…',
      /** Shown when republishing an already-live portfolio */
      republishWarning: 'Your current site will be replaced immediately. Visitors will see the updated version right away.',
      /** Label above the slug form */
      addressLabel: 'Your site address',
    },
  },

  photobook: {
    label: 'Photobook',

    primaryActionLabel: 'Export PDF',
    republishLabel: 'Re-export',

    archiveBadge: 'PDF',
    archiveRecordTitle: 'Document Archive',
    /** Photobook export generates a PDF that can be downloaded */
    canDownloadFile: true,

    requiresSlug: false,
    getShareUrl: (slug: string, accessToken?: string) =>
      accessToken
        ? `https://milestis.site/${slug}?token=${accessToken}`
        : `https://milestis.site/${slug}`,

    creditCost: 10,

    // ── Publish / Export modal ─────────────────────────────────────────────
    modal: {
      title: 'Export PDF',
      description: 'Download your photobook as a print-ready PDF.',
      costLabel: 'PDF Export',
      costDescription: 'Print-ready PDF',
      actionLabel: 'Export PDF',
      actionLabelWithPublish: 'Export & Publish',
      pendingLabel: 'Exporting…',
      /** Shown when re-exporting an already-exported photobook */
      republishWarning: 'This will replace your previous export. Download the current PDF first if you still need it.',
      /** Label for the optional online-publish section */
      publishToggleLabel: 'Publish online',
      publishToggleDescription: 'Share a private link to your photobook.',
    },
  },
} as const

export type ProjectMode = keyof typeof PROJECT_TYPE_CONFIG

export function getProjectConfig(mode: ProjectMode) {
  return PROJECT_TYPE_CONFIG[mode]
}
