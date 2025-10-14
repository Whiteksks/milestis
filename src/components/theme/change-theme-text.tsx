'use client'

import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/custom/dropdown-menu'
import { useEffect, useState } from 'react'

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Нужно, чтобы избежать гидратации (на сервере темы нет)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="outline" disabled>
        ...
      </Button>
    )
  }

  // Определяем текст для кнопки
  const themeText =
    theme === 'system'
      ? 'Система'
      : resolvedTheme === 'light'
      ? 'Светлая'
      : 'Тёмная'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{themeText}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>Светлая</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>Тёмная</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>Система</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
