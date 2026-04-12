'use client'

import { type ReactNode, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  UserIcon,
  HomeIcon,
  HelpCircleIcon,
  ShieldCheckIcon,
  LogOutIcon,
} from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'
import { useIsMobile } from '@/hooks/use-mobile'
import { MobileDrawer } from '../../ui/custom/mobile-drawer'

// 1. Структура данных меню
const MENU_GROUPS = [
  {
    id: 'main',
    items: [
      { label: 'Home', href: '/dashboard', icon: HomeIcon },
      { label: 'Account', href: '/account/profile', icon: UserIcon },
    ]
  },
  {
    id: 'support',
    items: [
      { label: 'Help Center', href: '/help', icon: HelpCircleIcon },
      { label: 'Privacy Policy', href: '/privacy', icon: ShieldCheckIcon },
    ]
  }
]

// 2. Универсальный рендер контента (вне компонента, чтобы React не пересоздавал его на каждый рендер)
type MenuContentProps = {
  displayName: string
  photoURL: string
  initials: string
  onClose: () => void
  onLogout: () => void
}

function MenuContent({ displayName, photoURL, initials, onClose, onLogout }: MenuContentProps) {
  return (
    <div className="flex flex-col w-full">
      {/* Header / Profile Info */}
      <div className="flex items-center gap-2 p-2">
        <Avatar className="size-10 border ml-2 mt-2">
          <AvatarImage src={photoURL} alt={displayName} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
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
                {item.label}
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
          Logout
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
  const isMobile = useIsMobile()
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const { profile } = useUserStore()

  const displayName = profile?.displayName || 'User'
  const photoURL = profile?.photoURL || ''
  const initials = displayName.slice(0, 2).toUpperCase()

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
    photoURL,
    initials,
    onClose: () => setOpen(false),
    onLogout: handleLogout,
  }

  // 3. Условный рендеринг обертки
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