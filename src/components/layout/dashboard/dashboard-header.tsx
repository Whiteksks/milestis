'use client'

import { BellIcon, LanguagesIcon, SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SidebarTrigger } from '@/components/ui/sidebar'

import LanguageDropdown from '@/components/ui/custom/dropdown-language'
import ProfileDropdown from '@/components/ui/custom/dropdown-profile'
import InputSearchLoader from '@/components/ui/custom/input-search'
import PopoverCredits from '@/components/ui/custom/CardTooltip'

interface HeaderAppProps {
  withSidebarTrigger?: boolean
}

const HeaderApp = ({ withSidebarTrigger = true }: HeaderAppProps) => {
  return (
    <header className='rounded-2xl shadow-2xs border bg-card/95 backdrop-blur-xl sticky z-50 mx-3 sm:mx-4 mt-4 overflow-hidden'>
      <div className='flex items-center justify-between gap-4 px-4 py-3 sm:px-6'>
        {/* Left: trigger + search */}
        <div className='flex items-center gap-4 w-full max-w-md'>
          {withSidebarTrigger && (
            <>
              <SidebarTrigger className='[&_svg]:!size-5 shrink-0' />
              <Separator orientation='vertical' className='hidden !h-4 sm:block' />
            </>
          )}

          {/* Desktop search */}
          <div className='hidden sm:flex w-full'>
            <InputSearchLoader />
          </div>

          {/* Mobile search icon */}
          <div className='flex sm:hidden'>
            <Button variant='ghost' size='icon'>
              <SearchIcon className='size-5' />
            </Button>
          </div>
        </div>

        {/* Right: icons */}
        <div className='flex items-center gap-1.5 flex-shrink-0'>
          <PopoverCredits
            permanentCredits={120}
            subscriptionCredits={30}
            subscriptionTotal={50}
            nextRenewal='12 ноября 2025'
          />
          <Button variant='ghost' size='icon'>
            <BellIcon className='size-5' />
          </Button>
          <LanguageDropdown
            trigger={
              <Button variant='ghost' size='icon' className='hidden sm:flex'>
                <LanguagesIcon />
              </Button>
            }
          />
          <ProfileDropdown
            trigger={
              <Button variant='ghost' size='icon' className='size-9.5'>
                <Avatar className='size-9.5 rounded-md'>
                  <AvatarImage src='https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-1.png' />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
        </div>
      </div>
    </header>
  )
}

export default HeaderApp
