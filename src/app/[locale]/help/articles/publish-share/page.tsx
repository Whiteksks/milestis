import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Publish & share projects — Milestis Help",
  description: "All the ways to share your photobooks and portfolios with the world.",
}

const toc = [
  { id: "shareable-link", label: "Shareable link" },
  { id: "password-protection", label: "Password protection" },
  { id: "custom-domain", label: "Custom domain" },
  { id: "embed", label: "Embed on another site" },
  { id: "download-pdf", label: "Download as PDF" },
  { id: "unpublish", label: "Unpublish a project" },
]

const meta = {
  title: "Publish & share projects",
  description:
    "From private links to custom domains — here are all the options to get your work in front of the right people.",
  category: "Sharing",
  readTime: "4 min read",
  updatedAt: "January 2026",
}

const related = [
  { title: "Getting started with Milestis", href: "/help/articles/getting-started" },
  { title: "Customize your portfolio", href: "/help/articles/customize-portfolio" },
]

export default function PublishSharePage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="shareable-link">Shareable link</h2>
      <p>
        Every published project gets a unique <strong>milestis.com/p/your-slug</strong> URL. Click{" "}
        <strong>Publish</strong> in the editor top bar to generate it. Anyone with the link can view
        the project — no account required.
      </p>
      <p>
        You can customise the slug at any time from <strong>Project Settings → Sharing</strong>. The
        old link will redirect to the new one automatically.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          The shareable link is private by default — it won&apos;t appear in search engines unless
          you turn on <strong>Public visibility</strong>.
        </span>
      </div>

      <h2 id="password-protection">Password protection</h2>
      <p>
        To restrict who can open the link, go to <strong>Project Settings → Sharing → Password</strong>{" "}
        and set a password. Viewers will be prompted to enter it before they can see the project.
        You can change or remove the password at any time.
      </p>
      <p>
        Password protection is available on <strong>Pro and Family plans</strong>.
      </p>

      <h2 id="custom-domain">Custom domain</h2>
      <p>
        On the <strong>Family plan</strong> you can serve your project or portfolio from your own
        domain (e.g. <code>book.yourname.com</code>). To set it up:
      </p>
      <ol>
        <li>
          Go to <strong>Account Settings → Domains</strong> and click <strong>Add domain</strong>.
        </li>
        <li>Enter the domain or subdomain you want to use.</li>
        <li>
          Add a <code>CNAME</code> record pointing to <code>cname.milestis.com</code> in your DNS
          provider.
        </li>
        <li>Wait up to 24 hours for DNS to propagate, then click <strong>Verify</strong>.</li>
      </ol>
      <p>
        SSL is provisioned automatically — your visitors will always get a secure HTTPS connection.
      </p>

      <h2 id="embed">Embed on another site</h2>
      <p>
        You can embed any published project as an interactive iframe. In{" "}
        <strong>Project Settings → Sharing</strong>, click <strong>Get embed code</strong> and copy
        the HTML snippet. Paste it into any website builder, WordPress, or Notion page.
      </p>
      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>
          Embedding is only possible for projects with <strong>Public visibility</strong> turned on.
        </span>
      </div>

      <h2 id="download-pdf">Download as PDF</h2>
      <p>
        Go to <strong>File → Export → PDF</strong>. You can choose between:
      </p>
      <ul>
        <li>
          <strong>Screen quality</strong> (72 dpi) — fast download, ideal for sharing digitally.
          Available on all plans.
        </li>
        <li>
          <strong>Print quality</strong> (300 dpi) — full-resolution for professional printing.
          Available on Pro and Family plans.
        </li>
      </ul>
      <p>Large projects may take a minute to generate. You will receive a download link by email
      once it&apos;s ready.</p>

      <h2 id="unpublish">Unpublish a project</h2>
      <p>
        To take a project offline, open <strong>Project Settings → Sharing</strong> and click{" "}
        <strong>Unpublish</strong>. The link will immediately return a 404 for all visitors. Your
        project and all its content are preserved — you can re-publish at any time.
      </p>
    </ArticleLayout>
  )
}
