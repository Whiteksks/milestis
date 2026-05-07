"use client"

import Link from "next/link"
import LogoSvg from "@/components/icons/logo"
import { Separator } from "@/components/ui/separator"
import { useThemeTransition } from "@/hooks/useThemeTransition"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FOOTER_LINKS = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Examples", href: "/examples" },
      { label: "Milestis Releases", href: "/releases" },
    ],
  },
  {
    heading: "Help & Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Getting Started", href: "/help/articles/getting-started" },
      { label: "FAQ", href: "/help/faq" },
      { label: "Contact Support", href: "/help#contact" },
    ],
  },
  {
    heading: "About",
    links: [
      { label: "About Milestis", href: "/about" },
      { label: "Our story", href: "/story" },
      { label: "Legal", href: "/policies/legal" },
    ],
  },
]


export function Footer() {
  const { theme, setTheme } = useThemeTransition()

  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          
          {/* Brand column */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-6">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
              <LogoSvg className="h-9 w-auto" />
            </Link>
            
            <p className="max-w-xs text-base md:text-lg leading-relaxed text-muted-foreground">
              Create beautiful memory books, photobooks, and portfolios — in minutes.
            </p>

            <Select value={theme ?? "light"} onValueChange={setTheme}>
              <SelectTrigger className="w-36 rounded-full bg-secondary border-0 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="cozy">Cozy</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="hidden sm:block">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">
                {col.heading}
              </h3>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion */}
        <Accordion type="multiple" className="mt-12 sm:hidden border-t border-border/40">
          {FOOTER_LINKS.map((col) => (
            <AccordionItem key={col.heading} value={col.heading} className="border-border/40">
              <AccordionTrigger className="py-4 text-sm font-bold uppercase tracking-widest text-foreground hover:no-underline">
                {col.heading}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 pb-4">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-base text-muted-foreground"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>  
        <Separator className="my-12 opacity-50" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm md:text-base text-muted-foreground sm:flex-row">
          <p className="order-2 sm:order-1 text-center sm:text-left">
            © {new Date().getFullYear()} Milestis. All rights reserved.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 order-1 sm:order-2 font-medium">
            <Link href="/policies/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy Policy
            </Link>
            <Link href="/policies/cookie-policy" className="transition-colors hover:text-foreground">
              Cookie Policy
            </Link>
            <Link href="/policies/terms" className="transition-colors hover:text-foreground">
              Terms and Conditions
            </Link>
          </div>


        </div>
      </div>
    </footer>
  )
}