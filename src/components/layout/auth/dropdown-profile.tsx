'use client'

import { type ReactNode, useState } from 'react'
import { useTranslations } from 'next-intl'
// Импортируем умные навигационные элементы из нашей конфигурации
import { Link, useRouter } from '@/i18n/routing'
import {
  UserIcon,
  HomeIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  LogOutIcon,
} from 'lucide-react'

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { UserAvatar } from '@/components/shared/user-avatar'

import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileDrawer } from '../../ui/custom/mobile-drawer'

// 1. Структура данных меню (оставляем только ключи локализации)
const MENU_GROUPS = [
  {
    id: 'main',
    items: [
      { key: 'home', href: '/dashboard', icon: HomeIcon },
      { key: 'account', href: '/account/profile', icon: UserIcon },
    ]
  },
  {
    id: 'support',
    items: [
      { key: 'helpCenter', href: '/help', icon: HelpCircleIcon },
      { key: 'privacyPolicy', href: '/policies/legal', icon: ShieldCheckIcon },
    ]
  }
]

type MenuContentProps = {
  displayName: string
  onClose: () => void
  onLogout: () => void
}

// 2. Универсальный рендер контента
function MenuContent({ displayName, onClose, onLogout }: MenuContentProps) {
  const t = useTranslations('ProfileDropdown')

  return (
    <div className="flex flex-col w-full">
      {/* Header / Profile Info */}
      <div className="flex items-center gap-2 p-2">
        <div className="ml-2 mt-2 shrink-0">
          <UserAvatar size="md" shape="circle" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="font-semibold truncate mt-2">{displayName}</span>
        </div>
      </div>

      {/* Mapping groups */}
      {MENU_GROUPS.map((group, idx) => (
        <div key={group.id}>
          {idx !== 0 && <hr className="my-2 opacity-50 mx-2" />}
          <div className="space-y-1 px-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center gap-3 p-2 text-sm font-medium rounded-lg hover:bg-accent transition-colors"
              >
                <item.icon className="size-4 text-muted-foreground" />
                {t(`links.${item.key}`)}
              </Link>
            ))}
          </div>
        </div>
      ))}

      <hr className="my-2 opacity-50 mx-2" />

      {/* Logout Action */}
      <div className="px-2 pb-2">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOutIcon className="size-4" />
          {t('logout')}
        </button>
      </div>
    </div>
  )
}

type Props = {
  trigger: ReactNode
  align?: 'start' | 'center' | 'end'
}

const ProfileDropdown = ({ trigger, align = 'end' }: Props) => {
  const t = useTranslations('ProfileDropdown')
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { profile } = useUserStore()

  // Если имя пользователя отсутствует, берем дефолтное значение из переводов
  const displayName = profile?.displayName || t('defaultUser')

  const handleLogout = async () => {
    setOpen(false)
    try {
      await signOut(auth)
      router.push('/auth/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const menuProps: MenuContentProps = {
    displayName,
    onClose: () => setOpen(false),
    onLogout: handleLogout,
  }

  if (isMobile) {
    return (
      <MobileDrawer
        open={open}
        onOpenChange={setOpen}
        trigger={trigger}
      >
        <MenuContent {...menuProps} />
      </MobileDrawer>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align={align}>
        <MenuContent {...menuProps} />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown