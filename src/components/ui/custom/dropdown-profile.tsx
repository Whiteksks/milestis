'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import {
  UserIcon,
  SettingsIcon,
  CreditCardIcon,
  UsersIcon,
  SquarePenIcon,
  CirclePlusIcon,
  LogOutIcon
} from 'lucide-react'

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/custom/dropdown-menu'

import { onAuthStateChanged, signOut, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'

type Props = {
  trigger: ReactNode
  defaultOpen?: boolean
  align?: 'start' | 'center' | 'end'
}

const menuConfig = [
  {
    items: [
      { icon: UserIcon, label: 'My account', href: '/account/profile' },
      { icon: SettingsIcon, label: 'Settings', href: '/account/settings' },
      { icon: CreditCardIcon, label: 'Billing', href: '/account/billing' }
    ]
  },
  {
    items: [
      { icon: UsersIcon, label: 'Manage team', href: '/account/team' },
      { icon: SquarePenIcon, label: 'Customization', href: '/account/customization' },
      { icon: CirclePlusIcon, label: 'Add team account', href: '/account/team/add' }
    ]
  }
]

const ProfileDropdown = ({ trigger, defaultOpen, align = 'end' }: Props) => {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Следим за изменением авторизации
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  // Выход из аккаунта
  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/auth/login')
    } catch (error) {
      console.error('Ошибка при выходе:', error)
    }
  }

  // Фоллбэк, если пользователь не найден
  const displayName = user?.displayName || 'Anonymous User'
  const email = user?.email || 'no-email@example.com'
  const photoURL = user?.photoURL || 'https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png'
  const initials = displayName
    .split(' ')
    .map((word) => word[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>

      <DropdownMenuContent className="w-80" align={align}>
        {/* --- User Info --- */}
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage src={photoURL} alt={displayName} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">{displayName}</span>
            <span className="text-muted-foreground text-base">{email}</span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* --- Menu Groups --- */}
        {menuConfig.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {group.items.map(({ icon: Icon, label, href }) => (
                <DropdownMenuItem key={label} asChild className="px-4 py-2.5 text-base">
                  <Link href={href} className="flex items-center gap-2 w-full">
                    <Icon className="text-foreground size-5" />
                    <span>{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </div>
        ))}

        <DropdownMenuSeparator />

        {/* --- Logout --- */}
        <DropdownMenuItem
          onClick={handleLogout}
          className="px-4 py-2.5 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
        >
          <LogOutIcon className="size-5" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
