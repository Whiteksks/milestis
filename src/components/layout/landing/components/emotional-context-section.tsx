import { Heart, Cake, HeartHandshake, Users } from "lucide-react"

const contexts = [
  {
    icon: HeartHandshake,
    label: "Weddings",
  },
  {
    icon: Cake,
    label: "Birthdays",
  },
  {
    icon: Heart,
    label: "Love stories",
  },
  {
    icon: Users,
    label: "Family memories",
  },
]

export function EmotionalContextSection() {
  return (
    <section className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <p className="mb-10 text-center text-lg text-muted-foreground">
          Perfect for capturing life&apos;s most meaningful moments
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {contexts.map((context) => (
            <div
              key={context.label}
              className="flex items-center gap-3 rounded-full bg-card px-6 py-3 shadow-sm transition-shadow hover:shadow-md"
            >
              <context.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium md:text-base">{context.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
