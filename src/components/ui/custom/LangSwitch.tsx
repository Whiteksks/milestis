'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useUserStore } from '@/hooks/useUserStore'

const LANG_MAP: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  kz: 'Қазақша',
}

export function LanguageSwitcher() {
  const pathname = usePathname()
  const router = useRouter()
  const savedLanguage = useUserStore((s) => s.profile?.settings?.language)

  const segments = pathname.split('/')
  const urlLang = segments[1] || 'en'

  // If the user has a saved language preference and the URL doesn’t reflect it yet,
  // silently redirect once so the app matches their saved setting.
  useEffect(() => {
    if (savedLanguage && savedLanguage !== urlLang) {
      const newSegments = [...segments]
      newSegments[1] = savedLanguage
      router.replace(newSegments.join('/'))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedLanguage])

  // Display: saved preference wins over URL (avoids flicker before redirect)
  const currentLang = savedLanguage ?? urlLang

  function changeLang(lang: string) {
    const newSegments = [...segments]
    newSegments[1] = lang
    router.push(newSegments.join('/'))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {LANG_MAP[currentLang] || 'English'}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang('ru')}>Русский</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang('kz')}>Қазақша</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang('en')}>English</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}