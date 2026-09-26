# Shared content domain

Pure TypeScript consumed by the Next.js app and Cloud Functions. No React, Zustand,
Firebase, Node APIs or environment variables belong here. The sources live inside
the Functions source tree so the existing standalone Firebase deployment compiles
and includes them without copying files or maintaining a second set of rules.

- `pages.ts`: page identity, canonical paths and the home-page invariant.
- `menu/content.ts`: shared venue/catalog, page composition, validation and public projection.
- The editor owns UI state and mutations; the publication service owns permissions,
  Firestore transactions and image copying.

Only menu uses pages at present. Portfolio has not been migrated.
