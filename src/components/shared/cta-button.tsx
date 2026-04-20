"use client"

import Link from "next/link"
import { useLocale } from "next-intl"
import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

type ButtonProps = ComponentProps<typeof Button>

interface CTAButtonProps extends Omit<ButtonProps, "asChild"> {
  children: React.ReactNode
}

export function CTAButton({ children, className, size, variant, ...props }: CTAButtonProps) {
  const locale = useLocale()

  return (
    <Button size={size} variant={variant} className={className} asChild {...props}>
      <Link href={`/${locale}/auth/login`}>
        {children}
      </Link>
    </Button>
  )
}
