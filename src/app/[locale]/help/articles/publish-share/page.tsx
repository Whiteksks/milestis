import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Publish and share your project — Milestis Help",
  description: "Learn how publishing works in Milestis, what kind of link each project gets, and how to share it confidently.",
}

const toc = [
  { id: "what-publish-means", label: "What publishing means" },
  { id: "memory-book-links", label: "Memory Book links" },
  { id: "portfolio-links", label: "Portfolio links" },
  { id: "publish-cost", label: "Credits and publish cost" },
  { id: "unpublish-republish", label: "Unpublish and republish" },
  { id: "sharing-best-practices", label: "Sharing best practices" },
]

const meta = {
  title: "Publish and share your project",
  description:
    "A clear guide to making your project live and understanding how access works for Memory Books and Portfolio Sites.",
  category: "Sharing",
  readTime: "4 min read",
  updatedAt: "April 2026",
}

const related = [
  { title: "What is Milestis", href: "/help/articles/what-is-milestis" },
  { title: "Create and edit your first project", href: "/help/articles/getting-started" },
]

export default function PublishSharePage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="what-publish-means">What publishing means</h2>
      <p>
        In Milestis, publishing means turning your in-editor project into a live web experience that
        can be opened outside the editor. Once published, your project gets a real shareable address
        and can be viewed on any device.
      </p>
      <p>
        The exact link and access model depend on the format you chose when the project was created.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          Publishing does not mean losing control. You can still take a project offline later and
          bring it back again when needed.
        </span>
      </div>

      <h2 id="memory-book-links">Memory Book links</h2>
      <p>
        A <strong>Memory Book</strong> is published as a private share link. The published URL includes
        a viewing token, so the link itself becomes the key to access.
      </p>
      <p>
        This makes Memory Books feel appropriate for personal stories, gifts, family moments, and
        emotionally sensitive content. Anyone who receives the full link can open the project, but
        it is not meant to behave like a public showcase page.
      </p>

      <h2 id="portfolio-links">Portfolio links</h2>
      <p>
        A <strong>Portfolio Site</strong> is published as a public web address. This is the right
        format when you want people to visit your work, evaluate your style, and share the site more
        openly.
      </p>
      <p>
        Before publishing, Milestis asks you to choose a slug. That slug becomes part of the live
        address people will use to open your site, so it is worth choosing something clean,
        readable, and close to your name or brand.
      </p>

      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>
          Slugs are part of the public address. Keep them short, clear, and easy to type or share.
        </span>
      </div>

      <h2 id="publish-cost">Credits and publish cost</h2>
      <p>
        Publishing uses credits, and the cost depends on the type of project:
      </p>
      <ul>
        <li>
          <strong>Portfolio Site</strong> uses a fixed publish cost.
        </li>
        <li>
          <strong>Memory Book</strong> uses a tiered cost based on how many photos are included.
        </li>
      </ul>
      <p>
        Before the final publish step, Milestis analyzes the project and shows the expected cost.
        This gives you a chance to confirm the result, the final link, and the credit usage before
        making the project live.
      </p>

      <h2 id="unpublish-republish">Unpublish and republish</h2>
      <p>
        If you need to take a project offline, you can <strong>unpublish</strong> it. This removes
        public access while keeping the project data intact.
      </p>
      <p>
        Later, you can <strong>republish</strong> the project again. This is useful when you want to
        hide a project temporarily, revise it, or bring back an archived result without rebuilding
        everything from the start.
      </p>

      <h2 id="sharing-best-practices">Sharing best practices</h2>
      <p>Before sending a link to someone else, make one last check:</p>
      <ul>
        <li>
          Open the live preview and make sure the first screen or cover feels finished.
        </li>
        <li>
          Double-check project titles, dates, and visible text for small mistakes.
        </li>
        <li>
          For Memory Books, copy the full link so the recipient gets the access token as part of the
          URL.
        </li>
        <li>
          For Portfolio Sites, choose a slug you will still be comfortable sharing later in your bio,
          messages, or client communication.
        </li>
      </ul>
      <p>
        Good publishing in Milestis is not only about making the project live. It is about making
        sure the first viewer experiences it exactly the way you intended.
      </p>
    </ArticleLayout>
  )
}
