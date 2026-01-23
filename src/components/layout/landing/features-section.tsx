import { Sparkles, Music, BookText, Link2, Smartphone, Lock } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Animated memory pages",
    description: "Gentle animations bring your photos and stories to life",
  },
  {
    icon: Music,
    title: "Music for atmosphere",
    description: "Add meaningful songs that set the mood",
  },
  {
    icon: BookText,
    title: "Story-first layouts",
    description: "Designed to let your stories shine",
  },
  {
    icon: Link2,
    title: "Personal shareable links",
    description: "One link to share with everyone who matters",
  },
  {
    icon: Smartphone,
    title: "Works everywhere",
    description: "Beautiful on phone, tablet and desktop",
  },
  {
    icon: Lock,
    title: "Privacy control",
    description: "You decide who can see your memories",
  },
]

export function FeaturesSection() {
  return (
    <section className="px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">Made for what matters</h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Features designed with feelings in mind, not specs
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
