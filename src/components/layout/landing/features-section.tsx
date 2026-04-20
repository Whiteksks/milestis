import { ShieldCheck, Layers, MousePointer2, Palette, Sparkles, Link2 } from "lucide-react"

const features = [
  {
    icon: ShieldCheck,
    title: "Design you can't break",
    description: "Rigid layouts lock in professional structure. You only change the content — premium quality is baked into every template.",
  },
  {
    icon: Layers,
    title: "Depth & atmosphere",
    description: "Light rays, cinematic textures and layered shadows make every visual look like it belongs in a high-end production.",
  },
  {
    icon: MousePointer2,
    title: "Freeform decorations",
    description: "Drag and place decorative elements anywhere on the page. Add personality without disrupting the underlying layout.",
  },
  {
    icon: Palette,
    title: "Curated color palettes",
    description: "Handcrafted palettes engineered for aesthetic harmony. Pick one — the entire project falls into place automatically.",
  },
  {
    icon: Sparkles,
    title: "Interactive animations",
    description: "Every project comes alive with smooth motion powered by Framer Motion — the kind of feel that rivals native apps.",
  },
  {
    icon: Link2,
    title: "Share with one link",
    description: "Publish and send. The recipient opens a live interactive experience on any device — no app, no download.",
  },
]

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">Everything your project deserves</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Built around one principle: the result should always look premium — regardless of who made it
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary transition-colors group-hover:bg-accent">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
