import { Footer } from "@/components/layout/footer"

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {children}
      <Footer />
    </div>
  )
}
