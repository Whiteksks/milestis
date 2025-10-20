"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import AuthDialogController from "../../Dialog/DialogOptions/AuthDialogController"
import { getAuth, onAuthStateChanged, User } from "firebase/auth"

const HeaderAuthButton = () => {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  // useEffect(() => {
  //   const auth = getAuth()
  //   const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  //     setUser(currentUser)
  //   })
  //   return () => unsubscribe()
  // }, [])

  // if (user) {
  //   return (
  //     <div className="flex items-center gap-2">
  //       {/* Временно просто показываем email */}
  //       <span className="text-sm text-muted-foreground">{user.email}</span>
  //       {/* Позже можно заменить на выпадающее меню профиля */}
  //     </div>
  //   )
  // }

  return (
    <>
      <Button onClick={() => setOpen(true)}>Login</Button>
      <AuthDialogController open={open} setOpen={setOpen} />
    </>
  )
}

export default HeaderAuthButton
