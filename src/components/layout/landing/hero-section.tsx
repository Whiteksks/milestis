"use client"

import { useState, useEffect } from "react"
import { CTAButton } from "@/components/shared/cta-button"
import { Button } from "@/components/ui/button"
import { Sparkles, Play } from "lucide-react"
import Image from "next/image"

// Оставляем эмоциональные, абстрактные слова
const rotatingWords = [
  "legacy",
  "freedom",
  "emotions",
  "the moment",
  "your story",
  "stillness"
]

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length)
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
                Milestone is <br />
                <span className="relative inline-block min-w-[300px]">
                  <span
                    className={`inline-block text-primary italic transition-all duration-400 ${
                      isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                    }`}
                  >
                    {rotatingWords[currentWordIndex]}
                  </span>
                </span>
              </h1>

              <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
                Milestis transforms your life’s turning points into premium interactive experiences. 
                Keep the depth of your memories without the complexity of design.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              {/* Заменили BookOpen на Sparkles — символ магии, создания, чего-то нового */}
              <CTAButton size="lg" className="gap-2 rounded-full px-8 bg-primary text-primary-foreground hover:opacity-90">
                <Sparkles className="h-5 w-5" />
                Capture a milestone
              </CTAButton>
              {/* Заменили Play на Eye — символ просмотра, знакомства с опытом */}
              <Button variant="ghost" size="lg" className="gap-2 rounded-full px-8 border border-input">
                <Play className="h-5 w-5" />
                See the experience
              </Button>
            </div>
          </div>

          {/* Right: Visual Preview (Single Image) */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Одна большая карточка вместо сетки */}
              <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-muted shadow-2xl transition-transform hover:rotate-[-1deg]">
                <Image
                  src="/placeholder.svg?height=800&width=640"
                  alt="A significant life milestone captured beautifully"
                  fill
                  priority // Важно для SEO и производительности Hero
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