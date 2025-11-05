"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { CanvasBlock } from "@/editorPage/lib/block-types"

export function ContactSidebar({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.contactTitle || "Contact Us"
  const description = block.settings.contactDescription || "Get in touch with us"

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <div className="mx-auto max-w-5xl grid gap-8 lg:grid-cols-[1fr_380px]">
          <form className="space-y-4 order-2 lg:order-1">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Name" />
              <Input type="email" placeholder="Email" />
            </div>
            <Input placeholder="Subject" />
            <Textarea placeholder="Message" rows={6} />
            <Button size="lg" className="w-full">Send Message</Button>
          </form>
          <aside className="order-1 lg:order-2 rounded-2xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Our Office</h3>
            <div className="mt-3 aspect-[4/3] w-full rounded-xl bg-muted/30" />
            <div className="mt-4 space-y-1 text-sm text-muted-foreground">
              <p>123 Ocean Ave</p>
              <p>+1 234 567 890</p>
              <p>hello@example.com</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
