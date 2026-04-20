import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, Lightbulb, Link } from "lucide-react"

export const metadata: Metadata = {
  title: "How credits work — Milestis Help",
  description: "Learn what credits are in Milestis, where you can see your balance, and how publish cost is calculated.",
}

const toc = [
  { id: "what-are-credits", label: "What are credits?" },
  { id: "where-to-see-balance", label: "Where to see your balance" },
  { id: "publish-cost", label: "Publish cost" },
  { id: "credit-types", label: "Credit types" },
  { id: "running-low", label: "When credits run low" },
  { id: "faq", label: "Frequently asked questions" },
]

const meta = {
  title: "How credits work",
  description:
    "A practical guide to the Milestis credit system, including publish cost, remaining balance, and credit categories.",
  category: "Billing",
  readTime: "4 min read",
  updatedAt: "April 2026",
}

const related = [
  { title: "Account and security", href: "/help/articles/account-security" },
  { title: "Publish and share your project", href: "/help/articles/publish-share" },
]

export default function HowCreditsWorkPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="what-are-credits">What are credits?</h2>
      <p>
        Credits are the internal balance Milestis uses for publish-related actions and plan-based
        usage. Instead of charging every step separately in the interface, Milestis keeps that value
        in a credit system connected to your account.
      </p>
      <p>
        In practical terms, credits matter most when you are getting a project ready to go live.
        Before publishing, Milestis analyzes the project and shows how many credits the action will
        use.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          Your account balance can include <strong>subscription credits</strong>, <strong>bonus
          credits</strong>, and <strong>purchased credits</strong>. Milestis keeps these categories
          visible in Billing so you can understand what balance you still have available.
        </span>
      </div>

      <h2 id="where-to-see-balance">Where to see your balance</h2>
      <p>
        Open the <strong>Billing</strong> section of your account to see your current credit state.
        Milestis shows the remaining subscription balance, bonus credits, purchased credits, and the
        next reset date for the subscription part of your balance.
      </p>
      <p>
        This makes Billing the main place to check whether you are ready to publish now or whether
        you should wait for the next cycle.
      </p>

      <h2 id="publish-cost">Publish cost</h2>
      <p>Milestis currently calculates publish cost by project type:</p>
      <ul>
        <li>
          <strong>Portfolio Site</strong> — fixed publish cost of <strong>10 credits</strong>.
        </li>
        <li>
          <strong>Memory Book</strong> — tiered publish cost based on photo count:
          <ul>
            <li>up to 20 photos: 20 credits</li>
            <li>up to 30 photos: 25 credits</li>
            <li>up to 50 photos: 35 credits</li>
          </ul>
        </li>
      </ul>
      <p>
        Before the final publish action, Milestis shows the quote so you can review the project link,
        photo count, and required credits before confirming.
      </p>

      <h2 id="credit-types">Credit types</h2>
      <p>Milestis can hold more than one type of balance on the same account:</p>
      <ul>
        <li>
          <strong>Subscription credits</strong> — the recurring balance connected to your plan.
        </li>
        <li>
          <strong>Bonus credits</strong> — extra credits added outside the normal recurring cycle.
        </li>
        <li>
          <strong>Purchased credits</strong> — extra credits available on top of the plan allocation.
        </li>
      </ul>
      <p>
        You do not need to manage these manually inside projects. Milestis shows them in Billing and
        uses your account balance when publish actions are confirmed.
      </p>

      <div className="kb-callout">
        <Lightbulb className="kb-callout-icon text-amber-500" />
        <span>
          Think of credits as your <strong>publishing capacity</strong>. The cleanest workflow is to
          build first, review the quote second, and only then decide whether to publish immediately.
        </span>
      </div>

      <h2 id="running-low">When credits run low</h2>
      <p>
        If your available balance is lower than the required publish cost, Milestis will stop the
        final publish action before the project goes live. Your work is still safe, and you can keep
        editing until you are ready.
      </p>
      <p>
        The right next step depends on your account setup: wait for the next cycle, use existing
        purchased credits, or move to a plan that better matches how often you publish.
      </p>

      <h2 id="faq">Frequently asked questions</h2>
      <h3>Do all projects cost the same to publish?</h3>
      <p>
        No. Portfolio Sites use a fixed cost, while Memory Books use tiered pricing based on how many
        photos the project includes.
      </p>
      <h3>Can I see the cost before I publish?</h3>
      <p>
        Yes. Milestis analyzes the project first and shows the quote before the final publish step.
      </p>
      <h3>Does republish use more credits?</h3>
      <p>
        Not in the current product flow. Republish is currently supported without extra credit cost.
      </p>
    </ArticleLayout>
  )
}
