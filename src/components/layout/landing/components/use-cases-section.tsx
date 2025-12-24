const useCases = [
  {
    title: "Wedding memories",
    description: "Capture every beautiful moment of your special day",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Birthday gifts",
    description: "Create a heartfelt gift they'll treasure forever",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Love stories",
    description: "Tell your unique story from the beginning",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Family archives",
    description: "Preserve your family history for everyone",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    title: "Memories for future generations",
    description: "Pass down moments that define your family",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export function UseCasesSection() {
  return (
    <section className="bg-secondary/50 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-balance">Who is Milestis for?</h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.slice(0, 3).map((useCase) => (
            <div
              key={useCase.title}
              className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {useCases.slice(3).map((useCase) => (
            <div
              key={useCase.title}
              className="group overflow-hidden rounded-2xl bg-card shadow-sm transition-all hover:shadow-lg"
            >
              <div className="aspect-4/3 overflow-hidden">
                <img
                  src={useCase.image || "/placeholder.svg"}
                  alt={useCase.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold">{useCase.title}</h3>
                <p className="text-sm text-muted-foreground">{useCase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
