export default function CookiePolicy() {
  return (
    <main className="px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        {/* Hero */}
        <div className="mb-16 text-center">
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            How we use cookies to improve your experience.
          </p>
        </div>

        {/* Intro */}
        <div className="mb-12 rounded-2xl bg-secondary/30 p-6 sm:p-8">
          <p className="text-muted-foreground leading-relaxed">
            At Milestis, we use cookies and similar technologies to ensure our website functions correctly 
            and to provide you with a better experience. This policy explains what types of cookies we use, 
            why we use them, and how you can manage your preferences.
          </p>
        </div>
      </div>
    </main>
  )
}