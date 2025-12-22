"use client"

import { motion } from "framer-motion"
import type { PortfolioTemplateProps } from "@/editor/components/editor/ui/portfolio-template-shell"
import { cn } from "@/lib/utils"
import { Send } from "lucide-react"

interface ModernContactProps
  extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernContact({ theme, sectionContent }: ModernContactProps) {
  return (
    <motion.section
      id="contact"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="@container"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-20 @md:py-16 py-12 max-w-200 mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          {sectionContent.contact.subtitle && (
            <p className={cn("text-sm font-medium uppercase tracking-wider mb-2 opacity-60", theme.foreground)}>
              {sectionContent.contact.subtitle}
            </p>
          )}
          <h3
            className={cn(
              "@lg:text-5xl @md:text-4xl text-3xl font-semibold mb-4",
              theme.foreground,
              theme.fontTitle,
              theme.letterSpacing,
              theme.lineHeight,
            )}
          >
            {sectionContent.contact.title}
          </h3>

          <p className={cn("@md:text-base text-sm", theme.mutedText, theme.fontBody)}>
            {sectionContent.contact.description}
          </p>
        </motion.div>

        {/* Card wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative"
        >
          {/* Glow */}
          <div
            className={cn(
              "absolute -inset-8 rounded-3xl blur-2xl",
              theme.elementGlow
            )}
          />

          {/* Card */}
          <div
            className={cn(
              "relative rounded-3xl border p-8",
              theme.card,
              theme.cardForeground,
              theme.cardStyle,
              theme.border,
              theme.shadow
            )}
          >
            <div className="space-y-5">

              {/* NAME */}
              <div>
                <label className={cn("block text-sm font-medium mb-2", theme.foreground)}>
                  Name
                </label>
                <input
                  type="text"
                  className={cn(
                    "w-full px-5 py-3 rounded-xl transition-all duration-300 focus:outline-none",
                    theme.input,
                    theme.foreground,
                    theme.border,
                    theme.placeholder,
                    theme.caretColor,
                    theme.ringFocus
                  )}
                  placeholder="Your name"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className={cn("block text-sm font-medium mb-2", theme.foreground)}>
                  Email
                </label>
                <input
                  type="email"
                  className={cn(
                    "w-full px-5 py-3 rounded-xl transition-all duration-300 focus:outline-none",
                    theme.input,
                    theme.foreground,
                    theme.border,
                    theme.placeholder,
                    theme.caretColor,
                    theme.ringFocus
                  )}
                  placeholder={sectionContent.contact.email}
                />
              </div>

              {/* MESSAGE */}
              <div>
                <label className={cn("block text-sm font-medium mb-2", theme.foreground)}>
                  Message
                </label>
                <textarea
                  rows={5}
                  className={cn(
                    "w-full px-5 py-3 rounded-xl resize-none transition-all duration-300 focus:outline-none",
                    theme.input,
                    theme.foreground,
                    theme.border,
                    theme.placeholder,
                    theme.caretColor,
                    theme.ringFocus
                  )}
                  placeholder="Your message..."
                />
              </div>

              {/* BUTTON */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full py-4 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group",
                  theme.primary,
                  theme.primaryText,
                  theme.primaryHover,
                  theme.shadow
                )}
              >
                <span>Send Message</span>
                <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>

            {/* PHONE */}
            {sectionContent.contact.phone && (
              <p className={cn("text-center text-xs mt-6 opacity-60", theme.foreground)}>
                Or call us at{" "}
                <span className={cn("underline underline-offset-2", theme.mutedText)}>
                  {sectionContent.contact.phone}
                </span>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
