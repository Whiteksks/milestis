"use client"

import LogoSvg from "@/components/assets/logo"
import { Separator } from "@/components/ui/separator"
import { useThemeTransition } from "@/hooks/useThemeTransition"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslations } from "next-intl"
// Импортируем твой "умный" линк, который знает про локали
import { Link } from "@/i18n/routing"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { LanguageSwitcher } from "../ui/custom/LangSwitch"

// Вместо сырых строк храним только системные ключи
const FOOTER_LINKS = [
  {
    id: "product",
    links: [
      { key: "features", href: "/features" },
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

export function Footer() {
  const t = useTranslations("Footer")
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
    {t("description")}
  </p>

  {/* Группа контролов: тема и язык */}
  <div className="flex flex-row items-center gap-4">
    <Select value={theme ?? "light"} onValueChange={setTheme}>
      <SelectTrigger className="w-36 rounded-full bg-secondary border-0 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="light">{t("themes.light")}</SelectItem>
        <SelectItem value="cozy">{t("themes.cozy")}</SelectItem>
        <SelectItem value="dark">{t("themes.dark")}</SelectItem>
      </SelectContent>
    </Select>

    <LanguageSwitcher />
  </div>
</div>

          {/* Desktop link columns */}
          {FOOTER_LINKS.map((col) => (
            <div key={col.id} className="hidden sm:block">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-foreground">
                {t(`headings.${col.id}`)}
              </h3>
              <ul className="space-y-4">
                {col.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-base text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t(`links.${link.key}`)}
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
            <AccordionItem key={col.id} value={col.id} className="border-border/40">
              <AccordionTrigger className="py-4 text-sm font-bold uppercase tracking-widest text-foreground hover:no-underline">
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
        </Accordion>  
        <Separator className="my-12 opacity-50" />

        {/* Bottom row */}
        <div className="flex flex-col items-center justify-between gap-6 text-sm md:text-base text-muted-foreground sm:flex-row">
          <p className="order-2 sm:order-1 text-center sm:text-left">
            © {new Date().getFullYear()} Milestis. {t("rightsReserved")}
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 order-1 sm:order-2 font-medium">
            <Link href="/policies/privacy-policy" className="transition-colors hover:text-foreground">
              {t("policies.privacy")}
            </Link>
            <Link href="/policies/cookie-policy" className="transition-colors hover:text-foreground">
              {t("policies.cookie")}
            </Link>
            <Link href="/policies/terms" className="transition-colors hover:text-foreground">
              {t("policies.terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}