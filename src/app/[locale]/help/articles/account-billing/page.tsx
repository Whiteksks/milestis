import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Managing your account & billing — Milestis Help",
  description: "How to update your plan, payment methods, invoices, and account settings.",
}

const toc = [
  { id: "account-settings", label: "Account settings" },
  { id: "change-plan", label: "Change your plan" },
  { id: "payment-methods", label: "Payment methods" },
  { id: "invoices", label: "Invoices & receipts" },
  { id: "cancel", label: "Cancel subscription" },
  { id: "delete-account", label: "Delete account" },
]

const meta = {
  title: "Managing your account & billing",
  description:
    "A complete reference for your Milestis account — from updating personal details to managing payments and cancelling.",
  category: "Account",
  readTime: "3 min read",
  updatedAt: "January 2026",
}

const related = [
  { title: "How to change your email", href: "/help/articles/change-email" },
  { title: "How credits work", href: "/help/articles/how-credits-work" },
]

export default function AccountBillingPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="account-settings">Account settings</h2>
      <p>
        Access all account and billing settings by clicking your avatar in the top-right corner and
        choosing <strong>Settings</strong>. The sidebar lets you navigate between:
      </p>
      <ul>
        <li>
          <strong>My Account</strong> — name, email, password, and connected social logins.
        </li>
        <li>
          <strong>Billing</strong> — current plan, payment methods, invoices, and credit balance.
        </li>
        <li>
          <strong>Notifications</strong> — email and in-app notification preferences.
        </li>
        <li>
          <strong>Privacy</strong> — data export and account deletion.
        </li>
      </ul>

      <h2 id="change-plan">Change your plan</h2>
      <p>
        Go to <strong>Settings → Billing → Current Plan</strong> and click{" "}
        <strong>Change plan</strong>. You can upgrade immediately — the new features become
        available right away and your next invoice is prorated.
      </p>
      <p>
        Downgrading takes effect at the end of the current billing period. Until then you keep all
        features of your existing plan.
      </p>
      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          Switching from monthly to annual billing saves up to 20 %. You can switch at any time
          from the same plan settings page.
        </span>
      </div>

      <h2 id="payment-methods">Payment methods</h2>
      <p>
        Milestis accepts <strong>Visa, Mastercard, American Express</strong>, and payments via{" "}
        <strong>Google Pay</strong> and <strong>Apple Pay</strong>. All card data is handled by
        Stripe — Milestis never stores your card numbers.
      </p>
      <p>
        To add or replace a card, go to <strong>Settings → Billing → Payment methods</strong> and
        click <strong>Add new card</strong>. Set any card as the default to use it for future
        renewals.
      </p>

      <h2 id="invoices">Invoices & receipts</h2>
      <p>
        A PDF invoice is emailed to you automatically after every successful charge. You can also
        download all historical invoices from <strong>Settings → Billing → Invoice history</strong>.
      </p>
      <p>
        If you need a VAT invoice or have a specific billing address, add those details under{" "}
        <strong>Settings → Billing → Billing information</strong> before your next renewal.
      </p>

      <h2 id="cancel">Cancel subscription</h2>
      <p>
        Go to <strong>Settings → Billing → Current Plan</strong> and click{" "}
        <strong>Cancel subscription</strong>. Cancellation takes effect at the end of the billing
        period — you won&apos;t be charged again, and you keep all plan features until then.
      </p>
      <p>
        After cancellation, your account switches to the free tier. Your projects and data are
        preserved. Some advanced features will be locked until you resubscribe.
      </p>
      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>
          Changed your mind? You can re-subscribe at any time from the same page without losing any
          data.
        </span>
      </div>

      <h2 id="delete-account">Delete account</h2>
      <p>
        Account deletion is permanent and <strong>cannot be undone</strong>. Before deleting, we
        recommend exporting your projects via <strong>File → Export</strong>.
      </p>
      <p>
        To delete your account, go to <strong>Settings → Privacy → Delete account</strong>. You will
        be asked to confirm with your password and a final confirmation prompt. All your data —
        projects, photos, and billing records — is erased within 30 days.
      </p>
    </ArticleLayout>
  )
}
