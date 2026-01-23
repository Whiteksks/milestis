import { Shield, RefreshCcw, Heart } from "lucide-react"

const reassurances = [
  {
    icon: Shield,
    title: "No pressure",
    description: "Take your time — there's no rush",
  },
  {
    icon: RefreshCcw,
    title: "Cancel anytime",
    description: "No commitments, no questions asked",
  },
  {
    icon: Heart,
    title: "Your memories stay yours",
    description: "Your content always belongs to you",
  },
]

export function PricingReassurance() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="container mx-auto max-w-4xl">
        <div className="rounded-2xl bg-secondary/50 px-6 py-10 md:px-12 md:py-14">
          <div className="grid gap-8 md:grid-cols-3">
            {reassurances.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-background">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-medium text-foreground">{item.title}</h4>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
