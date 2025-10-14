'use client'

import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import {
  UserIcon,
  LogInIcon,
  AccessibilityIcon,
  MailIcon,
  LockIcon,
  DatabaseIcon,
  UsersIcon,
  CreditCardIcon,
  ShoppingCartIcon,
  GlobeIcon,
  type LucideProps,
} from 'lucide-react'

import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'

type NavigationSection = {
  title: string
  items: {
    name: string
    path: string
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
    >
  }[]
}

const settingsSections: NavigationSection[] = [
  {
    title: 'Панель управления',
    items: [
      { name: 'Главная', path: '/dashboard', icon: UserIcon },
    ],
  },
  {
    title: 'Личная учетная запись',
    items: [
      { name: 'Ваш профиль', path: '/account/profile', icon: UserIcon },
      { name: 'Логин', path: '/account/settings', icon: LogInIcon },
      { name: 'Доступность', path: '/account/accessibility', icon: AccessibilityIcon },
      { name: 'Параметры сообщений', path: '/account/messages', icon: MailIcon },
      { name: 'Конфиденциальность', path: '/account/privacy', icon: LockIcon },
      { name: 'Данные и хранилище', path: '/account/storage', icon: DatabaseIcon },
      { name: 'Ваша команда', path: '/account/team', icon: UsersIcon },
    ],
  },
  {
    title: 'Управление коллективом',
    items: [{ name: 'Люди', path: '/account/people', icon: UsersIcon }],
  },
  {
    title: 'Платежи и планы',
    items: [
      { name: 'Расчетный период', path: '/account/billing', icon: CreditCardIcon },
      { name: 'Заказы и счета', path: '/account/orders', icon: ShoppingCartIcon },
    ],
  },
  {
    title: 'Домены',
    items: [{ name: 'Веб-домены', path: '/account/domains', icon: GlobeIcon }],
  },
]

const SettingsSidebar = () => {
  const pathname = usePathname()
  const localePath = "/" + pathname.split("/").slice(2).join("/")
  const router = useRouter()

  return (
      <aside className="w-full md:w-64 shrink-0">
      <Card className="p-4">
        <nav className="flex flex-col gap-6">
          {settingsSections.map((section) => (
            <div key={section.title} className="flex flex-col gap-2">
              <span className="px-2 text-xs font-medium text-muted-foreground uppercase">
                {section.title}
              </span>
              {section.items.map((item) => {
                const isActive = localePath === item.path
                return (
                  <button
                    key={item.name}
                    onClick={() => router.push(item.path)}
                    className={cn(
                      'flex items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors text-left',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <item.icon className="size-4 shrink-0" />
                    {item.name}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>
      </Card>
    </aside>
  )
}

export default SettingsSidebar
