"use client"

import { useState } from "react"
import { useShallow } from "zustand/react/shallow"
import { Button } from "@/components/ui/button"
import ProfileDropdown from "@/components/layout/auth/dropdown-profile"
import AuthDialogController from "./AuthDialogController"
import { selectAuthLoading, useUserStore } from "@/hooks/useUserStore"
import { UserAvatar } from "@/components/shared/user-avatar"

const HeaderAuthButton = () => {
  const [open, setOpen] = useState(false)
  const { profile, authLoading } = useUserStore(
    useShallow((state) => ({
      profile: state.profile,
      authLoading: selectAuthLoading(state),
    }))
  )

  // Пока данные грузятся — ничего не показываем во избежание мерцания
  if (authLoading) return null

  if (profile) {
    return (
      <div className="flex items-center gap-2">
        <ProfileDropdown
          trigger={
            <Button variant='ghost' className='size-9.5 rounded-full p-0 overflow-hidden'>
              <UserAvatar size="md" shape="circle" className="size-full"/>
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
