import { Header } from "@/components/layout/Headers/header2"
import { Footer } from "@/components/layout/landing/components/footer"
import { Shield, Eye, Lock, Settings, Users, RefreshCw } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl">
          {/* Hero */}
          <div className="mb-16 text-center">
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">We respect your privacy and treat your data with care.</p>
          </div>

          {/* Intro */}
          <div className="mb-12 rounded-2xl bg-secondary/30 p-6 sm:p-8">
            <p className="text-muted-foreground leading-relaxed">
              At Milestis, we believe your memories belong to you. This policy explains what information we collect, why
              we need it, and how we keep it safe. We've written this in plain language because we want you to
              understand exactly how your data is handled.
            </p>
          </div>

          {/* Sections */}
          <div className="space-y-10">
            {/* Section 1 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Eye className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Information we collect</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>When you use Milestis, we collect:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Your email address for account access</li>
                  <li>Basic account information you provide</li>
                  <li>Photos and content you choose to upload</li>
                </ul>
                <p className="mt-4 rounded-lg bg-secondary/30 p-4 text-sm">
                  We only collect what's necessary to make Milestis work for you.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">How we use your data</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>We use your information to:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Let you sign in and access your account</li>
                  <li>Save and display your memory book projects</li>
                  <li>Improve Milestis based on how people use it</li>
                  <li>Send important updates about your account</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Lock className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Photos and personal content</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>Your photos and memories are precious. Here's how we treat them:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>You own everything you upload — always</li>
                  <li>Your content is private by default</li>
                  <li>We never sell or share your photos with anyone</li>
                  <li>Only you decide who can see your memory books</li>
                </ul>
                <p className="mt-4 rounded-lg bg-secondary/30 p-4 text-sm">
                  Your memories stay yours. We're just here to help you preserve them beautifully.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Third-party services</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>To make Milestis work smoothly, we use a few trusted services:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Secure authentication providers (like Google sign-in)</li>
                  <li>Reliable hosting to keep your data safe</li>
                  <li>Basic analytics to understand how to improve</li>
                </ul>
                <p className="mt-4 text-sm">These services are carefully chosen and follow strict privacy standards.</p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Your control</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>You're always in control of your data:</p>
                <ul className="ml-4 list-disc space-y-2 marker:text-primary/50">
                  <li>Edit or delete your content anytime</li>
                  <li>Download your photos and projects</li>
                  <li>Request complete account removal</li>
                  <li>Ask us questions about your data</li>
                </ul>
              </div>
            </section>

            {/* Section 6 */}
            <section className="rounded-2xl border border-border/50 bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <RefreshCw className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-serif text-xl font-semibold text-foreground">Updates to this policy</h2>
              </div>
              <div className="space-y-3 text-muted-foreground leading-relaxed">
                <p>
                  If we make meaningful changes to this policy, we'll let you know through email or a notice in the app.
                  We won't surprise you with sudden changes to how your data is handled.
                </p>
              </div>
            </section>
          </div>

          {/* Footer note */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              If you have questions, feel free to{" "}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                contact us
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
