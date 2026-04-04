import { NextRequest, NextResponse } from 'next/server'
import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { MotionConfig } from 'framer-motion'

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

// ─── Template registry ───────────────────────────────────────────────────────

const TEMPLATES: Record<string, React.ComponentType<PortfolioTemplateProps>> = {
  minimal:      MinimalTemplateDesign,
  editorial:    EditorialTemplateDesign,
  elegant:      ElegantTemplateDesign,
  grid:         GridTemplateDesign,
  bento:        BentoTemplateDesign,
  showcase:     ShowcaseTemplateDesign,
  'liquid-glass': LiquidGlassTemplateDesign,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Fix Next.js image optimization URLs back to original Firebase Storage URLs.
 * next/image rewrites src to /_next/image?url=ENCODED&w=...&q=...
 * For a self-contained ZIP export, we need the real URL.
 */
function fixNextImageUrls(html: string): string {
  return html.replace(
    /\/_next\/image\?url=([^"& ]+)[^"]*/g,
    (_, encodedUrl: string) => decodeURIComponent(encodedUrl),
  )
}

/**
 * Extract all public Firebase Storage image URLs from the rendered HTML.
 * Returns a deduplicated array.
 */
function extractImageUrls(html: string): string[] {
  const urls = new Set<string>()
  // Match src="https://firebasestorage..." in any attribute position
  const re = /(?:src|href)="(https:\/\/firebasestorage\.googleapis\.com[^"]*)"/g
  let m: RegExpExecArray | null
  while ((m = re.exec(html)) !== null) {
    // Drop token – canonical URL is enough for extraction tracking
    urls.add(m[1].split('?')[0] + '?alt=media')
  }
  return Array.from(urls)
}

// ─── Request body ─────────────────────────────────────────────────────────────

interface RenderPortfolioBody {
  templateId: string
  themeId: string
  sectionContent: SectionContent
  sectionVisibility: SectionVisibility
  projectName: string
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = req.headers.get('x-render-key')
  if (!secret || secret !== process.env.EXPORT_RENDER_SECRET) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })
  }

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: RenderPortfolioBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON' }, { status: 400 })
  }

  const { templateId, themeId, sectionContent, sectionVisibility, projectName } = body

  if (!templateId || !themeId || !sectionContent || !sectionVisibility) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 })
  }

  // ── Resolve template & theme ──────────────────────────────────────────────
  const TemplateComponent = TEMPLATES[templateId] ?? TEMPLATES['minimal']
  const theme = getTheme(themeId)

  // no-op for static HTML — smooth scroll handled by CSS
  const handleAnchorClick = (_e: React.MouseEvent<HTMLAnchorElement>, _href: string) => {}

  // ── Render ────────────────────────────────────────────────────────────────
  let html: string
  try {
    html = renderToStaticMarkup(
      createElement(
        MotionConfig,
        { reducedMotion: 'always' },
        createElement(TemplateComponent, {
          theme,
          sectionContent,
          sectionVisibility,
          handleAnchorClick,
        }),
      ),
    )
  } catch (err) {
    return NextResponse.json(
      { error: 'RENDER_FAILED', message: String(err) },
      { status: 500 },
    )
  }

  // ── Post-process ──────────────────────────────────────────────────────────
  html = fixNextImageUrls(html)
  const imageUrls = extractImageUrls(html)

  return NextResponse.json({
    html,
    imageUrls,
    /** Tailwind background class, passed to <body> in the final HTML file. */
    background: theme.background,
    /** Tailwind foreground (text color) class for <body>. */
    foreground: theme.foreground,
    projectName,
  })
}
