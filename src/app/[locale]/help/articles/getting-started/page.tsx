import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "Getting started with Milestis — Milestis Help",
  description: "Create your first memory book in minutes — a beginner's guide.",
}

const toc = [
  { id: "create-account", label: "Create an account" },
  { id: "start-project", label: "Start a new project" },
  { id: "add-photos", label: "Add photos" },
  { id: "arrange-layouts", label: "Arrange layouts" },
  { id: "add-text", label: "Add text & captions" },
  { id: "preview-publish", label: "Preview & publish" },
  { id: "next-steps", label: "Next steps" },
]

const meta = {
  title: "Getting started with Milestis",
  description:
    "Everything you need to create your first photobook from scratch — from signing up to sharing the final result.",
  category: "Basics",
  readTime: "5 min read",
  updatedAt: "January 2026",
}

const related = [
  { title: "Publish & share projects", href: "/help/articles/publish-share" },
  { title: "Customize your portfolio", href: "/help/articles/customize-portfolio" },
  { title: "How credits work", href: "/help/articles/how-credits-work" },
]

export default function GettingStartedPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="create-account">Create an account</h2>
      <p>
        Go to <a href="/">milestis.com</a> and click <strong>Get started free</strong>. You can
        sign up with your Google account, Apple ID, or an email address and password. No credit
        card is required for the free plan.
      </p>
      <p>
        After signing in you will land on your <strong>Dashboard</strong> — the central place for
        all your projects.
      </p>

      <h2 id="start-project">Start a new project</h2>
      <p>
        Click the <strong>+ New project</strong> button on the Dashboard. You will be asked to
        choose a project type:
      </p>
      <ul>
        <li>
          <strong>Photobook</strong> — a paginated book layout, great for events and holidays.
        </li>
        <li>
          <strong>Portfolio</strong> — a public website showcasing your photography or artwork.
        </li>
        <li>
          <strong>Memory book</strong> — a personal timeline combining photos, notes, and music.
        </li>
      </ul>
      <p>
        Select a size (A4, square, or custom), give your project a name, and click{" "}
        <strong>Create</strong>. The editor opens automatically.
      </p>

      <h2 id="add-photos">Add photos</h2>
      <p>
        In the editor, click the <strong>Photos</strong> panel on the left sidebar. You can:
      </p>
      <ul>
        <li>Drag and drop files from your computer directly onto the canvas.</li>
        <li>
          Click <strong>Upload photos</strong> and select files from your device.
        </li>
        <li>Connect Google Photos or Dropbox for instant access to your library.</li>
      </ul>
      <p>
        Supported formats are JPEG, PNG, and HEIC. We recommend photos of at least{" "}
        <strong>1500 × 1500 px</strong> for best print quality.
      </p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>
          Photos are stored securely and never shared publicly unless you explicitly publish the
          project.
        </span>
      </div>

      <h2 id="arrange-layouts">Arrange layouts</h2>
      <p>
        Each page can hold one or more photos in a grid, collage, or full-bleed layout. To change a
        page layout, click the page and select a template from the <strong>Layouts</strong> panel.
      </p>
      <p>
        You can drag photos between slots to rearrange them, resize individual slots by dragging
        their handles, and rotate or crop any photo with a double-click.
      </p>

      <h2 id="add-text">Add text & captions</h2>
      <p>
        Click any text placeholder to start typing, or add a new text block via{" "}
        <strong>Insert → Text</strong>. You can choose from a set of curated font pairings in the{" "}
        <strong>Style</strong> panel to keep your typography consistent.
      </p>
      <p>
        Want AI help? Click <strong>Write with AI</strong> inside any text block to generate a
        caption automatically based on the photos on that page. This uses credits.
      </p>

      <h2 id="preview-publish">Preview & publish</h2>
      <p>
        Click <strong>Preview</strong> in the top bar at any time to see how your project looks in
        its final form. When you are happy with the result, click <strong>Publish</strong>. You
        will get a shareable link you can send to anyone — no account required to view.
      </p>
      <p>
        To download a PDF for printing, go to <strong>File → Export → PDF</strong>. High-resolution
        export is available on Pro and Family plans.
      </p>

      <h2 id="next-steps">Next steps</h2>
      <p>Now that your first project is live, here are some things to explore:</p>
      <ul>
        <li>
          <a href="/help/articles/customize-portfolio">Set up your public portfolio</a> to showcase
          your work.
        </li>
        <li>
          <a href="/help/articles/publish-share">Learn all the sharing options</a> — custom domains,
          password protection, and more.
        </li>
        <li>
          <a href="/help/articles/how-credits-work">Understand how AI credits work</a> so you never
          run out at the wrong moment.
        </li>
      </ul>
    </ArticleLayout>
  )
}
