import type { Metadata } from "next"
import { ArticleLayout } from "@/components/layout/kb/article-layout"
import { Info, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "What is Milestis — Milestis Help",
  description: "Learn what Milestis is, who it is for, and how the product works.",
}

const toc = [
  { id: "what-is-milestis", label: "What is Milestis?" },
  { id: "who-it-is-for", label: "Who it is for" },
  { id: "how-it-works", label: "How it works" },
  { id: "project-types", label: "Project types" },
  { id: "why-it-feels-different", label: "Why it feels different" },
]

const meta = {
  title: "What is Milestis",
  description:
    "Milestis is a platform for creating premium digital photobooks and portfolio sites in minutes, without traditional design complexity.",
  category: "Basics",
  readTime: "4 min read",
  updatedAt: "April 2026",
}

const related = [
  { title: "Create and edit your first project", href: "/help/articles/getting-started" },
  { title: "Publish and share your project", href: "/help/articles/publish-share" },
]

export default function WhatIsMilestisPage() {
  return (
    <ArticleLayout meta={meta} toc={toc} related={related}>
      <h2 id="what-is-milestis">What is Milestis?</h2>
      <p>
        <strong>Milestis</strong> is a platform for turning photos and stories into polished digital
        experiences you can publish and share as a link. Instead of giving users a complex design
        tool, Milestis gives them a structured system where the quality is already built into the
        layout.
      </p>
      <p>
        The goal is simple: help someone create something that looks premium in a few minutes,
        even from a phone, without learning design software first.
      </p>

      <div className="kb-callout">
        <Info className="kb-callout-icon text-primary" />
        <span>
          Milestis is built around the idea of <strong>result over editing</strong>. You are not
          expected to design from scratch. You select a format, add content, refine the mood, and
          publish.
        </span>
      </div>

      <h2 id="who-it-is-for">Who it is for</h2>
      <p>Milestis is designed for two main kinds of users:</p>
      <ul>
        <li>
          <strong>Individuals and families</strong> who want to create a beautiful digital gift,
          keepsake, or memory book for a wedding, birthday, trip, or milestone.
        </li>
        <li>
          <strong>Photographers and creators</strong> who want to deliver a finished digital product
          instead of just a folder of files.
        </li>
      </ul>
      <p>
        In both cases, the value is the same: a fast path from raw photos to something meaningful,
        presentable, and ready to share.
      </p>

      <h2 id="how-it-works">How it works</h2>
      <p>
        Milestis uses a <strong>rigid design system</strong>. That means the structure is already
        solved for you. You do not move everything freely on an empty canvas or build layouts from
        zero.
      </p>
      <p>Instead, you work inside a guided workflow:</p>
      <ol>
        <li>Create a new project from your dashboard.</li>
        <li>Choose the format that fits your goal.</li>
        <li>Add photos, text, and visual details.</li>
        <li>Preview the final result.</li>
        <li>Publish and share it with a link.</li>
      </ol>
      <p>
        This makes the product faster, easier to use on mobile, and much harder to break
        visually.
      </p>

      <h2 id="project-types">Project types</h2>
      <p>Milestis currently supports two project formats:</p>
      <ul>
        <li>
          <strong>Memory Book</strong> — a digital photobook for personal stories, milestones, and
          emotional moments.
        </li>
        <li>
          <strong>Portfolio Site</strong> — a published website for presenting work, style, and
          visual identity.
        </li>
      </ul>
      <p>
        Memory Books are suited to intimate sharing and gifting. Portfolio Sites are suited to
        public presentation and professional use.
      </p>

      <h2 id="why-it-feels-different">Why it feels different</h2>
      <p>
        Milestis is not trying to be a universal editor. It is designed to make one category of
        task feel dramatically easier: taking meaningful content and turning it into a finished
        digital product with confidence.
      </p>
      <ul>
        <li>
          <strong>Speed</strong> — you can go from blank project to published result in minutes.
        </li>
        <li>
          <strong>Design safety</strong> — layouts are structured so the result stays clean and
          premium.
        </li>
        <li>
          <strong>Atmosphere</strong> — palettes, textures, depth, and decorations help the project
          feel personal without making the workflow heavy.
        </li>
        <li>
          <strong>Web-native delivery</strong> — the result is already ready to open on any screen,
          without an app download.
        </li>
      </ul>

      <div className="kb-callout">
        <Sparkles className="kb-callout-icon text-amber-500" />
        <span>
          If you are new to the platform, the best next step is to create one small project first.
          Once you publish one Memory Book or Portfolio Site, the whole product model becomes clear.
        </span>
      </div>
    </ArticleLayout>
  )
}