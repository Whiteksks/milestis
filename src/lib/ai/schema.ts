import type { SchemaRequest } from 'firebase/ai'



const THEMES_ENUM = ['parchment', 'frost', 'ember', 'obsidian', 'sand', 'noir', 'sage', 'dusk', 'porcelain', 'carbon']

const CAPTIONS_SCHEMA: SchemaRequest = {
  type: 'array',
  items: {
    type: 'object',
    required: ['photoId', 'caption'],
    properties: {
      photoId: { type: 'string' },
      caption: { type: 'string' },
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
          properties: {
            cover:        { type: 'object', properties: { title: { type: 'string' }, subtitle: { type: 'string' }, date: { type: 'string' }, location: { type: 'string' }, tagline: { type: 'string' } } },
            introduction: { type: 'object', properties: { label: { type: 'string' }, title: { type: 'string' }, quote: { type: 'string' }, dedication: { type: 'string' } } },
            story:        { type: 'object', properties: { label: { type: 'string' }, title: { type: 'string' }, date: { type: 'string' }, location: { type: 'string' } } },
            gallery:      { type: 'object', properties: { label: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' } } },
            highlight:    { type: 'object', properties: { label: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, quote: { type: 'string' } } },
            ending:       { type: 'object', properties: { title: { type: 'string' }, text: { type: 'string' }, date: { type: 'string' }, signature: { type: 'string' } } },
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
          properties: {
            header: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                links: { type: 'array', items: { type: 'object', required: ['label', 'href'], properties: { label: { type: 'string' }, href: { type: 'string' } } } },
              },
            },
            hero:         { type: 'object', properties: { title: { type: 'string' }, subtitle: { type: 'string' }, description: { type: 'string' } } },
            bio:          { type: 'object', properties: { title: { type: 'string' }, subtitle: { type: 'string' }, description: { type: 'string' }, achievements: { type: 'array', items: { type: 'string' } } } },
            featuredWork: {
              type: 'object',
              properties: {
                title:    { type: 'string' },
                subtitle: { type: 'string' },
                projects: { type: 'array', items: { type: 'object', required: ['id', 'title', 'description'], properties: { id: { type: 'string' }, title: { type: 'string' }, description: { type: 'string' }, tags: { type: 'array', items: { type: 'string' } }, photoId: { type: 'string' } } } },
              },
            },
            contact: { type: 'object', properties: { title: { type: 'string' }, subtitle: { type: 'string' }, description: { type: 'string' }, email: { type: 'string' } } },
            footer:  { type: 'object', properties: { copyright: { type: 'string' } } },
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
