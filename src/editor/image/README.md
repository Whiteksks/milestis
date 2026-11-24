# Editor images

Shared contracts, policies, editing tools and rendering for images.

Data flow: `template → slot → policy → resolve.ts → render`

| Module | Responsibility |
| --- | --- |
| `data.ts` | Assets, crop, focus point, display settings |
| `slots.ts` | Semantic image slots |
| `policy/` | Final display rules for a slot |
| `image-ratio.ts` | Aspect ratio parsing for rendering and the crop editor |
| `editor/` | Selecting and replacing assets, display settings |
| `crop/` | Crop editing with normalized coordinates |
| `resolve.ts` | Converts stored data into the render contract |
| `render.ts`, `render/` | Render contracts and components |

- The slot policy takes precedence over input settings.
- An explicit crop is optional; the resolver works without one.
- Collection structure and mutations are defined by each mode: `src/editor/modes/portfolio/image/` and `src/editor/modes/photobook/image/`. The menu mode links images to dishes and pages.
- Images are saved to `content.imageContent` in `projects/{id}/data/content`. The canvas, the preview and the public renderer all read the same data.
