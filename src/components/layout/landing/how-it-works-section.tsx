import { ImagePlus, PenLine, LayoutGrid, Share2 } from "lucide-react"

const steps = [
  {
    icon: ImagePlus,
    title: "Choose photos and moments",
    description: "Select the memories you want to preserve",
  },
  {
    icon: PenLine,
    title: "Add stories, music and effects",
    description: "Bring your memories to life with personal touches",
  },
  {
    icon: LayoutGrid,
    title: "Arrange pages like a memory book",
    description: "Design your story page by page",
  },
  {
    icon: Share2,
    title: "Share with family",
    description: "Send a private link to your loved ones",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-card px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">How Milestis works</h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center">
              {/* Step number */}
              <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
                <step.icon className="h-7 w-7 text-primary" />
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[calc(50%+2.5rem)] top-8 hidden h-px w-[calc(100%-3rem)] bg-border lg:block" />
              )}

              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
