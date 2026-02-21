import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "Customize your portfolio — Milestis Help",
  description: "Build a stunning portfolio with your own style, colors, and layout.",
}

const toc = [
  { id: "what-is-portfolio", label: "What is a portfolio?" },
  { id: "create-portfolio", label: "Create a portfolio" },
  { id: "sections", label: "Add & reorder sections" },
  { id: "themes", label: "Colors & typography" },
  { id: "profile", label: "Profile & about page" },
  { id: "seo", label: "SEO & metadata" },
]

const meta = {
  title: "Customize your portfolio",
  description:
    "Turn your best work into a beautiful public portfolio — with full control over layout, colors, fonts, and content.",
  category: "Design",
  readTime: "5 min read",
  updatedAt: "January 2026",
}

const related = [
  { title: "Publish & share projects", href: "/help/articles/publish-share" },
  { title: "Getting started with Milestis", href: "/help/articles/getting-started" },
]

export default function CustomizePortfolioPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="what-is-portfolio">What is a portfolio?</h2>
      <p>
        A <strong>Milestis portfolio</strong> is a public website that displays a curated selection
        of your projects under a single URL. Unlike individual project links, a portfolio shows
        multiple works together and supports a profile bio, contact form, and custom branding.
      </p>

      <h2 id="create-portfolio">Create a portfolio</h2>
      <p>
        From your Dashboard, click <strong>+ New project</strong> and choose{" "}
        <strong>Portfolio</strong>. Give it a name — this becomes the default URL slug:{" "}
        <code>milestis.com/portfolio/your-name</code>.
      </p>
      <p>
        On the next screen you can pick a starting template. Templates are purely visual; you can
        change everything later.
      </p>

      <h2 id="sections">Add & reorder sections</h2>
      <p>
        A portfolio is built from <strong>sections</strong>. Click the <strong>+</strong> button
        between sections to insert a new one. Available section types include:
      </p>
      <ul>
        <li>
          <strong>Gallery</strong> — a grid, masonry, or slideshow of photos or projects.
        </li>
        <li>
          <strong>Text block</strong> — a heading, body text, or quote.
        </li>
        <li>
          <strong>Featured project</strong> — a large call-out for a single photobook or memory
          book.
        </li>
        <li>
          <strong>Services / Skills</strong> — a list or card grid for professional portfolios.
        </li>
        <li>
          <strong>Contact form</strong> — lets visitors send you a message directly.
        </li>
      </ul>
      <p>
        Drag the handle on the left of any section to reorder them. Click the trash icon to remove
        a section (content is not permanently deleted until you save).
      </p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>
          Changes are auto-saved every 30 seconds. You can always undo with{" "}
          <strong>Ctrl/Cmd + Z</strong> or use the history panel.
        </span>
      </div>

      <h2 id="themes">Colors & typography</h2>
      <p>
        Open the <strong>Style</strong> panel (paint bucket icon in the right sidebar) to set the
        global look of your portfolio:
      </p>
      <ul>
        <li>
          <strong>Color palette</strong> — choose a preset or define your own primary, background,
          and accent colors.
        </li>
        <li>
          <strong>Font pairing</strong> — pick from curated heading + body font combinations, or
          select individual fonts from the entire Google Fonts library.
        </li>
        <li>
          <strong>Corner radius</strong> — control how rounded cards and buttons look across the
          whole portfolio.
        </li>
        <li>
          <strong>Dark / Light mode</strong> — choose a preferred default, or let visitors toggle
          it themselves.
        </li>
      </ul>

      <h2 id="profile">Profile & about page</h2>
      <p>
        Click <strong>Settings → Profile</strong> to set your display name, bio, profile photo, and
        social links (Instagram, Behance, LinkedIn, etc.). This information appears in the portfolio
        header and any &quot;About&quot; sections you add.
      </p>

      <h2 id="seo">SEO & metadata</h2>
      <p>
        Go to <strong>Project Settings → SEO</strong> to customize:
      </p>
      <ul>
        <li>
          <strong>Page title</strong> — shown in browser tabs and search results.
        </li>
        <li>
          <strong>Meta description</strong> — the snippet shown under your title in Google.
        </li>
        <li>
          <strong>Open Graph image</strong> — the preview image when your link is shared on social
          media.
        </li>
      </ul>
      <p>
        Once you publish, your portfolio is eligible for indexing. Enable{" "}
        <strong>Public visibility</strong> to allow search engines to discover it.
      </p>
    </ArticleLayout>
  )
}
