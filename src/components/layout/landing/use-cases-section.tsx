import Image from "next/image"

const useCases = [
  {
    title: "Event Stories",
    description: "Turn any wedding or party into a living digital story. Created in 5 minutes from a phone, delivered as a premium gift link instantly.",
    image: "/images/event-story.jpg", // Замени на свой путь
  },
  {
    title: "Instant Portfolios",
    description: "Showcase your vision without touching a design tool. A high-end digital space for artists and creators to express themselves beautifully.",
    image: "/images/portfolio.jpg",
  },
  {
    title: "Photographer Upsell",
    description: "Don't just send a cloud folder. Deliver a branded digital product. Increase your average check by offering a premium experience.",
    image: "/images/upsell.jpg",
  },
]
export function UseCasesSection() {
  return (
    <section className="bg-secondary/50 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">
            One platform, multiple ways to wow
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            From instant wedding gifts to professional photography deliverables — quality is built-in by design.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg flex flex-col"
            >
              <div className="aspect-4/3 overflow-hidden relative">
                <Image
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-8 flex-grow">
                <h3 className="mb-3 text-xl font-semibold">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {useCase.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}