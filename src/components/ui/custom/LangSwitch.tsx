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

export function LanguageSwitcher() {
  const pathname = usePathname() 
  const router = useRouter()

  const segments = pathname.split('/')
  const currentLang = segments[1] || 'ru'

  function changeLang(lang: string) {
    const newSegments = [...segments]
    newSegments[1] = lang
    const newPath = newSegments.join('/')
    router.push(newPath)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {LANG_MAP[currentLang] || 'Русский'}
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