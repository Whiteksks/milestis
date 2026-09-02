'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const LANG_MAP: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  kz: 'Қазақша',
}

const ALL_LOCALES = ['en', 'ru', 'kz']
const POLICY_LOCALES = ['en', 'ru']

export const LOCALE_COOKIE = 'NEXT_LOCALE'

export function setLocaleCookie(lang: string) {
  document.cookie = `${LOCALE_COOKIE}=${lang}; path=/; max-age=31536000; SameSite=Lax`
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()

  const segments = pathname.split('/')
  const urlLang = segments[1] && ALL_LOCALES.includes(segments[1]) ? segments[1] : 'en'

  const isPolicyPage = pathname.includes('/policies')
  const activeLocales = isPolicyPage ? POLICY_LOCALES : ALL_LOCALES

  function changeLang(lang: string) {
    setLocaleCookie(lang)
    const newSegments = [...segments]
    newSegments[1] = lang
    router.push(newSegments.join('/'))
  }

  // --- ВАРИАНТ ДЛЯ СТРАНИЦ ПОЛИТИК (Фиксированный светлый стиль через Radix/Shadcn) ---
  if (isPolicyPage) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {/* Принудительно задаем светлые стили, сбрасывая dark: эффекты */}
          <Button 
            variant="outline" 
            className="flex items-center gap-2 border-slate-200 bg-white text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-200 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
          >
            {LANG_MAP[urlLang] || 'English'}
            <ChevronDown className="h-4 w-4 opacity-50 text-slate-500" />
          </Button>
        </DropdownMenuTrigger>
        
        {/* Принудительно светлый контент выпадающего списка */}
        <DropdownMenuContent 
          align="end" 
          className="border-slate-200 bg-white text-slate-900 dark:border-slate-200 dark:bg-white dark:text-slate-900"
        >
          {activeLocales.map((locale) => (
            <DropdownMenuItem 
              key={locale} 
              onClick={() => changeLang(locale)}
              className="cursor-pointer focus:bg-slate-100 focus:text-slate-900 dark:focus:bg-slate-100 dark:focus:text-slate-900"
            >
              {LANG_MAP[locale]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  // --- СТАНДАРТНЫЙ ВАРИАНТ ДЛЯ ОСТАЛЬНЫХ СТРАНИЦ ---
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className="h-9 rounded-xs border-border/50 bg-background/50 text-sm font-medium text-foreground transition-colors hover:border-border hover:bg-background focus-visible:ring-0"
        >
          <span>{LANG_MAP[urlLang] || 'English'}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 transition-transform duration-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="rounded-xs border-border bg-popover shadow-sm min-w-[120px]">
        {activeLocales.map((locale) => (
          <DropdownMenuItem 
            key={locale} 
            onClick={() => changeLang(locale)}
            className="rounded-xs text-xs font-medium text-foreground/80 cursor-pointer focus:bg-accent focus:text-accent-foreground"
          >
            {LANG_MAP[locale]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}