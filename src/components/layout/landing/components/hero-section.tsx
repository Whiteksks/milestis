"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, Play } from "lucide-react"

const rotatingWords = ["important", "memories", "moments", "love", "family", "stories"]

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
          <div className="space-y-8">
            <h1 className="font-serif text-4xl leading-tight tracking-tight md:text-5xl lg:text-6xl text-balance">
              Milestis is{" "}
              <span className="relative inline-block min-w-50">
                <span
                  className={`inline-block text-primary transition-all duration-400 ${
                    isAnimating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                  }`}
                >
                  {rotatingWords[currentWordIndex]}
                </span>
              </span>
            </h1>

            <p className="max-w-lg text-lg leading-relaxed text-muted-foreground md:text-xl">
              Create interactive memory books with photos, stories and music — made for families and loved ones.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" className="gap-2 rounded-full px-8">
                <BookOpen className="h-5 w-5" />
                Create a memory book
              </Button>
              <Button variant="outline" size="lg" className="gap-2 rounded-full px-8 bg-transparent">
                <Play className="h-5 w-5" />
                View example
              </Button>
            </div>
          </div>

          {/* Right: Visual Preview */}
          <div className="relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Memory book preview cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-4/5 overflow-hidden rounded-2xl bg-card shadow-lg">
                    <img
                      src="/placeholder.svg?height=400&width=320"
                      alt="Wedding memory"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-square overflow-hidden rounded-2xl bg-card shadow-lg">
                    <img
                      src="/placeholder.svg?height=280&width=280"
                      alt="Birthday celebration"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="mt-8 space-y-4">
                  <div className="aspect-square overflow-hidden rounded-2xl bg-card shadow-lg">
                    <img
                      src="/placeholder.svg?height=280&width=280"
                      alt="Family portrait"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="aspect-4/5 overflow-hidden rounded-2xl bg-card shadow-lg">
                    <img
                      src="/placeholder.svg?height=400&width=320"
                      alt="Love story"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Floating decorative elements */}
              <div className="absolute -right-4 top-1/4 h-16 w-16 rounded-full bg-accent/50 blur-xl" />
              <div className="absolute -left-8 bottom-1/4 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
