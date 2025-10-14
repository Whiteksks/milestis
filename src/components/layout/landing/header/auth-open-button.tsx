"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import AuthDialogController from "../../Dialog/DialogOptions/AuthDialogController"

const HeaderAuthButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)} className="">Login</Button>
      <AuthDialogController open={open} setOpen={setOpen} />
    </>
  )
}

export default HeaderAuthButton
