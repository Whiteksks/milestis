import { Sparkles } from "lucide-react"

export function PricingTeaser() {
  return (
    <section className="bg-card px-4 py-16 md:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl text-balance">
          Create your first memory book for free
        </h2>
        <p className="mt-4 text-muted-foreground">More options available when you&apos;re ready</p>
      </div>
    </section>
  )
}
