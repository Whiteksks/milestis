import { BookOpen, Upload, User, CreditCard, Server, XCircle, FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">

      <main className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Hero */}
          <div className="mb-16 text-center">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple rules to keep Milestis safe and enjoyable for everyone.
            </p>
          </div>

          {/* Intro */}
          <div className="mb-12 rounded-2xl bg-secondary/30 p-6 sm:p-8">
            <p className="text-muted-foreground leading-relaxed">
              By using Milestis, you agree to follow a few basic guidelines. We&apos;ve written these in human language — no
              confusing legal terms. These rules help us create a safe, respectful space for everyone to preserve their
              memories.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {/* Section 1 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Using Milestis</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Milestis is designed for:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Personal memory books and photo stories</li>
                  <li>Professional work for clients (photographers, event planners)</li>
                  <li>Sharing special moments with family and friends</li>
                </ul>
                <p className="mt-4">
                  Please don&apos;t use Milestis for anything harmful, illegal, or that could hurt others. We want this to be
                  a positive space for everyone.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Your content</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>When you upload photos and create memory books:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>You keep full ownership of everything you create</li>
                  <li>You&apos;re responsible for having the right to use what you upload</li>
                  <li>Please respect others&apos; privacy in photos you share</li>
                </ul>
                <p className="mt-4 rounded-lg bg-secondary/30 p-4 text-sm">
                  Your memories, your rules. We just provide the tools to make them beautiful.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Your account</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>A few simple rules about accounts:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>One account per person is plenty</li>
                  <li>Keep your login details safe and private</li>
                  <li>Let us know if you notice any unusual activity</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Paid features</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>If you choose to use paid features:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Prices are shown clearly before you pay</li>
                  <li>No hidden fees or surprise charges</li>
                  <li>Cancel anytime — your free features remain available</li>
                </ul>
                <p className="mt-4 text-sm">We believe in being upfront about costs. What you see is what you pay.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Server className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Service availability</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>We work hard to keep Milestis running smoothly, but we want to be honest:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Sometimes we need to update or improve things</li>
                  <li>Features may change as we make Milestis better</li>
                  <li>Occasional maintenance is necessary</li>
                </ul>
                <p className="mt-4 text-sm">We&apos;ll always try to give you notice when possible.</p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <XCircle className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Ending your account</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>You&apos;re free to leave whenever you want:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Delete your account at any time</li>
                  <li>Download your content before you go</li>
                  <li>No hard feelings — we hope you come back</li>
                </ul>
                <p className="mt-4 text-sm">
                  We may also remove accounts that seriously violate these guidelines, but we&apos;ll always try to reach out
                  first.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Changes to these terms</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  If we update these terms, we&apos;ll let you know in advance. We won&apos;t surprise you with major changes —
                  you&apos;ll always have time to review what&apos;s new before continuing to use Milestis.
                </p>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-16 rounded-2xl bg-secondary/30 p-6 text-center sm:p-8">
            <p className="text-muted-foreground">
              These terms exist to protect both you and Milestis. <br className="hidden sm:block" />
              If something isn&apos;t clear, just{" "}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                ask us
              </a>
              .
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
