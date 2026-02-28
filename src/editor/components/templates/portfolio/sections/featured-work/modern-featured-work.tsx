"use client"

import { motion } from "framer-motion"
import { useRef } from "react"
import type { PortfolioTemplateProps } from "@/editor/components/editor/layout/portfolio-template-shell"
import { cn } from "@/lib/utils"
import { getAspectRatioClass } from "@/editor/lib/aspect-ratios"
import { getFrameStyle } from "@/editor/lib/frame-styles"
import Image, { type ImageLoader } from 'next/image'

const passthroughLoader: ImageLoader = ({ src }) => src

interface ModernFeaturedWorkProps
  extends Pick<PortfolioTemplateProps, "theme" | "sectionContent"> {}

export function ModernFeaturedWork({ theme, sectionContent }: ModernFeaturedWorkProps) {
  const featuredWorkRef = useRef<HTMLDivElement>(null)
  
  // Убраны useScroll, useTransform и parallaxTransforms

  // Общие параметры viewport для whileInView
  const viewportOptions = { once: true, margin: "-100px 0px" } // Изменен margin для более раннего срабатывания

  return (
    <motion.section
      id="work"
      ref={featuredWorkRef}
      // Оставил анимацию секции, чтобы соответствовать оригинальной структуре, но убрал 'y' для корневого элемента
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={viewportOptions}
      transition={{ duration: 0.8 }}
      className="@container relative"
    >
      <div className="@lg:px-12 @md:px-8 px-4 @lg:py-24 @md:py-18 py-16 max-w-350 mx-auto">
        
        {/* Заголовок секции */}
        {sectionContent.featuredWork.subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOptions}
            transition={{ duration: 0.7 }}
            className={cn("text-sm font-medium uppercase tracking-wider text-center mb-2 opacity-60", theme.foreground)}
          >
            {sectionContent.featuredWork.subtitle}
          </motion.p>
        )}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOptions}
          transition={{ duration: 0.7 }}
          className={cn(
            // Обновленный стиль заголовка: крупнее и жирнее
            "@lg:text-6xl @md:text-5xl text-4xl font-extrabold text-center mb-6 tracking-tight",
            theme.foreground,
          )}
        >
          {sectionContent.featuredWork.title}
        </motion.h3>
        
        {/* Подзаголовок/Описание секции */}
        {sectionContent.featuredWork.projects &&
          sectionContent.featuredWork.projects.length > 0 && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOptions}
              transition={{ duration: 0.7, delay: 0.1 }}
              className={cn(
                // Обновленный стиль подзаголовка: темнее и лучше читается
                "@md:text-lg text-base text-center max-w-3xl mx-auto mb-16",
                theme.mutedText,
              )}
            >
              Выделенные проекты, в которых сочетаются мастерство, повествование и продуманные детали.
            </motion.p>
          )}

        {/* Проекты */}
        <div className="space-y-20"> {/* Увеличенный интервал между проектами */}
          {(sectionContent.featuredWork.projects ?? []).map((project, i) => {
            // Убран const yTransform = parallaxTransforms[i % parallaxTransforms.length]
            const isEven = i % 2 === 0

            return (
              <motion.div
                key={i}
                // Убран style={{ y: yTransform }}
                // Новая, более плавная и заметная анимация появления
                initial={{ opacity: 0, y: 100, scale: 0.95 }} 
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={viewportOptions}
                transition={{ 
                  duration: 0.9, 
                  delay: i * 0.1, 
                  ease: [0.22, 1, 0.36, 1] 
                }}
                className={cn(
                  // Упрощенный и более контрастный контейнер — используем цвета темы и glass effect
                  "grid @lg:grid-cols-[2fr,3fr] grid-cols-1 gap-12 items-center rounded-3xl px-8 py-8 @lg:px-12 @lg:py-12 shadow-2xl",
                  "backdrop-blur-md",
                  // theme.background должен содержать базовый bg класс, используем дополнительно opacity
                  theme.background,
                  "bg-opacity-50",
                  // Граница темы (заменяет hardcoded border-white/10)
                  theme.border,
                  // Небольшой hover-акцент
                  "transition-colors duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.28)]",
                )}
              >
                
                {/* Изображение */}
                <div className={cn("relative group")}>
                  {/* Эффект свечения */}
                  <div
                    className={cn(
                      // Glow / accent — уменьшенный эффект: меньше blur, ниже max-opacity
                      "absolute -inset-4 rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-700",
                      theme.muted, // Использует цвет темы
                    )}
                  />
                  
                  <div
                    className={cn(
                      // Image card: glass effect + theme border + frame style
                      "relative overflow-hidden rounded-2xl border shadow-2xl",
                      "backdrop-blur-md",
                      theme.background,
                      "bg-opacity-40",
                      getFrameStyle(project.frameStyle || "soft"),
                      theme.border,
                      "group-hover:brightness-105 transition-all duration-500",
                      getAspectRatioClass(project.aspectRatio),
                    )}
                  >
                    <Image
                      loader={passthroughLoader}
                      unoptimized
                      src={project.image || "/placeholder.svg?height=500&width=700"}
                      alt={project.title || "Project image"}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transform group-hover:scale-[1.05] transition-transform duration-700"
                    />
                  </div>
                </div>
                
                {/* Информация */}
                <div>
                  <motion.div
                    // Более простая анимация текста
                    initial={{ opacity: 0, x: isEven ? 40 : -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={viewportOptions}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <h4
                      className={cn(
                        // Обновленный стиль заголовка проекта
                        "@lg:text-4xl @md:text-3xl text-2xl font-bold mb-3 tracking-tight",
                        theme.foreground,
                      )}
                    >
                      {project.title}
                    </h4>
                    <p className={cn("@md:text-lg text-base mb-6 leading-relaxed", theme.mutedText)}>
                      {project.description}
                    </p>
                    
                    {/* Теги */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, j) => (
                          <span
                            key={j}
                            className={cn(
                              // Обновленный стиль тегов — используем цвета темы и лёгкую прозрачность
                              "px-3 py-1 text-xs font-medium rounded-full border transition-all duration-300 hover:bg-primary hover:text-primary-foreground",
                              theme.mutedText,
                              theme.border,
                              theme.background,
                              "bg-opacity-30",
                            )}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}