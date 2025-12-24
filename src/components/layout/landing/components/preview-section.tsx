import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

export function PreviewSection() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">How a memory looks in Milestis</h2>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-card shadow-xl">
          {/* Preview mockup */}
          <div className="aspect-16/10 w-full">
            <img
              src="/placeholder.svg?height=600&width=960"
              alt="Milestis memory book preview"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-linear-to-t from-foreground/60 via-transparent to-transparent" />

          {/* CTA overlay */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
            <Button size="lg" variant="secondary" className="gap-2 rounded-full px-8 shadow-lg">
              <ExternalLink className="h-5 w-5" />
              Open example
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
