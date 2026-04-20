import { LayoutTemplate, ImagePlus, Sparkles, Share2 } from "lucide-react"

const steps = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    description: "Choose from premium rigid layouts — professionally designed so the result always looks stunning, no matter the content.",
  },
  {
    icon: ImagePlus,
    title: "Add your content",
    description: "Upload visuals, write your copy, select a curated color palette. The structure handles itself.",
  },
  {
    icon: Sparkles,
    title: "Add your personal touch",
    description: "Place decorative elements freely, add depth effects and light layers — make the project unmistakably yours.",
  },
  {
    icon: Share2,
    title: "Publish and share",
    description: "One link. Anyone you send it to opens a fully interactive digital experience — no app, no download, any device.",
  },
]

export function HowItWorksSection() {
  return (
    <section className="bg-card px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">From content to finished project in 4 steps</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">No design skills. No guesswork. Quality is guaranteed by the platform.</p>
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
