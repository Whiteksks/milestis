import { Footer } from "@/components/layout/footer"
import Header from "@/components/layout/header"

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-white overflow-x-hidden">
      <Header className="bg-white text-black" />
      <div className="mx-auto w-full max-w-8xl">
        {children}
      </div>
      <Footer className="bg-white text-black" showThemeSwitcher={false} />
    </div>
  )
}
