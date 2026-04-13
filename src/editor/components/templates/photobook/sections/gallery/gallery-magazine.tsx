'use client'

import { useState } from 'react'
import { SectionWrapper } from '../../../primitives/section-wrapper'
import { SiteImage } from '@/editor/components/editor/section-settings/ui/site-image'
import { Animate } from '../../../primitives/animate'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/themes'
import type { PhotobookSectionContent } from '@/editor/lib/types'

interface GalleryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
}

export function GalleryMagazine({ sectionContent, theme }: GalleryMagazineProps) {
  const { gallery } = sectionContent
  const photos = gallery.images ?? []
  const [selectedImage, setSelectedImage] = useState<number | null>(null)

  // Распределяем фото по редакционной сетке
  const [feature, second, third, ...rest] = photos

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={cn(theme.background, "selection:bg-current selection:text-background")}
    >
      <div className="max-w-[1600px] mx-auto px-6 @md:px-12 py-20 @md:py-32">
        
        {/* Editorial Header */}
        <header className="mb-20 @md:mb-32">
          <Animate trigger="mount" direction="none" className="space-y-12">
            <div className="flex items-center gap-4">
              {gallery.label && (
                <span className={cn("text-[10px] uppercase tracking-[0.5em] opacity-40", theme.fontBody)}>
                  {gallery.label}
                </span>
              )}
              <div className="h-px flex-1 bg-current opacity-10" />
              {photos.length > 0 && (
                <span className={cn("text-[10px] opacity-20 font-mono", theme.fontBody)}>
                  {String(photos.length).padStart(2, '0')}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 items-end">
              <div className="@lg:col-span-8">
                {gallery.title && (
                  <h2 className={cn(
                    "text-5xl @md:text-8xl @lg:text-9xl tracking-tighter leading-[0.85] uppercase",
                    theme.fontTitle
                  )}>
                    {gallery.title.split(' ').map((word, i) => (
                      <span key={i} className={cn("block", i % 2 !== 0 && "italic font-light ml-4 @md:ml-12")}>
                        {word}
                      </span>
                    ))}
                  </h2>
                )}
              </div>
              <div className="@lg:col-span-4">
                {gallery.description && (
                  <p className={cn(
                    "text-sm @md:text-base opacity-50 max-w-sm leading-relaxed border-l border-current pl-6 py-2",
                    theme.fontBody
                  )}>
                    {gallery.description}
                  </p>
                )}
              </div>
            </div>
          </Animate>
        </header>

        <div className="space-y-24 @md:space-y-40">
          {/* 1. Hero Section - Cinematic 21:9 */}
          {feature && (
            <Animate trigger="mount" direction="up" distance={40}>
              <div 
                className="group relative cursor-zoom-in"
                onClick={() => setSelectedImage(0)}
              >
                <div className="relative aspect-[21/9] overflow-hidden bg-muted">
                  <SiteImage
                    fillParent
                    unoptimized
                    src={feature.image}
                    alt={feature.caption ?? ''}
                    imageClassName="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  />
                </div>
                <div className="mt-6 flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] opacity-30 font-mono">01</span>
                    <div className="h-px w-8 bg-current opacity-20" />
                  </div>
                  {feature.caption && (
                    <p className={cn("text-[11px] uppercase tracking-widest opacity-40 text-right max-w-xs", theme.fontBody)}>
                      {feature.caption}
                    </p>
                  )}
                </div>
              </div>
            </Animate>
          )}

          {/* 2. Asymmetric Dual Row */}
          {(second || third) && (
            <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 @md:gap-12">
              {second && (
                <div className="@md:col-span-7">
                  <Animate direction="up" delay={0.1}>
                    <div className="group cursor-zoom-in" onClick={() => setSelectedImage(1)}>
                      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                        <SiteImage
                          fillParent
                          src={second.image}
                          alt={second.caption ?? ''}
                          imageClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-[9px] opacity-20 font-mono text-current">02</span>
                        {second.caption && (
                          <p className={cn("text-[9px] uppercase tracking-[0.3em] opacity-40", theme.fontBody)}>
                            {second.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </Animate>
                </div>
              )}
              {third && (
                <div className="@md:col-span-5 @md:mt-32">
                  <Animate direction="up" delay={0.2}>
                    <div className="group cursor-zoom-in" onClick={() => setSelectedImage(2)}>
                      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                        <SiteImage
                          fillParent
                          src={third.image}
                          alt={third.caption ?? ''}
                          imageClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="text-[9px] opacity-20 font-mono text-current">03</span>
                        {third.caption && (
                          <p className={cn("text-[9px] uppercase tracking-[0.3em] opacity-40", theme.fontBody)}>
                            {third.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </Animate>
                </div>
              )}
            </div>
          )}

          {/* 3. Masonry Grid for Rest */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-x-8 gap-y-20 @md:gap-y-32">
              {rest.map((block, index) => {
                const isTall = index % 3 === 1;
                return (
                  <Animate 
                    key={block.id} 
                    direction="up" 
                    delay={index * 0.05}
                    className={cn(isTall && "@lg:mt-24")}
                  >
                    <div 
                      className="group cursor-zoom-in"
                      onClick={() => setSelectedImage(index + 3)}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                        <SiteImage
                          fillParent
                          src={block.image}
                          alt={block.caption ?? ''}
                          imageClassName="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                           {block.caption && (
                             <p className="text-white text-[10px] uppercase tracking-widest leading-relaxed">
                               {block.caption}
                             </p>
                           )}
                        </div>
                      </div>
                      <div className="mt-6 flex items-center gap-4">
                        <span className="text-[10px] font-mono opacity-20">{String(index + 4).padStart(2, '0')}</span>
                        <div className="h-px flex-1 bg-current opacity-10" />
                        {block.caption && (
                          <span className={cn("text-[9px] uppercase tracking-[0.2em] opacity-40 truncate max-w-[16ch]", theme.fontBody)}>{block.caption}</span>
                        )}
                      </div>
                    </div>
                  </Animate>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <footer className="mt-40 pt-12 border-t border-current border-opacity-10 flex justify-between items-center">
          <div className={cn("text-[10px] uppercase tracking-[0.5em] opacity-20", theme.fontBody)}>
            {gallery.title}
          </div>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group w-8 h-8 rounded-full border border-current flex items-center justify-center opacity-40 hover:opacity-100 hover:-translate-y-1 transition-all"
            aria-label="Scroll to top"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </footer>
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && photos[selectedImage] && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-full h-full max-w-7xl max-h-[85vh]">
            <SiteImage
              fillParent
              src={photos[selectedImage].image}
              imageClassName="object-contain"
            />
          </div>
          <div className="absolute bottom-10 left-10 right-10 flex justify-between items-center text-white/50">
            <p className="text-[10px] uppercase tracking-widest">
              {photos[selectedImage].caption}
            </p>
            <p className="font-mono text-[10px]">
              {String(selectedImage + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      )}
    </SectionWrapper>
  )
}