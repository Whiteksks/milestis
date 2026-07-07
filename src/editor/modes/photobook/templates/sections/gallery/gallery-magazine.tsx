'use client'

import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import { findPhotobookRepeatingImage, SlotImage } from '@/editor/image'
import { SectionWrapper } from '@/editor/components/templates/primitives/section-wrapper'
import { Animate } from '@/editor/components/templates/primitives/animate'
import { cn } from '@/lib/utils'
import type { ThemeConfig } from '@/editor/lib/config/themes'
import type { PhotobookSectionContent } from '../../../content-types'

interface GalleryMagazineProps {
  sectionContent: PhotobookSectionContent
  theme: ThemeConfig
  imageContent?: PhotobookImageContent
}

export function GalleryMagazine({ sectionContent, theme, imageContent }: GalleryMagazineProps) {
  const { gallery } = sectionContent
  const photos = gallery.photos ?? []

  const [feature, second, third, ...rest] = photos

  return (
    <SectionWrapper
      id="gallery"
      themeForeground={theme.foreground}
      className={cn(theme.background, "selection:bg-current selection:text-background antialiased")}
    >
      <div className="max-w-[1600px] mx-auto px-6 @md:px-12 @lg:px-20 py-20 @md:py-36">
        
        <header className="mb-20 @md:mb-32">
          <Animate trigger="mount" direction="none" className="space-y-12">
            
            <div className="flex items-center justify-between gap-6">
              {gallery.label && (
                <span className={cn("text-[9px] @md:text-[10px] uppercase tracking-[0.6em] opacity-50 block font-medium", theme.fontBody)}>
                  {gallery.label}
                </span>
              )}
              <div className="h-[0.5px] flex-1 bg-current opacity-10" />
              {photos.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] @md:text-xs opacity-40 font-mono font-light", theme.fontBody)}>
                    ({String(photos.length).padStart(2, '0')})
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 @lg:grid-cols-12 gap-10 @lg:gap-16 items-start">
              <div className="@lg:col-span-8 space-y-4">
                {gallery.title && (
                  <h2 className={cn(
                    "text-5xl @md:text-7xl @lg:text-[92px] tracking-tightest leading-[0.85] uppercase break-words font-normal",
                    theme.fontTitle
                  )}>
                    {gallery.title.split(' ').map((word, i) => (
                      <span 
                        key={i} 
                        className={cn(
                          "block transition-transform duration-500 hover:translate-x-2", 
                          i % 2 !== 0 && "italic font-light @md:pl-16 opacity-90 text-serif"
                        )}
                      >
                        {word}
                      </span>
                    ))}
                  </h2>
                )}
              </div>
              <div className="@lg:col-span-4 @lg:mt-4">
                {gallery.description && (
                  <p className={cn(
                    "text-xs @md:text-sm opacity-60 max-w-sm leading-relaxed border-l-2 border-current/20 pl-6 py-2 font-light",
                    theme.fontBody
                  )}>
                    {gallery.description}
                  </p>
                )}
              </div>
            </div>
          </Animate>
        </header>

        <div className="space-y-20 @md:space-y-36">
          
          {feature && (
            <Animate trigger="mount" direction="up" distance={40}>
              {(() => {
                const featureImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', feature.id) : undefined

                return (
                  <div className="group relative w-full">
                    <div className="relative aspect-[21/9] @md:aspect-[16/9] overflow-hidden bg-current/[0.02] rounded-[2px] transition-all duration-700">
                      {featureImage?.value.asset.src ? (
                        <SlotImage
                          slotId={featureImage.slotId}
                          value={featureImage.value}
                          fillParent
                          alt={feature.caption ?? ''}
                          imageClassName="object-cover transition-transform duration-[1200ms] ease-out scale-100 group-hover:scale-[1.015]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-current/[0.03] animate-pulse" />
                      )}
                    </div>
                    
                    <div className="mt-5 flex justify-between items-baseline px-1">
                      <div className="flex items-center gap-4">
                        <span className="text-[10px] font-mono opacity-40 font-medium">01</span>
                      </div>
                      {feature.caption && (
                        <p className={cn("text-[9px] @md:text-[10px] uppercase tracking-[0.2em] opacity-40 text-right max-w-md truncate font-light", theme.fontBody)}>
                          {feature.caption}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })()}
            </Animate>
          )}

          {(second || third) && (
            <div className="grid grid-cols-1 @md:grid-cols-12 gap-10 @md:gap-12 items-start">
              
              {second && (
                <div className="@md:col-span-7 w-full">
                  <Animate direction="up" delay={0.05} distance={30}>
                    {(() => {
                      const secondImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', second.id) : undefined

                      return (
                        <div className="group w-full">
                          <div className="relative aspect-[4/5] overflow-hidden bg-current/[0.02] rounded-[2px]">
                            {secondImage?.value.asset.src ? (
                              <SlotImage
                                slotId={secondImage.slotId}
                                value={secondImage.value}
                                fillParent
                                alt={second.caption ?? ''}
                                imageClassName="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-current/[0.03]" />
                            )}
                          </div>
                          <div className="mt-4 flex items-center gap-3 px-1">
                            <span className="text-[10px] opacity-40 font-mono">02</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-25" />
                            {second.caption && (
                              <p className={cn("text-[9px] uppercase tracking-[0.2em] opacity-50 truncate font-light", theme.fontBody)}>
                                {second.caption}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </Animate>
                </div>
              )}
              
              {third && (
                <div className="@md:col-span-5 w-full @md:mt-24">
                  <Animate direction="up" delay={0.15} distance={30}>
                    {(() => {
                      const thirdImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', third.id) : undefined

                      return (
                        <div className="group w-full">
                          <div className="relative aspect-[2/3] overflow-hidden bg-current/[0.02] rounded-[2px]">
                            {thirdImage?.value.asset.src ? (
                              <SlotImage
                                slotId={thirdImage.slotId}
                                value={thirdImage.value}
                                fillParent
                                alt={third.caption ?? ''}
                                imageClassName="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.02]"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-current/[0.03]" />
                            )}
                          </div>
                          <div className="mt-4 flex items-center gap-3 px-1">
                            <span className="text-[10px] opacity-40 font-mono">03</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-25" />
                            {third.caption && (
                              <p className={cn("text-[9px] uppercase tracking-[0.2em] opacity-50 truncate font-light", theme.fontBody)}>
                                {third.caption}
                              </p>
                            )}
                          </div>
                        </div>
                      )
                    })()}
                  </Animate>
                </div>
              )}
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 gap-8 @md:gap-12 @lg:gap-16">
              {rest.map((block, index) => {
                const galleryImage = imageContent ? findPhotobookRepeatingImage(imageContent, 'gallery', block.id) : undefined
                const absoluteIndex = index + 3

                const aspectClass = index % 3 === 1 ? "aspect-[3/4]" : "aspect-[4/5]"

                return (
                  <Animate 
                    key={block.id} 
                    direction="up" 
                    delay={(index % 3) * 0.08}
                    distance={25}
                  >
                    <div className="group relative w-full">
                      <div className={cn("relative overflow-hidden bg-current/[0.02] rounded-[2px] transition-all duration-500", aspectClass)}>
                        {galleryImage?.value.asset.src ? (
                          <SlotImage
                            slotId={galleryImage.slotId}
                            value={galleryImage.value}
                            fillParent
                            alt={block.caption ?? ''}
                            imageClassName="object-cover transition-transform duration-[1000ms] group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-current/[0.03]" />
                        )}
                        
                        <div className="absolute inset-0 bg-background/10 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6">
                          <span className="text-[10px] font-mono text-current mix-blend-difference opacity-60">
                            #{String(absoluteIndex + 1).padStart(2, '0')}
                          </span>
                          {block.caption && (
                            <p className="text-current mix-blend-difference text-[9px] uppercase tracking-[0.2em] leading-relaxed font-medium max-w-[90%]">
                              {block.caption}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-3 px-1">
                        <span className="text-[10px] font-mono opacity-40">{String(absoluteIndex + 1).padStart(2, '0')}</span>
                        <div className="h-[0.5px] flex-1 bg-current opacity-10" />
                        {block.caption && (
                          <span className={cn("text-[9px] uppercase tracking-[0.15em] opacity-40 truncate max-w-[16ch] font-light", theme.fontBody)}>
                            {block.caption}
                          </span>
                        )}
                      </div>
                    </div>
                  </Animate>
                )
              })}
            </div>
          )}
        </div>

        <footer className="mt-36 pt-12 border-t border-current/10 flex justify-between items-center px-1">
          <div className={cn("text-[9px] @md:text-[10px] uppercase tracking-[0.5em] opacity-40 truncate max-w-[300px] font-medium", theme.fontBody)}>
            {gallery.title}
          </div>
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group relative w-10 h-10 rounded-full border border-current/10 flex items-center justify-center opacity-50 hover:opacity-100 hover:border-current/40 transition-all duration-500"
            aria-label="Scroll to top"
          >
            <span className="absolute inset-0 rounded-full bg-current/5 scale-0 group-hover:scale-100 transition-transform duration-500 ease-out" />
            <svg className="w-3.5 h-3.5 text-current transition-transform duration-300 group-hover:-translate-y-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </footer>
      </div>
    </SectionWrapper>
  )
}