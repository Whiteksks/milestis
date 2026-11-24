# Shared content domain

Pure TypeScript used by both Next.js and Cloud Functions. It has no dependencies on React, Zustand, Firebase, Node APIs or the environment. It lives inside `functions/` so the Functions build can include it without copying.

| Module | Responsibility |
| --- | --- |
| `validation.ts` | Primitive checks and content errors |
| `pages.ts` | Page IDs, canonical paths, single home page |
| `menu/content.ts` | Catalog, page composition, limits, public projection |
| `menu/templates.ts`, `menu/mascot.ts` | Allowed templates and mascot settings |

The editor owns the UI and mutations. The publishing service owns permissions, transactions and media copying. See [menu docs](../../../docs/menu.md).
