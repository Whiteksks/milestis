'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MenuIcon } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList
} from '@/components/ui/navigation-menu'

import { cn } from '@/lib/utils'
import { useUserStore } from '@/hooks/useUserStore'
import HeaderAuthButton from './auth/auth-open-button'
import Logo from './logo'

const NAVIGATION = [
  { title: 'Features', href: '/features' },
  { title: 'Our Story', href: '/story' },
  { title: 'Pricing', href: '/pricing' },
  { title: 'Help Center', href: '/help' }
]

interface HeaderProps {
  className?: string
  showAuthButton?: boolean
}

const Header = ({
  className,
  showAuthButton = true,
}: HeaderProps) => {

  const profile = useUserStore((state) => state.profile)
  const isAuthenticated = Boolean(profile)
  const logoHref = isAuthenticated ? '/about' : '/'
  const pathname = usePathname()
  const { scrollY } = useScroll()

  const normalizedPathname = useMemo(() => {
    const supportedLocales = new Set(['en', 'ru', 'kz'])
    const parts = pathname.split('/').filter(Boolean)
    const maybeLocale = parts[0]

    if (maybeLocale && supportedLocales.has(maybeLocale)) {
      const rest = parts.slice(1)
      return '/' + rest.join('/')
    }

    return pathname
  }, [pathname])
  
  const [isScrolled, setIsScrolled] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const lastDirectionChangeY = useRef(0)
  
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0
    const scrollDelta = latest - previous
    const isScrollingDown = scrollDelta > 0

    setIsScrolled(latest > 20)

    if (isScrollingDown) {
      if (latest > 150) setIsVisible(false)
      lastDirectionChangeY.current = latest 
    } else {
      const distanceScrolledUp = lastDirectionChangeY.current - latest
      
      if (distanceScrolledUp > 50 || latest < 10) {
        setIsVisible(true)
      }
    }
  })

  const isActive = (href: string) =>
    href === '/' ? normalizedPathname === '/' : normalizedPathname.startsWith(href)


  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  
  // // В самом return можно обернуть только содержимое или весь header
  // if (!mounted) {
  //   // Возвращаем header в базовом состоянии, чтобы он не "прыгал"
  //   return (
  //     <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-background border-b border-transparent">
  //       <div className="mx-auto flex h-full max-w-7xl items-center px-4">
  //         <Logo className="gap-3" />
  //       </div>
  //     </header>
  //   )
  // }

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-100%' },
      }}
      animate={isVisible ? 'visible' : 'hidden'}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ paddingRight: 'var(--removed-body-scroll-bar-size, 0px)' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300',
        isScrolled 
          ? 'h-16 bg-background/80 backdrop-blur-sm md:backdrop-blur-md' 
          : 'h-16 bg-background border-transparent',
        className
      )}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <Link href={logoHref} className="shrink-0">
          <Logo className="gap-3" />
        </Link>

        {/* Desktop navigation */}
        <NavigationMenu className="max-md:hidden">
          <NavigationMenuList className="gap-1">
            {NAVIGATION.map((item) => (
              <NavigationMenuItem key={item.title}>
                {/* Убираем NavigationMenuLink asChild вокруг анимированных ссылок для стабильности */}
                <Link
                  href={item.href}
                  className={cn(
                    'relative px-3 py-1.5 text-base font-medium rounded-md transition-colors block',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  {item.title}
                  {/* Анимация фона только после монтажа */}
                  {mounted && isActive(item.href) && (
                    <motion.div
                      // layoutId здесь не нужен, так как мы не хотим "перетекания"
                      initial={{ opacity: 0, scale: 0.9, y: 2 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 1000, // Жесткость пружины
                        damping: 20,    // Насколько быстро гаснут колебания
                        duration: 0.3
                      }}
                      className="absolute inset-0 bg-secondary -z-10 rounded-full"
                    />
                  )}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-3">
          {showAuthButton && <HeaderAuthButton />}
          
          {/* Mobile Menu */}
         <div className="md:hidden">
            {!mounted ? (
              // Статичная заглушка кнопки до загрузки JS
              <Button variant="outline" size="icon">
                <MenuIcon className="size-5" />
              </Button>
            ) : (
              // Интерактивное меню после монтажа
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MenuIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {NAVIGATION.map((item) => (
                    <DropdownMenuItem key={item.title} asChild>
                      <Link href={item.href} className={cn(isActive(item.href) && "bg-secondary")}>
                        {item.title}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default Header