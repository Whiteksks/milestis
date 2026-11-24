# Architecture

Two independent packages: the Next.js app at the root and Firebase Functions in `functions/`. Each has its own dependencies, linter and build. The app also imports pure domain types and validators from `functions/src/domain/`.

## Code map

| Path | Contents |
| --- | --- |
| `src/app/[locale]/` | Marketing pages, auth, dashboard, editor |
| `src/app/api/` | Server routes: AI, checkout |
| `src/app/sites/[slug]/` | Public renderer for published projects |
| `src/proxy.ts` | Publication hosts, locales, rewrites, redirects |
| `src/editor/lib/modes/` | Mode registry; save and restore through the mode contract |
| `src/editor/modes/` | `portfolio`, `photobook`, `event`, `menu` |
| `src/editor/image/` | [Image contracts and rendering](../src/editor/image/README.md) |
| `src/lib/firebase/` | Client SDK, App Check, Admin SDK |
| `src/lib/ai/` | [AI contracts and execution](ai-editor.md) |
| `functions/src/domain/` | [Shared validators and content types](../functions/src/domain/README.md) |
| `functions/src/projects/` | Create, publish, menu, events, deletion |
| `functions/src/transactions/` | Credit engine, admin operations, Polar webhook |
| `functions/src/users/` | Profiles, subscriptions, account operations |
| `messages/{en,ru,kz}` | Translations |
| `firestore.rules`, `storage.rules`, `firestore.indexes.json` | Access rules, indexes, TTL |

## Projects and publishing

- `projects/{id}` stores the owner, mode, status and publication info.
- `projects/{id}/data/content` stores the working `theme` and `content`. The editor state lives in Zustand and is saved by `useAutoSave` through the mode contract.
- `published_projects/{id}` is a separate public snapshot. Autosave never touches it.

| Mode | Published at | Access |
| --- | --- | --- |
| Portfolio | `{slug}.<pages-domain>` | Public |
| Menu | `{slug}.<pages-domain>` plus page paths | Public while the menu plan is paid |
| Photobook | `<pages-domain>/{slug}?share=TOKEN` | Token link |
| Event (hidden for new projects) | `<pages-domain>/{slug}?share=TOKEN` | Token link; guest uploads via Anonymous Auth |

Slugs are reserved on the server and stay reserved after unpublishing. Share tokens are stored as hashes.

Portfolio, photobook and event use `analyzeProject → publishProject`:

1. Analysis calculates the cost and checks photos with SafeSearch.
2. Publishing copies used media to public storage, writes the snapshot and archives the project. Private media is cleaned up afterwards.
3. To change a published project, unpublish it, then run `analyzeRepublish → republishProject`. The user pays `max(0, new cost − previously paid)`.

Pricing rules are in `functions/src/projects/publish/config.ts`. Menus use their own flow, see [menu.md](menu.md).

`proxy.ts` only routes requests. Access is enforced by handlers and Firebase Rules. Deleted projects are purged by a scheduled job once `purgeAt` has passed.

## Credits and subscriptions

Polar checkouts are created in Next.js. Signed webhooks are handled by the `webhookPolar` Function. The subscription tier comes from the product metadata `tier`. Server-side limits are in `functions/src/users/upsertSubscription.ts`, client-side checks in `src/lib/billing/`.

`functions/src/transactions/engine.ts` updates the following in one Firestore transaction:

- user balance;
- credit lots (`creditLots`) with expiry dates;
- transaction history;
- idempotency record.

Rules:

- Available credits exclude expired lots.
- Spending order: subscription, then bonus, then purchased. Within a source, the lot that expires soonest goes first.
- Retrying with the same idempotency key and parameters returns the original result. The same key with different parameters fails with `idempotency_conflict`.
- If the balance and the lots disagree, the operation fails with `balance_inconsistent` and writes nothing.

AI usage does not spend credits. It has separate rate limits, see [ai-editor.md](ai-editor.md).

## Admin credits

Admins can grant compensation as non-expiring bonus credits. The grant goes through the same engine, as source `bonus` and type `admin_adjustment`.

- Access is controlled by the custom claim `creditsAdmin: true`. The `adminCredits` Function re-reads the admin account on every call, so a revoked claim takes effect immediately.
- The role is granted with `functions/scripts/set-credits-admin.cjs`. It is a dry run by default and needs `--apply` to write.
- The UI keeps an unfinished request in `sessionStorage` and retries it with the same key, so a reload can't grant twice.

Code: `functions/src/transactions/admin/`.

## Scheduled jobs

| Job | Schedule (UTC) |
| --- | --- |
| `expireCreditsCron` | Hourly |
| `renewMenuBillingCron` | Hourly |
| `purgeDeletedProjects` | 1st of each month, 00:00 |

## Checks

| Command | Purpose |
| --- | --- |
| `npm run check:config` | Environment and app/Functions config consistency |
| `npm run lint` | App ESLint |
| `npm --prefix functions run lint` | Functions ESLint |
| `npm run test` | All tests, with external services mocked |
| `npm run typecheck` | Next.js typegen and TypeScript |
| `npm --prefix functions run build` | Functions build |
| `npm run build` | Next.js production build |
| `npm run check` | Everything above, in production mode |
| `npm run verify:clean` | Clean install and full check in a temporary copy |

Tests do not cover real payments, real AI responses, Firebase Rules in the emulator or browser flows.
