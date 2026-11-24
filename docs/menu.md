# Restaurant menu

The owner edits the venue, pages, categories and dishes, publishes the menu to a subdomain and gets a QR code for each page. Guests read the menu, build a list to show the waiter, browse recommendations and can play a small game with a mascot. The list stays in the browser; it is not sent to the restaurant as an order.

## Data model

`projects/{id}/data/content` holds `{ theme, content }`. Its `content.sectionContent` contains:

| Field | Purpose |
| --- | --- |
| `venue` | Name, description, currency |
| `categories[]` | Shared category catalog |
| `dishes[]` | Category, name, description, `priceMinor`, visibility, recommended flag |
| `homePageId`, `pages[]` | Pages with ID, title, path and `content.categoryIds[]` |
| `mascot` | Enabled flag, character, animations |

- Prices are integers in minor currency units. Supported currencies: KZT, USD, EUR, RUB, GBP.
- Limits: 20 pages, 30 categories, 200 dishes.
- The catalog is shared across pages, and one category can appear on several pages.
- The home page has the path `/`. Other paths are single lowercase segments, such as `/drinks`.
- Drafts may contain unnamed dishes and dishes without a price. Those dishes are left out when the menu is published.
- There are five templates: `menu-classic`, `menu-bistro`, `menu-picnic`, `menu-gallery`, `menu-pulse`.

## Publishing

1. The editor saves the draft and requests a quote from `menuBilling`.
2. The owner picks a plan and confirms the payment.
3. `publishMenu` checks the owner, the quote, the slug and the draft version, then copies the used media to `public/{projectId}/menu/`.
4. One transaction spends the credits, writes the public snapshot and billing state, and reserves the slug.

The draft stays editable after publishing. "Update menu" replaces the snapshot at the same address. A failure before the transaction commits changes nothing. The slug can't be changed after the first publish. Old paths are not redirected.

## Billing

| Plan (dishes with photos) | Credits per month |
| --- | ---: |
| Up to 50 | 200 |
| Up to 100 | 350 |
| Up to 150 | 500 |
| Up to 200 | 650 |

Plans are defined in `functions/src/projects/menu/billing/model.ts`.

- The first publish pays for a month and turns on auto-renewal. Periods are counted from the original date in UTC.
- Updating within the paid plan is free. An upgrade charges the price difference immediately. A downgrade applies from the next period.
- `renewMenuBillingCron` runs hourly. If the owner is short on credits, it retries for 3 days and then stops access.
- The public loader checks the access period itself, so a delayed scheduler does not extend access.

## API

Both endpoints are HTTPS POST with a Firebase Bearer token.

| Endpoint | Body |
| --- | --- |
| `menuBilling` status | `{ projectId, action: "status" }` |
| `menuBilling` quote | `{ projectId, action: "review", planId? }` |
| `menuBilling` auto-renew | `{ projectId, action: "autoRenew", autoRenew, revision }` |
| `publishMenu` | `{ projectId, slug, locale, quoteId }` |

- A quote is valid for 10 minutes. It is bound to the owner, the project, the draft snapshot and the billing revision.
- Reusing a quote that has already been used returns the stored receipt without charging again.
- Quotes and receipts expire through the Firestore TTL field `deleteAt`.

## Guest session

- **List.** Dish IDs and quantities are stored in `localStorage` per project.
- **Recommended.** Shows the dishes the owner has flagged.
- **Game.** A six-card memory game. Progress survives page changes but resets on a full reload. See [mascot README](../src/editor/modes/menu/mascot/README.md).

## Code map

| Path | Responsibility |
| --- | --- |
| `functions/src/domain/pages.ts`, `functions/src/domain/menu/` | Contract, limits, paths, templates, public projection |
| `src/editor/modes/menu/` | Page commands, store, forms, templates, guest session |
| `functions/src/projects/menu/` | Snapshot, media, publishing, billing |
| `functions/src/projects/menuBilling.ts`, `publishMenu.ts` | HTTP handlers |
| `src/app/sites/[slug]/` | Public pages |
