"use client"

import { useState, useEffect } from "react"
import { CTAButton } from "@/components/shared/cta-button"
import { Button } from "@/components/ui/button"
import { Sparkles, Play } from "lucide-react"
import Image from "next/image"
import { useTranslations } from "next-intl"
import { motion } from "framer-motion"

// 1. ИМПОРТИРУЕМ КАРТИНКИ КАК МОДУЛИ
// Настрой пути в зависимости от того, где именно у тебя лежат файлы
import minimalistImg from "@/components/assets/landing-photo-1.webp"
import vibrantImg from "@/components/assets/landing-photo-2.webp"

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
  
  const [sliderPosition, setSliderPosition] = useState(50)

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

          {/* Right: Visual Preview (Interactive Comparison) */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Основной интерактивный контейнер */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-2xl select-none group transition-transform ">
                
                {/* 1. Нижний слой — Яркий/Сложный дизайн (Vibrant) */}
                <div className="absolute inset-0 w-full h-full">
                  <Image
                    src={vibrantImg} // Передаем импортированную переменную
                    alt="Vibrant editor style preview"
                    fill
                    priority
                    placeholder="blur" // Next.js автоматически сделает красивый размытый фон пока картинка грузится!
                    className="object-cover pointer-events-none"
                  />
                </div>

                {/* 2. Верхний слой — Минималистичный дизайн (Minimalist) */}
                <div
                  className="absolute inset-0 w-full h-full overflow-hidden will-change-transform"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <div className="absolute inset-0 w-full h-full aspect-[4/5]">
                    <Image
                      src={minimalistImg} // Передаем импортированную переменную
                      alt="Minimalist editor style preview"
                      fill
                      priority
                      placeholder="blur" // Размытие при загрузке
                      className="object-cover pointer-events-none"
                    />
                  </div>
                </div>

                {/* 3. Линия разделения и кастомный хендл ползунка */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] bg-white pointer-events-none z-10 shadow-[0_0_10px_rgba(0,0,0,0.3)]"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center border border-neutral-200 text-neutral-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2.5}
                      stroke="currentColor"
                      className="w-4 h-4 rotate-90"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                  </motion.div>
                </div>

                {/* 4. Невидимый range-инпут */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={(e) => setSliderPosition(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  aria-label="Design transition slider"
                />
              </div>
            
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}