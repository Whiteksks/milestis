import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, Lightbulb, Link } from "lucide-react"

export const metadata: Metadata = {
  title: "How credits work — Milestis Help",
  description: "Learn what credits are, how they refresh, and when you need them.",
}

const toc = [
  { id: "what-are-credits", label: "What are credits?" },
  { id: "how-they-refresh", label: "How credits refresh" },
  { id: "what-uses-credits", label: "What uses credits" },
  { id: "getting-more", label: "Getting more credits" },
  { id: "faq", label: "Frequently asked questions" },
]

const meta = {
  title: "How credits work",
  description:
    "A complete guide to understanding Milestis credits — what they cover, when they reset, and how to get more.",
  category: "Billing",
  readTime: "4 min read",
  updatedAt: "January 2026",
}

const related = [
  { title: "Managing your account & billing", href: "/help/articles/account-billing" },
  { title: "Create your first photobook", href: "/help/articles/getting-started" },
]

export default function HowCreditsWorkPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="what-are-credits">What are credits?</h2>
      <p>
        Credits are the in-app currency that power AI-assisted features inside Milestis — things
        like generating layouts, applying smart themes, and creating captions for your photos.
        Every account starts with a monthly credit allowance based on your plan.
      </p>
      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          Free accounts receive a limited number of credits per month. Pro and Family plans come
          with a larger allowance. See the <Link href="/pricing">Pricing page</Link> for exact numbers.
        </span>
      </div>

      <h2 id="how-they-refresh">How credits refresh</h2>
      <p>
        Credits reset to your plan&apos;s full allowance on the <strong>first day of each billing
        cycle</strong>. Unused credits do <strong>not</strong> carry over to the next month.
      </p>
      <p>
        You can always see your current balance and reset date at the top of{" "}
        <strong>Settings → Billing</strong>.
      </p>

      <h2 id="what-uses-credits">What uses credits</h2>
      <p>The following actions consume credits:</p>
      <ul>
        <li>
          <strong>AI layout generation</strong> — automatically arranging photos into a balanced
          spread (5 credits per layout).
        </li>
        <li>
          <strong>Smart captions</strong> — AI-written captions for individual photos or entire
          pages (2 credits per caption).
        </li>
        <li>
          <strong>Theme suggestions</strong> — getting color palette and font recommendations for
          your project (3 credits per suggestion set).
        </li>
        <li>
          <strong>Background removal</strong> — removing image backgrounds with one click (4 credits
          per photo).
        </li>
      </ul>
      <p>
        Regular actions — uploading photos, editing text, changing layouts manually, sharing, and
        downloading — are <strong>always free</strong> and never consume credits.
      </p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>
          A preview of the credit cost is always shown before you confirm an AI action. You can
          cancel at any point without spending credits.
        </span>
      </div>

      <h2 id="getting-more">Getting more credits</h2>
      <p>There are two ways to add credits mid-cycle:</p>
      <ol>
        <li>
          <strong>Upgrade your plan.</strong> Moving to a higher tier immediately gives you that
          plan&apos;s full monthly allowance, prorated for the remaining days in the cycle.
        </li>
        <li>
          <strong>Buy a credit top-up.</strong> Go to <strong>Settings → Billing → Buy
          credits</strong> and choose a one-time pack. Top-up credits do not expire until the end
          of the following month.
        </li>
      </ol>

      <h2 id="faq">Frequently asked questions</h2>
      <h3>What happens when I run out of credits?</h3>
      <p>
        AI features will be unavailable until your credits refresh at the start of the next billing
        cycle, or until you purchase a top-up. All non-AI editing continues to work normally.
      </p>
      <h3>Do credits transfer if I change my plan?</h3>
      <p>
        Upgrading mid-cycle gives you the new plan&apos;s full allowance. Downgrading takes effect
        at the start of the next cycle, so you keep the current allowance until then.
      </p>
      <h3>Are credits refundable?</h3>
      <p>
        Monthly plan credits are non-refundable, as they are included in your subscription. Top-up
        packs purchased separately can be refunded within 14 days if unused — contact support.
      </p>
    </ArticleLayout>
  )
}
