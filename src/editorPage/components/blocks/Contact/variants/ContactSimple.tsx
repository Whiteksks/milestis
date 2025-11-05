"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function ContactSimple({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.contactTitle || "Contact Us"
  const description = block.settings.contactDescription || "Get in touch with us"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto max-w-2xl px-6">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
          <p className="mt-3 text-lg text-muted-foreground">{description}</p>
        </div>
        <form className="mt-10 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input placeholder="Name" />
            <Input type="email" placeholder="Email" />
          </div>
          <Input placeholder="Subject" />
          <Textarea placeholder="Message" rows={6} />
          <Button size="lg" className="w-full">Send Message</Button>
        </form>
      </div>
    </section>
  )
}
