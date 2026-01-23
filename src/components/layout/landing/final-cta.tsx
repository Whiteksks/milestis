import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function FinalCTA() {
  return (
    <section className="px-4 py-24 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">Keep the moments that matter</h2>
        <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
          Start preserving your most precious memories today
        </p>
        <div className="mt-10">
          <Button size="lg" className="gap-2 rounded-full px-10 py-6 text-lg">
            <Heart className="h-5 w-5" />
            Start creating memories
          </Button>
        </div>
      </div>
    </section>
  )
}
