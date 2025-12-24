"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqSections = [
  {
    title: "General",
    items: [
      {
        question: "What is Milestis?",
        answer:
          "Milestis helps you create interactive memory books using photos, stories, and music — made for family and loved ones.",
      },
      {
        question: "Who is Milestis for?",
        answer: "It's for families, couples, and anyone who wants to keep important moments in one place.",
      },
    ],
  },
  {
    title: "Privacy & sharing",
    items: [
      {
        question: "Is my memory book private?",
        answer: "Yes. You control who can view it. You can keep it private or share it using a personal link.",
      },
      {
        question: "Can my family view without an account?",
        answer: "Yes. Anyone with the link can view the memory book without signing up.",
      },
    ],
  },
  {
    title: "Editing & content",
    items: [
      {
        question: "Can I edit my book after publishing?",
        answer: "Yes. You can update your memory book at any time.",
      },
      {
        question: "Can I delete a memory book?",
        answer: "Yes. You can delete your book whenever you want.",
      },
    ],
  },
  {
    title: "Pricing & access",
    items: [
      {
        question: "Is Milestis free?",
        answer:
          "You can create your first memory book for free. Additional features are available if you choose to upgrade.",
      },
      {
        question: "What happens if I stop paying?",
        answer: "Your memory books remain safe. You can still access them, but some advanced features may be limited.",
      },
    ],
  },
]

export function FaqContent() {
  return (
    <section className="px-6 pb-16 md:pb-24">
      <div className="container mx-auto max-w-3xl">
        <div className="space-y-10">
          {faqSections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-4 font-serif text-lg font-medium text-foreground">{section.title}</h2>
              <Accordion type="single" collapsible className="w-full">
                {section.items.map((item, index) => (
                  <AccordionItem key={index} value={`${section.title}-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-left text-foreground hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
