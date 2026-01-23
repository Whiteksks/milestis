import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl font-semibold">Milestis</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <a href="#" className="transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>

          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Milestis</p>
        </div>
      </div>
    </footer>
  )
}
