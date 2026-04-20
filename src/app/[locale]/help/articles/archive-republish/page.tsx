import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { AlertCircle, Info } from "lucide-react"

export const metadata: Metadata = {
  title: "Archive, deletion, and republishing — Milestis Help",
  description: "Understand what happens after publish, what lives in the archive, and how unpublish, republish, and permanent deletion work.",
}

const toc = [
  { id: "what-is-archive", label: "What is the archive?" },
  { id: "after-publish", label: "What happens after publish" },
  { id: "unpublish", label: "Unpublish a project" },
  { id: "republish", label: "Republish a project" },
  { id: "delete-forever", label: "Delete permanently" },
  { id: "best-practices", label: "Best practices" },
]

const meta = {
  title: "Archive, deletion, and republishing",
  description:
    "A clear guide to what happens to projects after publish and how to manage them safely afterward.",
  category: "Projects",
  readTime: "4 min read",
  updatedAt: "April 2026",
}

const related = [
  { title: "Publish and share your project", href: "/help/articles/publish-share" },
  { title: "How credits work", href: "/help/articles/how-credits-work" },
]

export default function ArchiveRepublishPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="what-is-archive">What is the archive?</h2>
      <p>
        The archive is where published projects live after they leave the active workspace. It acts
        like a management layer for finished results: you can review them, open the live link,
        return to editing, take them offline, or remove them permanently.
      </p>
      <p>
        This keeps your main creation area focused on current work while still preserving access to
        projects that are already part of your published history.
      </p>

      <h2 id="after-publish">What happens after publish</h2>
      <p>
        When you publish a project, Milestis creates a live web version and moves that project into
        the archived side of your workflow. Published projects can still be managed later, but they
        are treated as finished outputs rather than fresh drafts.
      </p>
      <p>
        In the archive you may see a project as <strong>Published</strong> or <strong>Offline</strong>,
        depending on whether the live link is still active.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          Archived does not mean lost. It means the project has already gone through publishing and
          is now being managed as a finished result.
        </span>
      </div>

      <h2 id="unpublish">Unpublish a project</h2>
      <p>
        Unpublishing takes the live version offline without deleting the project data itself. This is
        useful when you want to hide a project temporarily, revise it, or stop sharing it.
      </p>
      <p>
        After unpublishing, the archive will still keep the project, but its live state changes from
        published to offline.
      </p>

      <h2 id="republish">Republish a project</h2>
      <p>
        Republish brings an archived offline project back online. It is the right choice when the
        project already existed as a published result and you want to make it live again.
      </p>
      <p>
        In the current product flow, republishing is supported as a lightweight return-to-live action
        and does not currently consume extra credits.
      </p>

      <h2 id="delete-forever">Delete permanently</h2>
      <p>
        Permanent deletion is the destructive action. It removes the archived project, clears exported
        files and storage data, and immediately takes any live site offline.
      </p>
      <p>
        This is different from unpublish. Unpublish hides the project. Permanent deletion removes it.
      </p>
      <ul>
        <li>The live site goes offline immediately.</li>
        <li>Stored exported files are removed.</li>
        <li>Project data is no longer kept in the archive.</li>
        <li>Credits spent on the original publish are not refunded.</li>
      </ul>

      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>
          Use permanent deletion only when you are sure the project is no longer needed. If you only
          want to hide it for a while, unpublish is the safer choice.
        </span>
      </div>

      <h2 id="best-practices">Best practices</h2>
      <ul>
        <li>
          Keep active work in the editor, and treat the archive as the home for already-published
          results.
        </li>
        <li>
          Unpublish when you need a pause. Delete only when you want the project gone for good.
        </li>
        <li>
          Before deleting, make sure you no longer need the live link or associated files.
        </li>
        <li>
          Use republish when the project already belongs to your published history and simply needs to
          go live again.
        </li>
      </ul>
    </ArticleLayout>
  )
}