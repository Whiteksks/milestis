'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/custom/dropdown-menu'

const LANG_MAP: Record<string, string> = {
  ru: 'Русский',
  en: 'English',
  kz: 'Қазақша',
}

export function LanguageSwitcher() {
  const pathname = usePathname() // например: /ru/account
  const router = useRouter()

  const segments = pathname.split('/')
  const currentLang = segments[1] || 'en' // если нет — дефолт 'en'

  function changeLang(lang: string) {
    const newSegments = [...segments]
    newSegments[1] = lang
    const newPath = newSegments.join('/')
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{LANG_MAP[currentLang] || 'Русский'}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => changeLang('ru')}>Русский</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang('en')}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLang('kz')}>Қазақша</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
