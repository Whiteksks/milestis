import type { Metadata } from "next"
import { MenuGuestSessionProvider } from '@/editor/modes/menu/guest-session'

export const metadata: Metadata = {
  // Базовые метаданные — страница проекта переопределит их через generateMetadata
  title: "Milestis",
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  // Намеренно чистый layout — без sidebar, header, auth, i18n
  const { slug } = await params
  return <MenuGuestSessionProvider key={slug}>{children}</MenuGuestSessionProvider>
}
