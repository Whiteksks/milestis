"use client"

import Link from "next/link"
import LogoSvg from "@/components/icons/logo"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
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
      { label: "Features", href: "/#features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Examples", href: "/examples" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap", badge: "New" },
    ],
  },
  {
    heading: "Create",
    links: [
      { label: "Photobook", href: "/examples" },
      { label: "Memory Book", href: "/examples" },
      { label: "Portfolio", href: "/examples" },
      { label: "Templates", href: "/examples" },
    ],
  },
  {
    heading: "Help & Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Getting Started", href: "/help/articles/getting-started" },
      { label: "How Credits Work", href: "/help/articles/how-credits-work" },
      { label: "Publish & Share", href: "/help/articles/publish-share" },
      { label: "FAQ", href: "/help/faq" },
      { label: "Contact Support", href: "/help#contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Press Kit", href: "/press" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/policies/privacy-policy" },
      { label: "Terms of Service", href: "/policies/terms-of-service" },
      { label: "Cookie Policy", href: "/policies/cookie-policy" },
      { label: "GDPR", href: "/policies/gdpr" },
    ],
  },
]

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4 fill-current">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:py-16">
        {/* Top row: brand + columns */}
        <div className="grid gap-10 md:grid-cols-4 lg:grid-cols-[1.6fr_repeat(5,1fr)]">
          {/* Brand column */}
            <div className="flex flex-col items-center text-center gap-5 sm:items-start sm:text-left">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <LogoSvg className="h-8 w-auto" />
              </Link>
              
              {/* Описание: на мобилках можно оставить, но центрируем */}
              <p className="max-w-[220px] text-sm leading-6 text-muted-foreground">
                Create beautiful memory books, photobooks, and portfolios — in minutes.
              </p>

              {/* Social icons: центрируются автоматически благодаря flex и parent container */}
              <div className="flex items-center gap-3">
                {SOCIAL_LINKS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

          {/* Desktop link columns — hidden on mobile */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.heading} className="hidden sm:block">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-foreground">
                {col.heading}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                      {"badge" in link && link.badge && (
                        <Badge
                          variant="secondary"
                          className="rounded-full px-1.5 py-0 text-[10px] font-medium"
                        >
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Mobile accordion columns — visible only on mobile */}
        <Accordion type="multiple" className="mt-8 sm:hidden">
          {FOOTER_LINKS.map((col) => (
            <AccordionItem key={col.heading} value={col.heading} className="border-border/50">
              <AccordionTrigger className="text-sm font-semibold uppercase tracking-wider text-foreground hover:no-underline">
                {col.heading}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-3 pb-1">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.label}
                        {"badge" in link && link.badge && (
                          <Badge
                            variant="secondary"
                            className="rounded-full px-1.5 py-0 text-[10px] font-medium"
                          >
                            {link.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <Separator className="my-10" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Milestis. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/policies/privacy-policy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link href="/policies/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
            <Link href="/policies/cookies" className="transition-colors hover:text-foreground">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
