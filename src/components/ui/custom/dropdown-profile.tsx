import type { ReactNode } from 'react'
import Link from 'next/link'

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
  return (
    <DropdownMenu defaultOpen={defaultOpen}>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align={align}>
        {/* Label с аватаркой */}
        <DropdownMenuLabel className="flex items-center gap-4 px-4 py-2.5 font-normal">
          <div className="relative">
            <Avatar className="size-10">
              <AvatarImage
                src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png"
                alt="John Doe"
              />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="ring-card absolute right-0 bottom-0 block size-2 rounded-full bg-green-600 ring-2" />
          </div>
          <div className="flex flex-1 flex-col items-start">
            <span className="text-foreground text-lg font-semibold">
              John Doe
            </span>
            <span className="text-muted-foreground text-base">
              john.doe@example.com
            </span>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Рендер меню из массива */}
        {menuConfig.map((group, groupIndex) => (
          <div key={groupIndex}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            <DropdownMenuGroup>
              {group.items.map(({ icon: Icon, label, href }) => (
                <DropdownMenuItem
                  key={label}
                  asChild
                  className="px-4 py-2.5 text-base"
                >
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

        {/* Logout вынесен отдельно */}
        <DropdownMenuItem
          asChild
          className="px-4 py-2.5 text-base text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
        >
          <Link href="/account/logout" className="flex items-center gap-2 w-full">
            <LogOutIcon className="size-5" />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown
