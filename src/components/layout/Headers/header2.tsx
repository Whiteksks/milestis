import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AuthModal } from "@/components/layout/landing/components/auth-modal"

interface HeaderProps {
  activePage?: "home" | "examples" | "pricing" | "faq"
}

export function Header({ activePage = "home" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-semibold text-foreground">Milestis</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activePage === "home"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            Home
          </Link>
          <Link
            href="/examples"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activePage === "examples"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            Examples
          </Link>
          <Link
            href="/pricing"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activePage === "pricing"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            Pricing
          </Link>
          <Link
            href="/faq"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              activePage === "faq"
                ? "bg-secondary text-foreground"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            FAQ
          </Link>
          <AuthModal>
            <Button className="ml-2 rounded-full" size="sm">
              Sign in
            </Button>
          </AuthModal>
        </nav>
      </div>
    </header>
  )
}
