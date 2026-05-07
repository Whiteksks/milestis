'use client'

import { useEffect, useState, type ButtonHTMLAttributes, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react'
import { AnimatePresence, motion, type Transition } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  useHeaderController,
  type HeaderBehavior,
  type HeaderControllerState,
  type HeaderLinkClickHandler,
  type HeaderMenuState,
} from './use-header-controller'

export type HeaderPlacement = 'fixed' | 'sticky' | 'floating'
export type HeaderWidth = 'full' | 'compact'

function resolveScrollRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-scroll-root]') ?? null
}

function measureScrollbarWidth(scrollRoot: HTMLElement | null): number {
  if (scrollRoot) {
    return Math.max(0, scrollRoot.offsetWidth - scrollRoot.clientWidth)
  }

  return Math.max(0, window.innerWidth - document.documentElement.clientWidth)
}

interface HeaderShellProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  placement?: HeaderPlacement
  behavior?: HeaderBehavior
  watchHero?: boolean
  stickyRootMargin?: string
  heroRootMargin?: string
  revealOffset?: number
  revealDelta?: number
  zIndex?: string
  children: (props: HeaderControllerState) => ReactNode
}

interface HeaderContentProps extends HTMLAttributes<HTMLDivElement> {
  width?: HeaderWidth
}

interface HeaderMenuToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> {
  menu: HeaderMenuState
  iconSize?: number
}

interface HeaderMobileDropdownProps {
  menu: HeaderMenuState
  transition: Transition
  children: ReactNode
  className?: string
  scale?: number
  yOffset?: number
}

interface HeaderMobileDrawerProps {
  menu: HeaderMenuState
  children: ReactNode
  className?: string
}

interface HeaderMobilePanelProps {
  menu: HeaderMenuState
  transition: Transition
  children: ReactNode
  className?: string
  style?: CSSProperties
  scale?: number
  yOffset?: number
}

export type { HeaderBehavior, HeaderControllerState, HeaderLinkClickHandler }

export function HeaderShell({
  placement = 'fixed',
  behavior = 'static',
  watchHero = false,
  stickyRootMargin,
  heroRootMargin,
  revealOffset,
  revealDelta,
  zIndex = 'z-50',
  className,
  children,
  ...rest
}: HeaderShellProps) {
  const controller = useHeaderController({
    behavior,
    watchHero,
    stickyRootMargin,
    heroRootMargin,
    revealOffset,
    revealDelta,
  })
  const [scrollbarWidth, setScrollbarWidth] = useState(0)

  useEffect(() => {
    if (placement === 'sticky') {
      setScrollbarWidth(0)
      return
    }

    const scrollRoot = resolveScrollRoot()

    const measure = () => {
      const width = measureScrollbarWidth(scrollRoot)
      setScrollbarWidth((current) => (current === width ? current : width))
    }

    measure()

    const resizeObserver = scrollRoot ? new ResizeObserver(measure) : null
    if (scrollRoot && resizeObserver) {
      resizeObserver.observe(scrollRoot)
    }

    window.addEventListener('resize', measure)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [placement])

  const placementClass = {
    fixed: `fixed top-0 left-0 ${zIndex}`,
    sticky: `sticky top-0 ${zIndex === 'z-50' ? 'z-40' : zIndex}`,
    floating: `fixed top-4 left-1/2 -translate-x-1/2 ${zIndex}`,
  }[placement]

  const placementStyle: CSSProperties =
    placement === 'fixed'
      ? { right: `max(var(--canvas-scrollbar-width, 0px), ${scrollbarWidth}px)` }
      : placement === 'floating'
      ? { width: `calc(100% - 2rem - max(var(--canvas-scrollbar-width, 0px), ${scrollbarWidth}px))` }
      : {}

  const revealStyle: CSSProperties =
    behavior === 'reveal'
      ? {
          transform: controller.visible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }
      : {}

  return (
    <header
      id="header"
      data-section-id="header"
      ref={controller.rootRef}
      {...rest}
      className={cn('@container', placementClass, className)}
      style={{ ...placementStyle, ...revealStyle, ...(rest.style ?? {}) }}
    >
      {children(controller)}
    </header>
  )
}

export function HeaderContent({ width = 'compact', className, ...rest }: HeaderContentProps) {
  return (
    <div
      {...rest}
      className={cn(width === 'compact' ? 'w-full max-w-7xl mx-auto' : 'w-full', className)}
    />
  )
}

export function HeaderMenuToggle({
  menu,
  className,
  iconSize = 16,
  type = 'button',
  ...rest
}: HeaderMenuToggleProps) {
  return (
    <button
      {...rest}
      type={type}
      aria-controls={menu.id}
      aria-expanded={menu.isOpen}
      aria-label={menu.isOpen ? 'Close menu' : 'Open menu'}
      onClick={menu.toggle}
      className={cn('p-2 transition-opacity', className)}
    >
      {menu.isOpen ? <X size={iconSize} /> : <Menu size={iconSize} />}
    </button>
  )
}

export function HeaderMobileDropdown({
  menu,
  transition,
  children,
  className,
  scale = 0.96,
  yOffset = -4,
}: HeaderMobileDropdownProps) {
  return (
    <AnimatePresence>
      {menu.isOpen && (
        <motion.div
          id={menu.id}
          initial={{ opacity: 0, scale, y: yOffset }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale, y: yOffset }}
          transition={transition}
          style={{ transformOrigin: 'top right' }}
          className={cn('absolute right-0 top-full mt-2 z-50', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function HeaderMobileDrawer({ menu, children, className }: HeaderMobileDrawerProps) {
  return (
    <AnimatePresence>
      {menu.isOpen && (
        <motion.div
          id={menu.id}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={cn('@md:hidden overflow-hidden', className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function HeaderMobilePanel({
  menu,
  transition,
  children,
  className,
  style,
  scale = 0.97,
  yOffset = -8,
}: HeaderMobilePanelProps) {
  return (
    <AnimatePresence>
      {menu.isOpen && (
        <motion.div
          id={menu.id}
          initial={{ opacity: 0, y: yOffset, scale }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: yOffset, scale }}
          transition={transition}
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}