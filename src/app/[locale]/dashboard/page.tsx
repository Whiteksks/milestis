import { CreateCards } from "@/components/layout/dashboard/create-cards"
import { ProjectGrid } from "@/components/layout/dashboard/project-grid"
import { DashboardGreeting } from "@/components/layout/dashboard/dashboard-greeting"
import Link from "next/link"
import { useTranslations } from "next-intl"

export default function DashboardPage() {
  const t = useTranslations()
  return (
    <div className="mx-auto max-w-6xl space-y-12">

      <section className="space-y-6">
        <DashboardGreeting />
        <CreateCards />
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl">{t('projects.recentTitle')}</h2>
            <p className="mt-1 text-muted-foreground">{t('projects.recentDescription')}</p>
          </div>
          <Link href="./dashboard/projects" className="text-sm text-primary hover:underline underline-offset-4">
            {t('projects.viewAll')}
          </Link>
        </div>
        <ProjectGrid limit={4} zoom={4}/>
      </section>

    </div>
  )
}
