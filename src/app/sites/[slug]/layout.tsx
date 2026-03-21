import type { Metadata } from "next"

export const metadata: Metadata = {
  // Базовые метаданные — страница проекта переопределит их через generateMetadata
  title: "Milestis",
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  // Намеренно чистый layout — без sidebar, header, auth, i18n
  return <>{children}</>
}
