export default function TermsPage() {
  return (
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

        
      </div>
    </main>
  )
}
