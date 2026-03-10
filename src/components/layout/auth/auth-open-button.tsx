"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ProfileDropdown from "@/components/layout/auth/dropdown-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AuthDialogController from "./AuthDialogController"
import { useUserStore } from "@/hooks/useUserStore"

const HeaderAuthButton = () => {
  const [open, setOpen] = useState(false)
  const { profile, loading } = useUserStore()

  // Пока данные грузятся — ничего не показываем во избежание мерцания
  if (loading) return null

  if (profile) {
    return (
      <div className="flex items-center gap-2">
        <ProfileDropdown
          trigger={
            <Button variant='ghost' size='icon' className='size-9.5'>
              <Avatar className='size-9.5 rounded-md'>
                <AvatarImage src={profile.photoURL ?? ''} alt='avatar' />
                <AvatarFallback>
                  {(profile.displayName ?? 'U').slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          }
        />
      </div>
    )
  }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Login</Button>
      <AuthDialogController open={open} setOpen={setOpen} />
    </>
  )
}

export default HeaderAuthButton
