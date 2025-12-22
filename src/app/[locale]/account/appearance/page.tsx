"use client"

import { useState } from "react"
import { Check, Sun, Moon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const themes = [
  {
    id: "light",
    name: "Light",
    description: "Warm and cozy",
    icon: Sun,
    colors: {
      bg: "bg-amber-50",
      accent: "bg-rose-300",
      card: "bg-white",
      text: "bg-stone-400",
    },
  },
  {
    id: "cozy",
    name: "Cozy",
    description: "Soft and muted",
    icon: Sun,
    colors: {
      bg: "bg-orange-100",
      accent: "bg-amber-400",
      card: "bg-orange-50",
      text: "bg-amber-700",
    },
  },
  {
    id: "dark",
    name: "Dark",
    description: "Easy on the eyes",
    icon: Moon,
    colors: {
      bg: "bg-stone-900",
      accent: "bg-rose-400",
      card: "bg-stone-800",
      text: "bg-stone-500",
    },
  },
]

const densityOptions = [
  { id: "comfortable", name: "Comfortable", description: "More breathing room" },
  { id: "compact", name: "Compact", description: "Fits more content" },
]

const roundnessOptions = [
  { id: "soft", name: "Soft", radius: "rounded-lg" },
  { id: "extra-soft", name: "Extra Soft", radius: "rounded-2xl" },
]

export default function AppearanceSettings() {
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [selectedDensity, setSelectedDensity] = useState("comfortable")
  const [selectedRoundness, setSelectedRoundness] = useState("extra-soft")

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Color Theme</CardTitle>
          <CardDescription>Choose how Milestis looks for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            {themes.map((theme) => {
              const isActive = selectedTheme === theme.id
              const Icon = theme.icon
              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  className={`group relative overflow-hidden rounded-2xl border-2 p-1 transition-all duration-300 hover:scale-[1.02] ${
                    isActive ? "border-primary shadow-lg shadow-primary/20" : "border-border hover:border-primary/40"
                  }`}
                >
                  {/* Mini UI Preview */}
                  <div className={`${theme.colors.bg} relative aspect-4/3 overflow-hidden rounded-xl p-3`}>
                    {/* Mini sidebar */}
                    <div className={`absolute left-2 top-2 bottom-2 w-8 ${theme.colors.card} rounded-lg opacity-90`}>
                      <div className={`mx-1.5 mt-2 h-1.5 w-5 ${theme.colors.text} rounded-full opacity-60`} />
                      <div className={`mx-1.5 mt-1.5 h-1.5 w-4 ${theme.colors.text} rounded-full opacity-40`} />
                      <div className={`mx-1.5 mt-1.5 h-1.5 w-5 ${theme.colors.text} rounded-full opacity-40`} />
                    </div>
                    {/* Mini header */}
                    <div className={`absolute left-12 right-2 top-2 h-5 ${theme.colors.card} rounded-lg opacity-90`} />
                    {/* Mini cards */}
                    <div className={`absolute left-12 right-2 top-9 h-8 ${theme.colors.card} rounded-lg opacity-90`}>
                      <div className={`absolute right-2 top-2 h-4 w-10 ${theme.colors.accent} rounded-full`} />
                    </div>
                    <div
                      className={`absolute left-12 right-2 bottom-2 h-6 ${theme.colors.card} rounded-lg opacity-90`}
                    />
                  </div>

                  {/* Label */}
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Icon className="size-4 text-muted-foreground" />
                      <div className="text-left">
                        <p className="text-sm font-medium">{theme.name}</p>
                        <p className="text-xs text-muted-foreground">{theme.description}</p>
                      </div>
                    </div>
                    {isActive && (
                      <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                        <Check className="size-3 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* UI Density */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>UI Density</CardTitle>
          <CardDescription>Adjust spacing and padding throughout the app</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {densityOptions.map((option) => {
              const isActive = selectedDensity === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedDensity(option.id)}
                  className={`flex items-center justify-between rounded-xl border-2 p-4 transition-all duration-200 ${
                    isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  <div className="text-left">
                    <p className="font-medium">{option.name}</p>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                  </div>
                  {isActive && (
                    <div className="flex size-5 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Roundness */}
      <Card className="rounded-2xl border-border/40 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Corner Roundness</CardTitle>
          <CardDescription>Choose how rounded you want UI elements to be</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2">
            {roundnessOptions.map((option) => {
              const isActive = selectedRoundness === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedRoundness(option.id)}
                  className={`flex items-center gap-4 rounded-xl border-2 p-4 transition-all duration-200 ${
                    isActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40 hover:bg-muted/30"
                  }`}
                >
                  {/* Preview shape */}
                  <div className={`size-12 bg-primary/20 ${option.radius}`} />
                  <div className="text-left">
                    <p className="font-medium">{option.name}</p>
                  </div>
                  {isActive && (
                    <div className="ml-auto flex size-5 items-center justify-center rounded-full bg-primary">
                      <Check className="size-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
