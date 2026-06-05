"use client"

import { useState, useEffect } from "react"
import { CTAButton } from "@/components/shared/cta-button"
import { Button } from "@/components/ui/button"
import { Sparkles, Play } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"

// Оставляем только строгие ключи для перевода
const ROTATING_WORD_KEYS = [
  "legacy",
  "freedom",
  "emotions",
  "moment",
  "story",
  "stillness"
]

export function HeroSection() {
  const t = useTranslations("Hero")
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % ROTATING_WORD_KEYS.length)
        setIsAnimating(false)
      }, 400)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* Left: Text Content */}
          <div className="space-y-8 text-left">
            <div className="space-y-4">
              <h1 className="font-serif text-5xl leading-tight tracking-tight md:text-6xl lg:text-7xl text-balance">
                {t("titlePrefix")} <br />
                <span className="relative inline-block min-w-[300px]">
                  <span
                    className={`inline-block text-primary italic transition-all duration-400 ${
                      isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                    }`}
                  >
                    {/* Переводим ключ динамически на лету */}
                    {t(`rotatingWords.${ROTATING_WORD_KEYS[currentWordIndex]}`)}
                  </span>
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                {t("description")}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <CTAButton size="lg" className="gap-2 rounded-full px-8 bg-primary text-primary-foreground hover:opacity-90">
                <Sparkles className="h-5 w-5" />
                {t("ctaPrimary")}
              </CTAButton>
              <Button variant="ghost" size="lg" className="gap-2 rounded-full px-8 border border-input">
                <Play className="h-5 w-5" />
                {t("ctaSecondary")}
              </Button>
            </div>
          </div>

          {/* Right: Visual Preview (Single Image) */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-2xl transition-transform hover:rotate-[-1deg]">
                <Image
                  src="/placeholder.svg?height=800&width=640"
                  alt={t("imageAlt")}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 640px"
                  className="object-cover"
                />
              </div>

              {/* Мягкие декоративные градиенты */}
              <div className="absolute -right-16 top-1/4 -z-10 h-40 w-40 rounded-full bg-primary/10 blur-[100px]" />
              <div className="absolute -left-16 bottom-1/4 -z-10 h-40 w-40 rounded-full bg-accent/10 blur-[100px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}