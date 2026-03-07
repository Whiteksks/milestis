import { CreateCards } from "@/components/layout/dashboard/create-cards"
import { ProjectGrid } from "@/components/layout/dashboard/project-grid"
import { DashboardGreeting } from "@/components/layout/dashboard/dashboard-greeting"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-12">

      <section className="space-y-6">
        <DashboardGreeting />
        <CreateCards />
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">Recent projects</h2>
            <p className="mt-1 text-muted-foreground">Pick up where you left off</p>
          </div>
          <Link href="./dashboard/projects" className="text-sm text-primary hover:underline underline-offset-4">
            View all →
          </Link>
        </div>
        <ProjectGrid />
      </section>

    </div>
  )
}
