import { CreateCards } from "@/components/layout/dashboard/create-cards"
import { ProjectGrid } from "@/components/layout/dashboard/project-grid"
import { DashboardGreeting } from "@/components/layout/dashboard/dashboard-greeting"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">

      {/* Greeting + quick stats */}
      <DashboardGreeting />

      {/* Create */}
      <section className="space-y-6">
        <div>
          <h2 className="font-serif text-2xl md:text-3xl">Create something new</h2>
          <p className="mt-1 text-muted-foreground">Start a new project in seconds</p>
        </div>
        <CreateCards />
      </section>

      {/* Projects */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Recent projects</h2>
            <p className="mt-1 text-muted-foreground">Pick up where you left off</p>
          </div>
          <a href="./dashboard/projects" className="text-sm text-primary hover:underline underline-offset-4">
            View all →
          </a>
        </div>
        <ProjectGrid />
      </section>

    </div>
  )
}
