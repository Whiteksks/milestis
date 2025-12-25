"use client"

import { motion } from "framer-motion"

interface IntroMinimalProps {
  title: string
  quote: string
  dedication: string
  imageUrl?: string
}

export function IntroMinimal({ title, quote, dedication }: IntroMinimalProps) {
  return (
    <section className="min-h-screen bg-neutral-950 flex items-center justify-center py-20 px-6">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
        className="max-w-2xl text-center space-y-16"
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-5xl md:text-6xl lg:text-7xl font-light text-white tracking-tight"
        >
          {title}
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-8"
        >
          <p className="text-xl md:text-2xl text-neutral-400 font-light leading-relaxed">{quote}</p>

          <div className="flex items-center justify-center gap-6">
            <div className="h-px w-20 bg-neutral-700" />
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">{dedication}</p>
            <div className="h-px w-20 bg-neutral-700" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
