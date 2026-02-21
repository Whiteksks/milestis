import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, AlertCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to change your email — Milestis Help",
  description: "Step-by-step guide to updating the email address on your Milestis account.",
}

const toc = [
  { id: "before-you-start", label: "Before you start" },
  { id: "step-by-step", label: "Step-by-step guide" },
  { id: "verification", label: "Email verification" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "faq", label: "Frequently asked questions" },
]

const meta = {
  title: "How to change your email address",
  description:
    "Learn how to update the email on your account — including verification and what to do if something goes wrong.",
  category: "Account",
  readTime: "3 min read",
  updatedAt: "January 2026",
}

const related = [
  { title: "Managing your account & billing", href: "/help/articles/account-billing" },
  { title: "Getting started with Milestis", href: "/help/articles/getting-started" },
]

export default function ChangeEmailPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="before-you-start">Before you start</h2>
      <p>
        Make sure you have access to both your <strong>current email</strong> and the{" "}
        <strong>new email address</strong> you want to use. Milestis will send a verification link
        to the new address — you will need to open it to confirm the change.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          If you signed up via Google or Apple, your email is managed by those providers. You can
          still add a password login in <strong>Account Settings → Security</strong>.
        </span>
      </div>

      <h2 id="step-by-step">Step-by-step guide</h2>

      <div className="space-y-0">
        <div className="kb-step">
          <div className="kb-step-number">1</div>
          <div className="kb-step-body">
            <p>
              <strong>Open Account Settings.</strong> Click your avatar in the top-right corner and
              choose <strong>Settings</strong> from the dropdown, or go directly to{" "}
              <strong>Settings → My Account</strong>.
            </p>
          </div>
        </div>

        <div className="kb-step">
          <div className="kb-step-number">2</div>
          <div className="kb-step-body">
            <p>
              <strong>Go to the Email section.</strong> Under the <strong>Profile</strong> tab you
              will see your current email address with an <strong>Edit</strong> button next to it.
            </p>
          </div>
        </div>

        <div className="kb-step">
          <div className="kb-step-number">3</div>
          <div className="kb-step-body">
            <p>
              <strong>Enter the new address.</strong> Type your new email in the input field and
              click <strong>Send verification</strong>. We will send a confirmation link to the new
              address.
            </p>
          </div>
        </div>

        <div className="kb-step">
          <div className="kb-step-number">4</div>
          <div className="kb-step-body">
            <p>
              <strong>Confirm your current password.</strong> For security, you will be asked to
              re-enter your current account password before the request is submitted.
            </p>
          </div>
        </div>

        <div className="kb-step">
          <div className="kb-step-number">5</div>
          <div className="kb-step-body">
            <p>
              <strong>Click the link in the verification email.</strong> Open your new inbox, find
              the Milestis message, and click <strong>Confirm new email</strong>. The change takes
              effect immediately.
            </p>
          </div>
        </div>
      </div>

      <h2 id="verification">Email verification</h2>
      <p>
        The verification link is valid for <strong>24 hours</strong>. If it expires, simply repeat
        the process from Settings to receive a new one.
      </p>
      <p>
        After the change, future sign-in attempts and notifications will go to the new address. Your
        old email is released and can be used for a different account.
      </p>

      <div className="kb-callout">
        <AlertCircle className="kb-callout-icon text-amber-500" />
        <span>
          Check your spam or junk folder if you don&apos;t see the verification email within a
          couple of minutes.
        </span>
      </div>

      <h2 id="troubleshooting">Troubleshooting</h2>
      <ul>
        <li>
          <strong>I didn't receive the verification email.</strong> Wait up to 5 minutes, then check
          spam. If still nothing, go back to Settings and re-send the verification.
        </li>
        <li>
          <strong>The link shows "already used" or "expired".</strong> Request a new verification
          link from Settings → Email.
        </li>
        <li>
          <strong>The new email is already in use.</strong> Each Milestis account requires a unique
          email. Sign in with that address or use a different one.
        </li>
        <li>
          <strong>I no longer have access to my current email.</strong> Contact support — we can
          verify your identity and update the address manually.
        </li>
      </ul>

      <h2 id="faq">Frequently asked questions</h2>
      <h3>Will my projects and data stay intact?</h3>
      <p>
        Yes. Changing your email only updates your login credential. All your projects, credits, and
        subscription remain exactly as they were.
      </p>
      <h3>Can I change my email more than once?</h3>
      <p>
        Yes, there is no limit. Just complete the verification process each time.
      </p>
      <h3>Does my subscription stay active after the email change?</h3>
      <p>
        Absolutely. Your billing is linked to your account, not your email address.
      </p>
    </ArticleLayout>
  )
}
