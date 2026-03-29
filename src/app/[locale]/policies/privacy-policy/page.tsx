export default function PrivacyPage() {
  return (
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
            we need it, and how we keep it safe. We&apos;ve written this in plain language because we want you to
            understand exactly how your data is handled.
          </p>
        </div>

      </div>
    </main>
  )
}
