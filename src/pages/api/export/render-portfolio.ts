/**
 * Pages Router API route — NOT App Router.
 *
 * Why Pages Router?
 * The App Router RSC compiler converts any file with `'use client'` into a
 * client-reference proxy that cannot be called server-side via
 * renderToStaticMarkup. Some template components (headers with mobile menu
 * state, etc.) must use `useState`/`useEffect` and therefore must have
 * `'use client'`. Pages Router has no RSC transformation, so all React
 * components — including client-only ones — are plain modules that
 * renderToStaticMarkup can call without restrictions.
 *
 * This route is called by the `exportProject` Cloud Function.
 * Auth: x-render-key header (shared secret).
 */
import type { NextApiRequest, NextApiResponse } from 'next'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { getTheme } from '@/editor/lib/themes'
import type { SectionContent, SectionVisibility } from '@/editor/lib/types'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'

import { MinimalTemplateDesign }     from '@/editor/components/templates/portfolio/minimal-template'
import { EditorialTemplateDesign }   from '@/editor/components/templates/portfolio/editorial-template'
import { ElegantTemplateDesign }     from '@/editor/components/templates/portfolio/elegant-template'
import { GridTemplateDesign }        from '@/editor/components/templates/portfolio/grid-template'
import { BentoTemplateDesign }       from '@/editor/components/templates/portfolio/bento-template'
import { ShowcaseTemplateDesign }    from '@/editor/components/templates/portfolio/showcase-template'
import { LiquidGlassTemplateDesign } from '@/editor/components/templates/portfolio/liquid-glass-template'

// ─── Template registry ────────────────────────────────────────────────────────

const TEMPLATES: Record<string, React.ComponentType<PortfolioTemplateProps>> = {
  minimal:        MinimalTemplateDesign,
  editorial:      EditorialTemplateDesign,
  elegant:        ElegantTemplateDesign,
  grid:           GridTemplateDesign,
  bento:          BentoTemplateDesign,
  showcase:       ShowcaseTemplateDesign,
  'liquid-glass': LiquidGlassTemplateDesign,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fixNextImageUrls(html: string): string {
  return html.replace(
    /\/_next\/image\?url=([^"& ]+)[^"]*/g,
    (_, encodedUrl: string) => decodeURIComponent(encodedUrl),
  )
}

function extractImageUrls(html: string): string[] {
  const urls = new Set<string>()
  const re = /(?:src|href)="(https:\/\/firebasestorage\.googleapis\.com[^"]*)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    urls.add(m[1].split('?')[0] + '?alt=media')
  }
  return Array.from(urls)
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface RenderPortfolioBody {
  templateId: string
  themeId: string
  sectionContent: SectionContent
  sectionVisibility: SectionVisibility
  projectName: string
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' })
    return
  }

  // Auth
  const secret = req.headers['x-render-key']
  if (!secret || secret !== process.env.EXPORT_RENDER_SECRET) {
    res.status(401).json({ error: 'UNAUTHORIZED' })
    return
  }

  const body = req.body as RenderPortfolioBody
  const { templateId, themeId, sectionContent, sectionVisibility, projectName } = body

  if (!templateId || !themeId || !sectionContent || !sectionVisibility) {
    res.status(400).json({ error: 'MISSING_FIELDS' })
    return
  }

  const TemplateComponent = TEMPLATES[templateId] ?? TEMPLATES['minimal']
  const theme = getTheme(themeId)

  const handleAnchorClick = (_e: React.MouseEvent<HTMLAnchorElement>, _href: string) => {}

  let html: string
  try {
    html = renderToStaticMarkup(
      createElement(TemplateComponent, {
        theme,
        sectionContent,
        sectionVisibility,
        handleAnchorClick,
        disableAnimations: true,
      }),
    )
  } catch (err) {
    res.status(500).json({ error: 'RENDER_FAILED', message: String(err) })
    return
  }

  html = fixNextImageUrls(html)
  const imageUrls = extractImageUrls(html)

  res.status(200).json({
    html,
    imageUrls,
    background: theme.background,
    foreground: theme.foreground,
    projectName,
  })
}
