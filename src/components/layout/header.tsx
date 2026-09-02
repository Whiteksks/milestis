'use client'

import { useEffect, useRef, useState } from 'react'
import { MenuIcon } from 'lucide-react'
import { motion, useScroll, useMotionValueEvent } from 'motion/react'
import { useTranslations } from 'next-intl'
// Импортируем локализованные версии из вашей конфигурации i18n
import { Link, usePathname } from '@/i18n/routing'

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

// Храним ключи перевода вместо сырых строк
const NAVIGATION = [
  { titleKey: 'features', href: '/features' },
  { titleKey: 'story', href: '/story' },
  { titleKey: 'pricing', href: '/pricing' },
  { titleKey: 'help', href: '/help' }
]

interface HeaderProps {
  className?: string
  showAuthButton?: boolean
}

const Header = ({
  className,
  showAuthButton = true,
}: HeaderProps) => {
  const t = useTranslations('Header') // Подключаем пространство имен
  
  const profile = useUserStore((state) => state.profile)
  const isAuthenticated = Boolean(profile)
  const logoHref = isAuthenticated ? '/about' : '/'
  
  // usePathname от next-intl уже возвращает путь БЕЗ локали (например, просто '/pricing')
  const pathname = usePathname()
  const { scrollY } = useScroll()

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

  // Теперь сравнение максимально простое и надежное
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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
              <NavigationMenuItem key={item.titleKey}>
                <Link
                  href={item.href}
                  className={cn(
                    'relative px-3 py-1.5 text-base font-medium rounded-md transition-colors block',
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                >
                  {/* Переводим тайтл динамически */}
                  {t(`navigation.${item.titleKey}`)}
                  
                  {mounted && isActive(item.href) && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 2 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: 'spring',
                        stiffness: 1000,
                        damping: 20,
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
              <Button variant="outline" size="icon">
                <MenuIcon className="size-5" />
              </Button>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <MenuIcon className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {NAVIGATION.map((item) => (
                    <DropdownMenuItem key={item.titleKey} asChild>
                      <Link href={item.href} className={cn(isActive(item.href) && "bg-secondary")}>
                        {t(`navigation.${item.titleKey}`)}
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