'use client'

import { useCallback, useEffect, useId, useRef, useState, type MouseEvent, type RefCallback } from 'react'

export type HeaderBehavior = 'static' | 'sticky' | 'reveal'

export interface HeaderLinkClickHandler {
  (event: MouseEvent<HTMLAnchorElement>, href: string): void
}

interface HeaderLinkOptions {
  closeMenu?: boolean
}

function resolveAnchorTarget(id: string, root: HTMLElement | null): HTMLElement | null {
  const escapedId = typeof CSS !== 'undefined' && typeof CSS.escape === 'function'
    ? CSS.escape(id)
    : id

  if (root) {
    return root.querySelector<HTMLElement>(`#${escapedId}`) ?? document.getElementById(id)
  }

  return document.getElementById(id)
}

export interface HeaderMenuState {
  id: string
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export interface HeaderControllerState {
  scrolled: boolean
  visible: boolean
  overHero: boolean
  menu: HeaderMenuState
  setRootElement: RefCallback<HTMLElement>
  getLinkProps: (
    href: string,
    onAnchorClick?: HeaderLinkClickHandler,
    options?: HeaderLinkOptions,
  ) => {
    href: string
    onClick: (event: MouseEvent<HTMLAnchorElement>) => void
  }
}

export interface UseHeaderControllerOptions {
  behavior?: HeaderBehavior
  watchHero?: boolean
  stickyRootMargin?: string
  heroRootMargin?: string
  revealOffset?: number
  revealDelta?: number
}

function resolveScrollRoot(): HTMLElement | null {
  return document.querySelector<HTMLElement>('[data-scroll-root]') ?? null
}

function resolveHero(scrollRoot: HTMLElement | null): HTMLElement | null {
  if (scrollRoot) {
    return scrollRoot.querySelector<HTMLElement>('#hero') ?? document.getElementById('hero')
  }

  return document.getElementById('hero')
}

export function useHeaderController({
  behavior = 'static',
  watchHero = false,
  stickyRootMargin = '-56px 0px 0px 0px',
  heroRootMargin = '-64px 0px 0px 0px',
  revealOffset = 10,
  revealDelta = 4,
}: UseHeaderControllerOptions = {}): HeaderControllerState {
  const rootRef = useRef<HTMLElement | null>(null)
  const menuId = useId()
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const [overHero, setOverHero] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const setRootElement = useCallback<RefCallback<HTMLElement>>((node) => {
    rootRef.current = node
  }, [])

  useEffect(() => {
    if (behavior === 'static') {
      setScrolled(false)
      setVisible(true)
      return
    }

    const scrollRoot = resolveScrollRoot()

    if (behavior === 'sticky') {
      const hero = resolveHero(scrollRoot)
      if (!hero) {
        setScrolled(false)
        return
      }

      const observer = new IntersectionObserver(
        ([entry]) => setScrolled(!entry.isIntersecting),
        { threshold: 0, rootMargin: stickyRootMargin, root: scrollRoot },
      )

      observer.observe(hero)
      return () => observer.disconnect()
    }

    const getScrollY = () => (scrollRoot ? scrollRoot.scrollTop : window.scrollY)
    let lastY = getScrollY()

    const handleScroll = () => {
      const currentY = getScrollY()

      setScrolled(currentY > revealOffset)

      if (currentY < revealOffset) {
        setVisible(true)
      } else if (currentY < lastY) {
        setVisible(true)
      } else if (currentY > lastY + revealDelta) {
        setVisible(false)
      }

      lastY = currentY
    }

    handleScroll()

    const target: HTMLElement | Window = scrollRoot ?? window
    target.addEventListener('scroll', handleScroll, { passive: true })

    return () => target.removeEventListener('scroll', handleScroll)
  }, [behavior, heroRootMargin, revealDelta, revealOffset, stickyRootMargin, watchHero])

  useEffect(() => {
    if (!watchHero) {
      setOverHero(false)
      return
    }

    const scrollRoot = resolveScrollRoot()
    const hero = resolveHero(scrollRoot)
    if (!hero) {
      setOverHero(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => setOverHero(entry.isIntersecting),
      { threshold: 0, rootMargin: heroRootMargin, root: scrollRoot },
    )

    observer.observe(hero)
    return () => observer.disconnect()
  }, [heroRootMargin, watchHero])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target || !rootRef.current?.contains(target)) {
        setIsMenuOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isMenuOpen])

  const menu: HeaderMenuState = {
    id: menuId,
    isOpen: isMenuOpen,
    open: () => setIsMenuOpen(true),
    close: () => setIsMenuOpen(false),
    toggle: () => setIsMenuOpen((current) => !current),
  }

  return {
    scrolled,
    visible,
    overHero,
    menu,
    setRootElement,
    getLinkProps: (href, onAnchorClick, options) => ({
      href,
      onClick: (event) => {
        if (href.startsWith('#')) {
          event.preventDefault()

          const scrollRoot = rootRef.current?.closest<HTMLElement>('[data-scroll-root]') ?? resolveScrollRoot()
          const target = resolveAnchorTarget(href.slice(1), scrollRoot)

          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        } else {
          onAnchorClick?.(event, href)
        }

        if (options?.closeMenu) {
          setIsMenuOpen(false)
        }
      },
    }),
  }
}