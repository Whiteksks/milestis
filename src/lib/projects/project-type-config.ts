/**
 * Per-project-type UI configuration.
 *
 * Add a new entry here when introducing a new project type.
 * Business logic (cloud functions, API calls) stays in its own layer —
 * this file only describes what to show and what actions are available.
 */

import { buildPublishedProjectUrl } from '@/lib/slug'

export const PROJECT_TYPE_CONFIG = {
  menu: {
    label: 'Menu', hasAccessToken: false, primaryActionLabel: 'Publish', republishLabel: 'Update menu',
    archiveBadge: 'MENU', archiveRecordTitle: 'Restaurant menu', canDownloadFile: false, requiresSlug: true,
    getShareUrl: (slug: string) => buildPublishedProjectUrl('menu', slug),
    modal: {
      title: 'Publish menu', description: 'Restaurant menu', costLabel: 'Menu', costDescription: '',
      actionLabel: 'Publish menu', pendingLabel: 'Publishing...', republishWarning: '', addressLabel: 'Menu address',
    },
  },
  portfolio: {
    /** Human-readable label */
    label: 'Portfolio',

    /** Whether this mode uses a private access token for viewing. */
    hasAccessToken: false,

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
    getShareUrl: (slug: string) => buildPublishedProjectUrl('portfolio', slug),

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

    /** Whether this mode uses a private access token for viewing. */
    hasAccessToken: true,

    primaryActionLabel: 'Publish',
    republishLabel: 'Republish',

    archiveBadge: 'BOOK',
    archiveRecordTitle: 'Published Photobook',
    canDownloadFile: false,

    requiresSlug: true,
    getShareUrl: (slug: string, accessToken?: string) =>
      buildPublishedProjectUrl('photobook', slug, accessToken),

    modal: {
      title: 'Publish Photobook',
      description: 'Share a private link to your photobook. Only people with the link can view it.',
      costLabel: 'Photobook Publish',
      costDescription: 'Migrate media & publish photobook',
      actionLabel: 'Publish Photobook',
      pendingLabel: 'Publishing…',
      republishWarning: 'Your current photobook link will be replaced. Visitors with the old link will see the updated version.',
      addressLabel: 'Your photobook address',
    },
  },

  event: {
    label: 'Event',

    /** Events use a private access token like photobooks. */
    hasAccessToken: true,

    primaryActionLabel: 'Publish Event',
    republishLabel: 'Republish Event',

    archiveBadge: 'EVENT',
    archiveRecordTitle: 'Event Photobook',
    canDownloadFile: false,

    requiresSlug: true,
    getShareUrl: (slug: string, accessToken?: string) =>
      buildPublishedProjectUrl('event', slug, accessToken),

    modal: {
      title: 'Publish Event',
      description: 'Share a link or QR code with guests. Guests can upload photos without registering.',
      costLabel: 'Event Publish',
      costDescription: 'Migrate media & publish event',
      actionLabel: 'Publish Event',
      pendingLabel: 'Publishing…',
      republishWarning: 'The existing event link will be replaced with the new one.',
      addressLabel: 'Event link',
    },
  },
} as const

export type ProjectMode = keyof typeof PROJECT_TYPE_CONFIG

export function getProjectConfig(mode: ProjectMode) {
  return PROJECT_TYPE_CONFIG[mode]
}
