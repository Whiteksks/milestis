# Image Core

This directory is the new editor image system.

The intended flow is:

`template -> slot -> policy -> resolver -> renderer`

## Layers

- `types.ts`: canonical data contracts for new image data.
- `slots.ts`: semantic slots used by templates and editor flows.
- `policy/`: slot policies that decide the final image contract.
- `image-ratio.ts`: shared ratio parsing helpers for renderer and crop editor.
- `editor/`: new write-path helpers that create native image values from selected assets.
- `photobook/`: photobook-specific slot helpers and boundary helpers for future migration slices.
- `photobook/content.ts`: standalone storage contract for new photobook image data plus mutation helpers.
- `photobook/selectors.ts`: read-path selectors for managed and resolved photobook images.
- `resolve.ts`: the only place where raw image data becomes resolved render data.
- `render/`: thin rendering entry points that consume resolved data only.

## Rules

- Templates should pass a slot and minimal image data, not visual decisions.
- Policies override incoming presentation data when a slot requires it.
- New image data may include an explicit crop, but the runtime must work without one.
- Legacy image shapes should stay outside this directory.
- Editor flows should create new image data through `editor/` helpers instead of manually assembling image payloads.
- New content storage should be introduced alongside legacy content first, then become the sole source of truth during migration.

## Current Scope

This scaffold is intentionally isolated. It defines the new contracts and runtime path, but it does not yet migrate existing templates or editor persistence.