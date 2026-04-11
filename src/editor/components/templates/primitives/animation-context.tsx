'use client'

/**
 * AnimationContext РІР‚вЂќ unified animation config for all portfolio templates.
 *
 * Usage:
 *   1. Wrap a template root with <AnimationProvider templateId="bento" disabled={disableAnimations}>
 *   2. Inside any section/primitive, call `const t = useT()` and use t(duration, delay?) for transitions.
 *
 * Everything РІР‚вЂќ disabled state, template ease, MotionConfig РІР‚вЂќ is handled here.
 * No prop-threading required.
 */

import { createContext, useContext, useMemo } from 'react'
import { MotionConfig, type Transition } from 'framer-motion'

// РІвЂќР‚РІвЂќР‚ Template IDs РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

export type TemplateId =
  | 'bento'
  | 'editorial'
  | 'showcase'
  | 'elegant'
  | 'minimal'
  | 'grid'
  | 'liquid-glass'
  | 'lumiere'
  | 'memoir'
  | 'chronicle'
  | 'magazine'
  | 'soleil'

// РІвЂќР‚РІвЂќР‚ Eases РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

/**
 * Two characteristic eases that define the feel split between templates.
 *
 * SPRING РІвЂ вЂ™ long, elegant tail. Feels weightless and refined.
 *          Used by: editorial, showcase, elegant, minimal, liquid-glass
 *
 * SNAPPY РІвЂ вЂ™ fast build, assertive punch. Feels decisive and structured.
 *          Used by: bento, grid
 */
export const EASE: { spring: [number, number, number, number]; snappy: [number, number, number, number] } = {
  spring: [0.16, 1, 0.3, 1],
  snappy: [0.22, 1, 0.36, 1],
}

// РІвЂќР‚РІвЂќР‚ Per-template config РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

/**
 * Base duration = the default section-enter transition for this template.
 * Internal card stagger delays should still be passed explicitly via t(duration, delay).
 *
 * These values are intentional:
 *   elegant  0.90s spring РІвЂ вЂ™ feels the slowest and most luxurious
 *   showcase 0.80s spring РІвЂ вЂ™ cinematic, deliberate
 *   liquid   0.85s spring РІвЂ вЂ™ fluid, slightly longer than showcase
 *   editorial 0.70s spring РІвЂ вЂ™ confident, editorial rhythm
 *   minimal  0.65s spring РІвЂ вЂ™ clean, no excess
 *   grid     0.60s snappy РІвЂ вЂ™ structured, fast
 *   bento    0.55s snappy РІвЂ вЂ™ the most energetic РІР‚вЂќ cards pop
 */
export const TEMPLATE_CONFIG: Record<
  TemplateId,
  { duration: number; ease: Transition['ease'] }
> = {
  elegant:         { duration: 0.90, ease: EASE.spring },
  'liquid-glass':  { duration: 0.85, ease: EASE.spring },
  showcase:        { duration: 0.80, ease: EASE.spring },
  editorial:       { duration: 0.70, ease: EASE.spring },
  minimal:         { duration: 0.65, ease: EASE.spring },
  grid:            { duration: 0.60, ease: EASE.snappy },
  bento:           { duration: 0.55, ease: EASE.snappy },
  lumiere:          { duration: 0.90, ease: EASE.spring },
  memoir:           { duration: 0.90, ease: EASE.spring },
  chronicle:        { duration: 0.75, ease: EASE.spring },
  magazine:         { duration: 0.80, ease: EASE.spring },
  soleil:           { duration: 0.78, ease: EASE.spring },
}

// РІвЂќР‚РІвЂќР‚ Context type РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

export interface AnimationContextValue {
  /** True when animations are disabled for this template instance. */
  disabled: boolean
  templateId: TemplateId
  /**
   * Returns a Transition using the template's characteristic ease.
   * When disabled, always returns { duration: 0, delay: 0 } (instant).
   *
   * @param duration  explicit duration in seconds
   * @param delay     optional delay (skipped when 0 or omitted)
   * @param ease      override ease; defaults to the template's characteristic ease
   */
  t: (duration: number, delay?: number, ease?: Transition['ease']) => Transition
}

// РІвЂќР‚РІвЂќР‚ Default context (safe fallback when used outside a provider) РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

const defaultT: AnimationContextValue['t'] = (duration, delay = 0, ease) => ({
  duration,
  ...(delay > 0 ? { delay } : {}),
  ease: ease ?? EASE.spring,
})

const AnimationContext = createContext<AnimationContextValue>({
  disabled: false,
  templateId: 'editorial',
  t: defaultT,
})

// РІвЂќР‚РІвЂќР‚ Provider РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

interface AnimationProviderProps {
  children: React.ReactNode
  templateId: TemplateId
  /** Set to true in editor/preview contexts to disable all animations instantly. */
  disabled?: boolean
}

export function AnimationProvider({
  children,
  templateId,
  disabled = false,
}: AnimationProviderProps) {
  const { ease: baseEase } = TEMPLATE_CONFIG[templateId] ?? TEMPLATE_CONFIG['editorial']

  const t = useMemo<AnimationContextValue['t']>(
    () =>
      (duration, delay = 0, ease) =>
        disabled
          ? { duration: 0, delay: 0 }
          : { duration, ...(delay > 0 ? { delay } : {}), ease: ease ?? baseEase },
    [disabled, baseEase],
  )

  const value = useMemo<AnimationContextValue>(
    () => ({ disabled, templateId, t }),
    [disabled, templateId, t],
  )

  return (
    <AnimationContext.Provider value={value}>
      {/*
        MotionConfig at the provider level:
        РІР‚Сћ reducedMotion="always" when disabled РІвЂ вЂ™ all framer-motion transitions are instant globally
        РІР‚Сћ reducedMotion="user" when enabled РІвЂ вЂ™ respects OS accessibility preference
      */}
      <MotionConfig reducedMotion={disabled ? 'always' : 'user'}>
        {children}
      </MotionConfig>
    </AnimationContext.Provider>
  )
}

// РІвЂќР‚РІвЂќР‚ Hooks РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚РІвЂќР‚

/** Full context. Use when you need both disabled flag and t(). */
export const useAnimationContext = (): AnimationContextValue =>
  useContext(AnimationContext)

/** Just the t() transition helper. Preferred for direct section usage. */
export const useT = (): AnimationContextValue['t'] =>
  useContext(AnimationContext).t

/** True when animations are globally disabled for this template. */
export const useDisabled = (): boolean =>
  useContext(AnimationContext).disabled

/**
 * Returns a ready-to-use Transition at the template's base duration.
 * Ideal for FadeIn, SectionWrapper and similar primitives that don't
 * need to specify their own duration.
 */
export function useBaseTransition(
  delay = 0,
  ease?: Transition['ease'],
): Transition {
  const { templateId, t } = useContext(AnimationContext)
  return t(TEMPLATE_CONFIG[templateId].duration, delay, ease)
}
