"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

interface ContactBlockProps {
  block: CanvasBlock
  isSelected: boolean
}

export function ContactBlock({ block, isSelected }: ContactBlockProps) {
  const title = block.settings.contactTitle || "Contact Us"
  const description = block.settings.contactDescription || "Get in touch with us"

  return (
    <div
      className={`relative ${block.settings.background} ${block.settings.textColor} ${
        block.settings.padding === "small" ? "py-12" : block.settings.padding === "large" ? "py-24" : "py-16"
      }`}
    >
      <div className="container mx-auto max-w-2xl px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </div>
        <form className="mt-12 space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <Input placeholder="Name" />
            <Input type="email" placeholder="Email" />
          </div>
          <Input placeholder="Subject" />
          <Textarea placeholder="Message" rows={6} />
          <Button type="submit" size="lg" className="w-full">
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}
