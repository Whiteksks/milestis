# AI in the editor

- **Portfolio and photobook:** the AI edits text and styling.
- **Menu:** the AI creates and edits categories, dishes, prices, pages and the template from pasted text or a photo, and it can restyle dish photos.

The server needs `OPENAI_API_KEY`, `OPENAI_TEXT_MODEL`, `OPENAI_IMAGE_MODEL` and Firebase Admin access.

## Chat (`/api/ai`)

The browser sends the project ID, an allowed operation and its input. The server then:

1. Checks the session, project ownership, project mode, payload size and rate limits.
2. Resolves images by media library ID, checking that they belong to the owner and the project.
3. Calls the Responses API with `store: false`, a strict JSON schema and low reasoning effort. Models, prompts and schemas are defined only on the server, in `src/lib/ai/server/`.
4. Validates the response against the schema. Menu responses also go through the shared domain validator.

The result is applied only if the draft version has not changed since the request. A manual edit, switching projects or cancelling discards a late response. For menus, the last change can be undone and the last 8 messages are sent as context. A dish with an unknown price gets `null` and is left out of publishing until a price is set.

## Photo enhancement (`/api/ai/enhance-photo`)

- The server checks the session, menu ownership and that the photo belongs to the menu.
- It makes one Images API call: 1024×1024, medium quality, WebP output.
- There are three server-defined styles: `eveningWood`, `daylightCeramic`, `darkSlate`. The client sends only the style ID.
- The user compares the result with the original before applying it. The original stays in the media library.

## Limits

The `aiUsage` collection limits each user to 30 operations per minute and 120 per day (UTC). AI calls do not spend credits or require a subscription.
