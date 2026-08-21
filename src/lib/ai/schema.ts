import type { SchemaRequest } from 'firebase/ai'



const THEMES_ENUM = ['parchment', 'frost', 'ember', 'obsidian', 'sand', 'noir', 'sage', 'dusk', 'porcelain', 'carbon']

const CAPTIONS_SCHEMA: SchemaRequest = {
  type: 'array',
  items: {
    type: 'object',
    required: ['photoId', 'caption'],
    properties: {
      photoId: { type: 'string' },
      caption: { type: 'string', description: 'One short line, max ~200 characters.' },
    },
  },
}


export const PHOTOBOOK_SCHEMA: SchemaRequest = {
  type: 'object',
  required: ['action', 'message'],
  properties: {
    action:  { type: 'string', enum: ['chat', 'edit'] },
    message: { type: 'string' },
    changes: {
      type: 'object',
      properties: {
        theme: {
          type: 'object',
          properties: {
            templateId:      { type: 'string', enum: ['photobook-memoir', 'photobook-chronicle', 'photobook-magazine', 'photobook-lumiere', 'photobook-soleil'] },
            currentTheme:    { type: 'string', enum: THEMES_ENUM },
            photobookMood:   { type: 'string', enum: ['none', 'warm', 'cool', 'muted', 'fade', 'golden', 'noir', 'vibrant', 'dreamy', 'earthy'] },
            photobookTexture: { type: 'string', enum: ['none', 'vignette', 'matte', 'warmth', 'silver', 'linen', 'haze', 'grain', 'canvas', 'velvet', 'parchment'] },
          },
        },
        content: {
          type: 'object',
          // propertyOrdering alone (a mere hint) wasn't enough to stop highlight/ending from being
          // silently dropped — so if "content" is included at all, ALL SIX sections are now hard
          // `required` (each only needs its own `title` internally). Sections outside what the user
          // asked about should just echo their current title back unchanged (see prompt.ts) — this
          // exists purely so small/easy-to-forget sections can never be silently skipped again.
          required: ['cover', 'introduction', 'story', 'gallery', 'highlight', 'ending'],
          propertyOrdering: ['cover', 'highlight', 'ending', 'introduction', 'story', 'gallery'],
          properties: {
            cover: {
              type: 'object',
              required: ['title'],
              properties: {
                title:    { type: 'string', description: 'Short striking title, max ~60 characters. Never put a paragraph here — long text belongs in another section\'s description/dedication field.' },
                subtitle: { type: 'string', description: 'One supporting line, max ~80 characters.' },
                date:     { type: 'string', description: 'Max ~40 characters, e.g. "March 2026".' },
                location: { type: 'string', description: 'Max ~80 characters.' },
                tagline:  { type: 'string', description: 'Very short motto, max ~100 characters.' },
              },
            },
            introduction: {
              type: 'object',
              required: ['title'],
              properties: {
                label:      { type: 'string', description: 'Small eyebrow label, max ~50 characters.' },
                title:      { type: 'string', description: 'Heading, max ~60 characters.' },
                quote:      { type: 'string', description: 'Short quote/epigraph, max ~150 characters.' },
                dedication: { type: 'string', description: 'Longer dedication paragraph — the field for longer text in this section. Aim for ~150-250 characters; hard cap 400, text past that gets cut off.' },
              },
            },
            story: {
              type: 'object',
              required: ['title'],
              properties: {
                label:    { type: 'string', description: 'Small eyebrow label for the whole story section, max ~50 characters.' },
                title:    { type: 'string', description: 'Section heading, max ~60 characters.' },
                date:     { type: 'string', description: 'Max ~40 characters.' },
                location: { type: 'string', description: 'Max ~80 characters.' },
              },
            },
            gallery: {
              type: 'object',
              required: ['title'],
              properties: {
                label:       { type: 'string', description: 'Small eyebrow label, max ~50 characters.' },
                title:       { type: 'string', description: 'Section heading, max ~60 characters.' },
                description: { type: 'string', description: 'Paragraph describing the gallery as a whole — the field for longer text in this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
              },
            },
            highlight: {
              type: 'object',
              required: ['title'],
              properties: {
                label:       { type: 'string', description: 'Small eyebrow label, max ~50 characters.' },
                title:       { type: 'string', description: 'Heading, max ~60 characters.' },
                description: { type: 'string', description: 'Paragraph — the field for longer text in this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
                quote:       { type: 'string', description: 'Short quote, max ~150 characters.' },
              },
            },
            ending: {
              type: 'object',
              required: ['title'],
              properties: {
                title:     { type: 'string', description: 'Heading, max ~60 characters.' },
                text:      { type: 'string', description: 'Closing/farewell paragraph — the field for longer text in this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
                date:      { type: 'string', description: 'Max ~40 characters.' },
                signature: { type: 'string', description: 'Max ~60 characters.' },
              },
            },
          },
        },
        imageAssignments: {
          type: 'object',
          properties: {
            cover:        { type: 'string' },
            introduction: { type: 'string' },
            highlight:    { type: 'string' },
            ending:       { type: 'string' },
          },
        },
        captions: CAPTIONS_SCHEMA,
      },
    },
  },
}


export const PORTFOLIO_SCHEMA: SchemaRequest = {
  type: 'object',
  required: ['action', 'message'],
  properties: {
    action:  { type: 'string', enum: ['chat', 'edit'] },
    message: { type: 'string' },
    changes: {
      type: 'object',
      properties: {
        theme: {
          type: 'object',
          properties: {
            templateId:           { type: 'string', enum: ['editorial', 'minimal', 'elegant', 'grid', 'bento', 'showcase', 'liquid-glass'] },
            currentTheme:         { type: 'string', enum: THEMES_ENUM },
            depthEffect:          { type: 'string', enum: ['none', 'radial-glow', 'vignette', 'ambient-blobs', 'asymmetric-light', 'aurora', 'horizon'] },
            raysEffect:           { type: 'string', enum: ['none', 'diagonal-rays', 'conic-rays', 'soft-streaks', 'lens-flare', 'caustics', 'god-rays', 'prism'] },
            textureEffect:        { type: 'string', enum: ['none', 'grain', 'dots', 'lines', 'grid', 'halftone', 'scanlines', 'diamond-grid', 'woven'] },
            backgroundLayersTheme: { type: 'string', enum: ['dark', 'light'] },
          },
        },
        content: {
          type: 'object',
          // Same reasoning as the photobook schema: a mere ordering hint isn't a hard guarantee, so if
          // "content" is included at all, ALL SIX sections are now hard `required`. Sections outside
          // what the user asked about should just echo their current title back unchanged (see prompt.ts).
          required: ['header', 'hero', 'bio', 'featuredWork', 'contact', 'footer'],
          propertyOrdering: ['featuredWork', 'hero', 'bio', 'header', 'contact', 'footer'],
          properties: {
            header: {
              type: 'object',
              required: ['title'],
              properties: {
                title: { type: 'string', description: 'Brand/name shown in the nav, max ~60 characters.' },
                links: { type: 'array', items: { type: 'object', required: ['label', 'href'], properties: { label: { type: 'string', description: 'Max ~30 characters.' }, href: { type: 'string' } } } },
              },
            },
            hero: {
              type: 'object',
              required: ['title'],
              properties: {
                title:       { type: 'string', description: 'Short striking headline, max ~60 characters. Never put a paragraph here — long text belongs in description.' },
                subtitle:    { type: 'string', description: 'One supporting line, max ~80 characters.' },
                description: { type: 'string', description: 'Paragraph — the field for longer text in this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
              },
            },
            bio: {
              type: 'object',
              required: ['title'],
              properties: {
                title:        { type: 'string', description: 'Heading, max ~60 characters.' },
                subtitle:     { type: 'string', description: 'One supporting line, max ~80 characters.' },
                description:  { type: 'string', description: 'The bio paragraph itself — the field for longer text in this section. Aim for ~150-250 characters; hard cap 400, text past that gets cut off.' },
                achievements: { type: 'array', items: { type: 'string', description: 'Short line, max ~100 characters.' } },
              },
            },
            featuredWork: {
              type: 'object',
              properties: {
                title:    { type: 'string', description: 'Section heading, max ~60 characters.' },
                subtitle: { type: 'string', description: 'One supporting line, max ~80 characters.' },
                projects: { type: 'array', items: { type: 'object', required: ['id', 'title', 'description'], properties: { id: { type: 'string' }, title: { type: 'string', description: 'Max ~60 characters.' }, description: { type: 'string', description: 'The field for longer text on this card. Aim for ~80-140 characters; hard cap 200, text past that gets cut off.' }, tags: { type: 'array', items: { type: 'string' } }, photoId: { type: 'string' } } } },
              },
            },
            contact: {
              type: 'object',
              required: ['title'],
              properties: {
                title:       { type: 'string', description: 'Heading, max ~60 characters.' },
                subtitle:    { type: 'string', description: 'One supporting line, max ~80 characters.' },
                description: { type: 'string', description: 'Paragraph — the field for longer text in this section. Aim for ~100-180 characters; hard cap 300, text past that gets cut off.' },
                email:       { type: 'string', description: 'Max ~100 characters.' },
              },
            },
            footer: {
              type: 'object',
              properties: {
                copyright: { type: 'string', description: 'Max ~120 characters.' },
              },
            },
          },
        },
        imageAssignments: {
          type: 'object',
          properties: {
            hero: { type: 'string' },
            bio:  { type: 'string' },
          },
        },
        captions: CAPTIONS_SCHEMA,
      },
    },
  },
}
