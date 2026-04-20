import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Lightbulb } from "lucide-react"
import Link from "next/link" // Добавили импорт

export const metadata: Metadata = {
  title: "Create and edit your first project — Milestis Help",
  description: "Learn how to create a project, add content, refine the design, and preview the result.",
}

const toc = [
  { id: "start-from-dashboard", label: "Start from the dashboard" },
  { id: "choose-format", label: "Choose a format" },
  { id: "edit-content", label: "Edit your content" },
  { id: "refine-design", label: "Refine the design" },
  { id: "save-preview", label: "Save and preview" },
  { id: "before-publishing", label: "Before publishing" },
]

const meta = {
  title: "Create and edit your first project",
  description:
    "A practical guide to creating your first Milestis project and shaping it into a finished result.",
  category: "Basics",
  readTime: "5 min read",
  updatedAt: "April 2026",
}

const related = [
  { title: "What is Milestis", href: "/help/articles/what-is-milestis" },
  { title: "Publish & share projects", href: "/help/articles/publish-share" },
]

export default function GettingStartedPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="start-from-dashboard">Start from the dashboard</h2>
      <p>
        Once you sign in to <Link href="/">Milestis</Link>, your dashboard becomes the starting
        point for every project. This is where you create new work, return to drafts, and manage
        published or archived results.
      </p>
      <p>
        Click <strong>New Project</strong> to begin. Milestis opens a small project picker instead
        of a complicated setup flow, so you can get into the editor quickly.
      </p>

      <h2 id="choose-format">Choose a format</h2>
      <p>
        You will choose between two formats:
      </p>
      <ul>
        <li>
          <strong>Memory Book</strong> — best for milestones, gifts, family stories, and emotional
          photo collections.
        </li>
        <li>
          <strong>Portfolio Site</strong> — best for creators who want to present their work as a
          polished website.
        </li>
      </ul>
      <p>
        After you choose a format, Milestis creates the project and opens the editor automatically.
        You can rename the project later, so there is no need to overthink the starting point.
      </p>

      <h2 id="edit-content">Edit your content</h2>
      <p>
        Inside the editor, the main task is simple: replace placeholders with real content and shape
        the story or presentation you want to publish.
      </p>
      <ul>
        <li>
          Add your photos and choose the images that matter most.
        </li>
        <li>
          Edit titles, subtitles, captions, and other text blocks so the project feels personal and
          complete.
        </li>
        <li>
          Reorder sections or pages until the flow feels right for the final viewer.
        </li>
      </ul>
      <p>
        The most important mindset is not to fill every space. Milestis works best when you choose
        strong content intentionally and let the structure do the visual work.
      </p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>
          Start with fewer, stronger photos first. It is usually faster to build a clean first
          version and refine it than to overload the project on the first pass.
        </span>
      </div>

      <h2 id="refine-design">Refine the design</h2>
      <p>
        Milestis is built on rigid design principles, so refining the look is about choosing the
        right atmosphere, not rebuilding the layout from scratch.
      </p>
      <p>
        As you edit, focus on the elements Milestis is designed to make easy:
      </p>
      <ul>
        <li>
          <strong>Template choice</strong> — select the structure that best fits the content.
        </li>
        <li>
          <strong>Palette and mood</strong> — choose the visual direction that matches the story.
        </li>
        <li>
          <strong>Depth and decoration</strong> — use textures, light, and decorative details to add
          identity without making the composition messy.
        </li>
      </ul>

      <h2 id="save-preview">Save and preview</h2>
      <p>
        Milestis keeps your editor state safe while you work and provides a real preview so you can
        see the result the way a viewer will see it after publishing.
      </p>
      <p>
        Use <strong>Preview</strong> before publishing to check pacing, readability, and overall
        atmosphere. This is the best moment to make small adjustments to titles, image choices, and
        visual balance.
      </p>

      <h2 id="before-publishing">Before publishing</h2>
      <p>Before you make the project live, quickly check the essentials:</p>
      <ul>
        <li>
          The project name reflects what you want to share.
        </li>
        <li>
          The first screen or cover makes a strong impression.
        </li>
        <li>
          Text is concise and free of placeholder copy.
        </li>
        <li>The final rhythm feels intentional from start to finish.</li>
      </ul>
      <p>
        When the project feels ready, continue with <Link href="/help/articles/publish-share">publishing and sharing</Link>.
      </p>
    </ArticleLayout>
  )
}