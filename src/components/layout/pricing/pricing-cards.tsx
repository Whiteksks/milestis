import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check } from "lucide-react"

const freePlanFeatures = ["1 memory book", "Basic layouts", "Shareable private link", "Works on all devices"]

const plusPlanFeatures = [
  "Multiple memory books",
  "Music and animations",
  "More customization options",
  "Priority rendering quality",
]

export function PricingCards() {
  return (
    <section className="px-6 pb-16">
      <div className="container mx-auto max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Free Plan */}
          <Card className="flex flex-col rounded-2xl border border-border bg-card p-8">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-medium text-foreground">Free</h3>
              <p className="mt-2 text-muted-foreground">For trying Milestis and creating your first memories</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {freePlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                    <Check className="h-3 w-3 text-foreground" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button variant="outline" className="w-full rounded-full border-border bg-transparent" size="lg">
              Create for free
            </Button>
          </Card>

          {/* Plus Plan */}
          <Card className="flex flex-col rounded-2xl border-2 border-primary/30 bg-linear-to-b from-accent/30 to-card p-8">
            <div className="mb-6">
              <h3 className="font-serif text-2xl font-medium text-foreground">Plus</h3>
              <p className="mt-2 text-muted-foreground">For families who want to keep more moments</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {plusPlanFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20">
                    <Check className="h-3 w-3 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <Button className="w-full rounded-full" size="lg">
              Upgrade when ready
            </Button>
            <p className="mt-3 text-center text-sm text-muted-foreground">You can upgrade anytime</p>
          </Card>
        </div>
      </div>
    </section>
  )
}
