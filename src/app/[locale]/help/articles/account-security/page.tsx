import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Account and security — Milestis Help",
  description: "Learn how sign-in methods, login email, and public profile settings work in Milestis.",
}

const toc = [
  { id: "your-account", label: "Your account" },
  { id: "sign-in-methods", label: "Sign-in methods" },
  { id: "email-access", label: "Email access" },
  { id: "google-access", label: "Google access" },
  { id: "public-profile", label: "Public profile" },
  { id: "security-tips", label: "Security tips" },
]

const meta = {
  title: "Account and security",
  description:
    "A practical guide to sign-in, linked login methods, and the difference between your account identity and your public profile.",
  category: "Account",
  readTime: "4 min read",
  updatedAt: "April 2026",
}

const related = [
  { title: "How credits work", href: "/help/articles/how-credits-work" },
  { title: "Archive, deletion, and republishing", href: "/help/articles/archive-republish" },
]

export default function AccountSecurityPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="your-account">Your account</h2>
      <p>
        Your Milestis account is the private identity behind your projects, credits, subscriptions,
        and settings. It controls how you sign in and how your work is managed, but it is not the
        same thing as your public creator profile.
      </p>
      <p>
        In the account area you can manage your profile details, notification preferences, billing,
        security, domains, and archive.
      </p>

      <h2 id="sign-in-methods">Sign-in methods</h2>
      <p>Milestis currently supports two account access methods:</p>
      <ul>
        <li>
          <strong>Email sign-in</strong> — your email becomes a stable login method for account
          access and recovery.
        </li>
        <li>
          <strong>Google sign-in</strong> — useful for quick access and convenient day-to-day login.
        </li>
      </ul>
      <p>
        You can use one method or link both to the same account so you always have a backup way to
        get in.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          The safest setup is to have <strong>both email and Google linked</strong>. That gives you
          a second path back into the account if one method becomes unavailable.
        </span>
      </div>

      <h2 id="email-access">Email access</h2>
      <p>
        If your account already has email linked, that email acts as your main recovery-friendly
        login method. If your account was created with Google first, you can still add email access
        later from the <strong>Security</strong> section.
      </p>
      <p>
        When email is not yet linked, Milestis can send you a linking email so that the same account
        can also be accessed through an email-based flow.
      </p>

      <h2 id="google-access">Google access</h2>
      <p>
        Google access can be connected or disconnected from the same security area. This is helpful
        if you want faster login but still want your account anchored to an email-based method.
      </p>
      <p>
        Milestis prevents unsafe account states. For example, disconnecting Google is only allowed
        when email access is already linked, so you do not accidentally lock yourself out.
      </p>

      <h2 id="public-profile">Public profile</h2>
      <p>
        Your <strong>public profile</strong> is separate from your private login identity. Public name,
        location, bio, and social links can be edited without changing how you access the account.
      </p>
      <p>
        This distinction matters for creators: you may want one login identity for account security,
        but a different public-facing name for published work and portfolio presentation.
      </p>

      <h2 id="security-tips">Security tips</h2>
      <ul>
        <li>Keep at least two sign-in options linked when possible.</li>
        <li>Double-check your login email if you rely on it for account recovery.</li>
        <li>Use your public profile for presentation, not as a substitute for account security.</li>
        <li>
          If you are working on client or family projects, avoid sharing your account itself. Share
          published links instead.
        </li>
      </ul>

      <div className="kb-callout">
        <ShieldCheck className="kb-callout-icon text-amber-500" />
        <span>
          If account access is the issue, solve it in <strong>Security</strong>. If the goal is to
          change how your work appears publicly, solve it in <strong>Profile</strong> instead.
        </span>
      </div>
    </ArticleLayout>
  )
}