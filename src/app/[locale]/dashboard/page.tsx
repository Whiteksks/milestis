import { CreateCards } from "@/components/layout/dashboard/create-cards"
import { ProjectGrid } from "@/components/layout/dashboard/project-grid"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10">
      <section>
        <h2 className="mb-5 text-xl font-semibold text-foreground">Create something new</h2>
        <CreateCards />
      </section>
      <section>
        <h2 className="mb-5 text-xl font-semibold text-foreground">Recent Projects</h2>
        <ProjectGrid />
      </section>
    </div>
  )
}
