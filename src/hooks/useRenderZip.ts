'use client'

import { useState } from 'react'
import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import type { PortfolioRenderData } from '@/lib/projects/export-project-api'
import { getTheme } from '@/editor/lib/themes'
import type { SectionContent, SectionVisibility } from '@/editor/lib/types'
import type { PortfolioTemplateProps } from '@/editor/lib/template-types'

// ─── Template registry (lazy-loaded to keep initial bundle small) ─────────────

async function loadTemplate(templateId: string): Promise<React.ComponentType<PortfolioTemplateProps>> {
  switch (templateId) {
    case 'editorial':
      return (await import('@/editor/components/templates/portfolio/editorial-template')).EditorialTemplateDesign
    case 'elegant':
      return (await import('@/editor/components/templates/portfolio/elegant-template')).ElegantTemplateDesign
    case 'grid':
      return (await import('@/editor/components/templates/portfolio/grid-template')).GridTemplateDesign
    case 'bento':
      return (await import('@/editor/components/templates/portfolio/bento-template')).BentoTemplateDesign
    case 'showcase':
      return (await import('@/editor/components/templates/portfolio/showcase-template')).ShowcaseTemplateDesign
    case 'liquid-glass':
      return (await import('@/editor/components/templates/portfolio/liquid-glass-template')).LiquidGlassTemplateDesign
    default:
      return (await import('@/editor/components/templates/portfolio/minimal-template')).MinimalTemplateDesign
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;')
}

function storageUrlToFilename(url: string, index: number): string {
  try {
    const parsed = new URL(url)
    const rawPath = parsed.pathname.split('/o/')[1] ?? ''
    const decoded = decodeURIComponent(rawPath.split('?')[0])
    const base = decoded.split('/').pop() ?? ''
    const safe = base.replace(/[^a-zA-Z0-9._-]/g, '-').replace(/-+/g, '-')
    return safe || `img-${index}`
  } catch {
    return `img-${index}`
  }
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

function buildHtmlPage(opts: {
  projectName: string
  background: string
  foreground: string
  body: string
}): string {
  const { projectName, background, foreground, body } = opts
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(projectName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Alice&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --font-sans: 'Alice', ui-sans-serif, system-ui, sans-serif;
      --font-serif: 'Cormorant Garamond', ui-serif, Georgia, serif;
      --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
    }
    *, ::before, ::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; min-height: 100%; }
    body { margin: 0; min-height: 100vh; }
    .\\@container { container-type: inline-size; }
  </style>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Alice', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            serif: ['Cormorant Garamond', 'ui-serif', 'Georgia', 'serif'],
            mono: ['IBM Plex Mono', 'ui-monospace', 'monospace'],
          },
        },
      },
    }
  </script>
</head>
<body class="${background} ${foreground}">
${body}
</body>
</html>`
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export type ZipStatus = 'idle' | 'rendering' | 'downloading' | 'zipping' | 'saving'

export function useRenderZip() {
  const [status, setStatus] = useState<ZipStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const generateZip = async (data: PortfolioRenderData) => {
    setStatus('rendering')
    setError(null)

    try {
      // 1. Load template component
      const TemplateComponent = await loadTemplate(data.templateId)
      const theme = getTheme(data.themeId)

      // 2. Render to static HTML string (client-side; no RSC restrictions)
      const bodyHtml = renderToStaticMarkup(
        createElement(TemplateComponent, {
          theme,
          sectionContent: data.sectionContent as SectionContent,
          sectionVisibility: data.sectionVisibility as SectionVisibility,
          handleAnchorClick: () => {},
          disableAnimations: true,
        }),
      )

      // 3. Extract image URLs
      const imageUrls = extractImageUrls(bodyHtml)

      // 4. Download images in parallel
      setStatus('downloading')
      const imageMap = new Map<string, string>()
      const imageFiles: Array<{ filename: string; blob: Blob }> = []
      const seenFilenames = new Set<string>()

      await Promise.allSettled(
        imageUrls.map(async (url, index) => {
          let filename = storageUrlToFilename(url, index)
          if (seenFilenames.has(filename)) {
            const ext = filename.includes('.') ? `.${filename.split('.').pop()}` : ''
            filename = `${filename.replace(/\.[^.]+$/, '')}-${index}${ext}`
          }
          seenFilenames.add(filename)
          try {
            const res = await fetch(url, { signal: AbortSignal.timeout(30_000) })
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            const blob = await res.blob()
            imageMap.set(url, `./assets/${filename}`)
            imageFiles.push({ filename, blob })
          } catch {
            // Non-fatal: image stays as remote URL
          }
        }),
      )

      // 5. Patch image URLs in HTML to point to local assets
      let patchedBody = bodyHtml
      for (const [remoteUrl, localPath] of imageMap) {
        patchedBody = patchedBody.split(remoteUrl).join(localPath)
      }

      // 6. Build full HTML page
      const fullHtml = buildHtmlPage({
        projectName: data.projectName,
        background: theme.background,
        foreground: theme.foreground,
        body: patchedBody,
      })

      // 7. Build ZIP
      setStatus('zipping')
      const zip = new JSZip()
      zip.file('index.html', fullHtml)
      const assetsFolder = zip.folder('assets')!
      for (const { filename, blob } of imageFiles) {
        assetsFolder.file(filename, blob)
      }

      // 8. Save
      setStatus('saving')
      const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
      const safeName = data.projectName.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') || 'portfolio'
      saveAs(zipBlob, `${safeName}.zip`)

      setStatus('idle')
    } catch (err) {
      setError(String(err))
      setStatus('idle')
    }
  }

  return { generateZip, status, error, isRunning: status !== 'idle' }
}
