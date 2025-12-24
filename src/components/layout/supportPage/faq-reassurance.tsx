import { Heart, Lock, Smile } from "lucide-react"

const reassurances = [
  {
    icon: Heart,
    title: "Your memories belong to you",
    description: "Everything you create is yours to keep",
  },
  {
    icon: Smile,
    title: "No pressure to upgrade",
    description: "Start free and grow at your own pace",
  },
  {
    icon: Lock,
    title: "You're always in control",
    description: "Privacy settings are always in your hands",
  },
]

export function FaqReassurance() {
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
