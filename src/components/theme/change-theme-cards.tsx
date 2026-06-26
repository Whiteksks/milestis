'use client'

import { useThemeTransition } from '@/hooks/useThemeTransition'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function ThemeCards() {
  const { setTheme, theme } = useThemeTransition()

  const themes = [
    { name: 'System', value: 'system' },
    { name: 'Light', value: 'light' },
    { name: 'Dark', value: 'dark' },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {themes.map((t) => (
        <Card
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`w-50 cursor-pointer transition hover:shadow-lg ${
            theme === t.value ? 'ring-2 ring-primary' : ''
          }`}
        >
          <CardHeader>
            <CardTitle className="text-center text-base">{t.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {t.value === 'light' && (
              <div className="p-4 bg-white rounded-md border">
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-200" />
                <Skeleton className="h-4 w-1/2 bg-gray-200" />
              </div>
            )}
            {t.value === 'dark' && (
              <div className="p-4 bg-gray-900 rounded-md border border-gray-700">
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-700" />
                <Skeleton className="h-4 w-1/2 bg-gray-700" />
              </div>
            )}
            {t.value === 'system' && (
              <div className="relative h-24 rounded-md border overflow-hidden">
                {/* Диагональный фон */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,white_50%,#111827_50%)]" />
                
                {/* Контент поверх */}
                <div className="absolute inset-0 flex">
                  <div className="flex-1 flex flex-col justify-center items-start pl-2">
                    <Skeleton className="h-3 w-3/4 mb-1 bg-gray-200" />
                    <Skeleton className="h-3 w-1/2 bg-gray-200" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center items-end pr-2">
                    <Skeleton className="h-3 w-1/2 mb-1 bg-gray-700" />
                    <Skeleton className="h-3 w-3/4 bg-gray-700" />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
