"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"
import ProfileDropdown from "@/components/ui/custom/dropdown-profile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AuthDialogController from "./AuthDialogController"

const HeaderAuthButton = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const auth = getAuth()
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  if (!user) {
    return (
    <div className="flex items-center gap-2">
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
