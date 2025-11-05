"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function ContactSplit({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.contactTitle || "Contact Us"
  const description = block.settings.contactDescription || "Get in touch with us"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
            <p className="mt-3 text-lg text-muted-foreground">{description}</p>
            <div className="mt-6 space-y-2 text-sm text-muted-foreground">
              <p>Email: hello@example.com</p>
              <p>Phone: +1 234 567 890</p>
              <p>Address: 123 Ocean Ave</p>
            </div>
          </div>
          <form className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
            </div>
            <Input placeholder="Subject" />
            <Textarea placeholder="Message" rows={6} />
            <Button size="lg" className="w-full">Send Message</Button>
          </form>
        </div>
      </div>
    </section>
  )
}
