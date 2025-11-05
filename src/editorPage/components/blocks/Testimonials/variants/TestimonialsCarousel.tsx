"use client"

import type { CanvasBlock } from "@/editorPage/lib/block-types"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

export function TestimonialsCarousel({ block }: { block: CanvasBlock; isSelected: boolean }) {
  const title = block.settings.testimonialsTitle || "Testimonials"
  const items = block.settings.testimonialsItems || []

  return (
    <section className={`${block.settings.background} ${block.settings.textColor} py-16 sm:py-20`}>
      <div className="container mx-auto px-6">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight mb-12">{title}</h2>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {items.map((item: any) => (
              <CarouselItem key={item.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="h-full">
                  <CardContent className="flex flex-col h-full p-6">
                    <Quote className="h-8 w-8 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground flex-grow mb-6">{item.content}</p>
                    <div className="flex items-center gap-4 mt-auto">
                      <Avatar>
                        <AvatarImage src={item.avatar || "/placeholder.svg"} alt={item.name} />
                        <AvatarFallback>{item.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-card-foreground">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-12" />
          <CarouselNext className="-right-12" />
        </Carousel>
      </div>
    </section>
  )
}
