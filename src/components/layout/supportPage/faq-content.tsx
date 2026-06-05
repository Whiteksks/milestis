"use client"

import { useTranslations } from "next-intl"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqSections = [
  { id: "general" },
  { id: "privacySharing" },
  { id: "editingContent" },
  { id: "pricingAccess" },
]

export function FaqContent() {
  const t = useTranslations("FaqPage")

  return (
    <section className="px-6 pb-16 md:pb-24">
      <div className="container mx-auto max-w-3xl">
        <div className="space-y-8">
          {faqSections.map((section) => {
            // Массив элементов для конкретной секции из JSON
            // next-intl позволяет забирать массивы объектов через t.raw()
            const items = t.raw(`sections.${section.id}.items`) as Array<{ question: string; answer: string }>

            return (
              <div key={section.id}>
                <h2 className="mb-2 font-serif text-2xl font-medium text-foreground">
                  {t(`sections.${section.id}.title`)}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {items.map((item, index) => (
                    <AccordionItem 
                      key={index} 
                      value={`${section.id}-${index}`} 
                      className="border-border/50"
                    >
                      <AccordionTrigger className="text-left text-md text-foreground hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-md">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}