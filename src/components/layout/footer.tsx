"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { cn } from "@/lib/utils" 

import LogoSvg from "@/components/assets/logo"
import { Separator } from "@/components/ui/separator"
import { useThemeTransition } from "@/hooks/useThemeTransition"
import { LanguageSwitcher } from "../ui/custom/LangSwitch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FOOTER_LINKS = [
  {
    id: "product",
    links: [
      { key: "features", href: "/features" },
      { key: "restaurants", href: "/restaurants" },
      { key: "pricing", href: "/pricing" },
      { key: "releases", href: "/releases" },
    ],
  },
  {
    id: "support",
    links: [
      { key: "helpCenter", href: "/help" },
      { key: "gettingStarted", href: "/help/articles/getting-started" },
      { key: "faq", href: "/help/faq" },
    ],
  },
  {
    id: "about",
    links: [
      { key: "aboutUs", href: "/about" },
      { key: "story", href: "/story" },
      { key: "legal", href: "/policies/legal" },
    ],
  },
]

interface FooterProps extends React.ComponentProps<"footer"> {
  showThemeSwitcher?: boolean
}

export function Footer({
  className,
  showThemeSwitcher = true,
  ...props
}: FooterProps) {
  const t = useTranslations("Footer")
  const { theme, setTheme } = useThemeTransition()

  return (
    <footer 
      className={cn("border-t border-border bg-background transition-colors duration-300", className)} 
      {...props}
    >
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          
          {/* Brand column */}
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-6">
            <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
              <LogoSvg className="h-9 w-auto" />
            </Link>
            
            <p className="max-w-xs text-base md:text-lg leading-relaxed text-muted-foreground">
              {t("description")}
            </p>

            {/* Группа контролов: тема и язык */}
            <div className="flex flex-row items-center gap-4">
              {showThemeSwitcher && (
                <Select value={theme ?? "light"} onValueChange={setTheme}>
                <SelectTrigger className="w-36 rounded-xs border border-border/50 bg-background/50 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-background focus:ring-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xs border border-border bg-popover shadow-sm">
                  <SelectItem 
                    value="light" 
                    className="rounded-xs text-xs font-medium text-foreground/80 cursor-pointer focus:bg-accent focus:text-accent-foreground"
                  >
                    {t("themes.light")}
                  </SelectItem>
                  <SelectItem 
                    value="cozy" 
                    className="rounded-xs text-xs font-medium text-foreground/80 cursor-pointer focus:bg-accent focus:text-accent-foreground"
                  >
                    {t("themes.cozy")}
                  </SelectItem>
                  <SelectItem 
                    value="dark" 
                    className="rounded-xs text-xs font-medium text-foreground/80 cursor-pointer focus:bg-accent focus:text-accent-foreground"
                  >
                    {t("themes.dark")}
                  </SelectItem>
                </SelectContent>
              </Select>
              )}

              <LanguageSwitcher />
            </div>
          </div>

          {/* Desktop link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.id} className="hidden sm:block">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-current">
                {t(`headings.${col.id}`)}
              </h3>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-current"
                    >
                      {t(`links.${link.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Legal column */}
          <div className="hidden sm:block w-84">
            <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-current">
              {t("headings.legal")}
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/policies/acceptable-use-policy" className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-current">
                  {t("policies.acceptableUse")}
                </Link>
              </li>
              <li>
                <Link href="/policies/refund-policy" className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-current">
                  {t("policies.refund")}
                </Link>
              </li>
              <li>
                <Link href="/policies/cookie-policy" className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-current">
                  {t("policies.cookie")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => (window as Window & { _iub?: { cs?: { api?: { openPreferences?: () => void } } } })._iub?.cs?.api?.openPreferences?.()}
                  className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-current"
                >
                  {t("policies.privacyChoices")}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile accordion */}
        <Accordion type="multiple" className="mt-12 sm:hidden border-t border-border/40">
          {FOOTER_LINKS.map((col) => (
            <AccordionItem key={col.id} value={col.id} className="border-border/40">
              <AccordionTrigger className="py-4 text-sm font-bold uppercase tracking-widest text-current hover:no-underline">
                {t(`headings.${col.id}`)}
              </AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-4 pb-4">
                  {col.links.map((link) => (
                    <li key={link.key}>
                      <Link
                        href={link.href}
                        className="inline-flex items-center gap-2 text-base text-muted-foreground"
                      >
                        {t(`links.${link.key}`)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          ))}

          {/* Legal accordion item */}
          <AccordionItem value="legal" className="border-border/40">
            <AccordionTrigger className="py-4 text-sm font-bold uppercase tracking-widest text-current hover:no-underline">
              {t("headings.legal")}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-4 pb-4">
                <li>
                  <Link href="/policies/acceptable-use-policy" className="inline-flex items-center gap-2 text-base text-muted-foreground">
                    {t("policies.acceptableUse")}
                  </Link>
                </li>
                <li>
                  <Link href="/policies/refund-policy" className="inline-flex items-center gap-2 text-base text-muted-foreground">
                    {t("policies.refund")}
                  </Link>
                </li>
                <li>
                  <Link href="/policies/cookie-policy" className="inline-flex items-center gap-2 text-base text-muted-foreground">
                    {t("policies.cookie")}
                  </Link>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => (window as Window & { _iub?: { cs?: { api?: { openPreferences?: () => void } } } })._iub?.cs?.api?.openPreferences?.()}
                    className="inline-flex items-center gap-2 text-base text-muted-foreground"
                  >
                    {t("policies.privacyChoices")}
                  </button>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>  
        
        <Separator className="my-12 opacity-50" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-2 text-sm md:text-base text-muted-foreground sm:flex-row">
          <p className="order-2 sm:order-1 text-center sm:text-left">
            © {new Date().getFullYear()} Milestis. {t("rightsReserved")}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-2 order-1 sm:order-2 text-sm text-muted-foreground/80 font-normal">
            <Link href="/policies/privacy-policy" className="transition-colors hover:text-current">
              {t("policies.privacy")}
            </Link>
            <span className="text-muted-foreground/30 select-none hidden sm:inline">|</span>

            <Link href="/policies/terms" className="transition-colors hover:text-current">
              {t("policies.terms")}
            </Link>
            <span className="text-muted-foreground/30 select-none hidden sm:inline">|</span>

            <Link href="/sitemap" className="transition-colors hover:text-current">
              {t("policies.sitemap")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
