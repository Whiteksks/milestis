'use client'

import { useEffect, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { EventGuestPhoto } from '@/editor/modes/event/content-types'

function getBestUrl(photo: EventGuestPhoto): string {
  if (photo.fullUrl)  return photo.fullUrl
  if (photo.thumbUrl) return photo.thumbUrl
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(photo.storageRef)}?alt=media`
}

interface PhotoLightboxProps {
  photos: EventGuestPhoto[]
  /** Currently open index — null means closed */
  index: number | null
  onClose: () => void
  onPrev:  () => void
  onNext:  () => void
}

export function PhotoLightbox({ photos, index, onClose, onPrev, onNext }: PhotoLightboxProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Стабильные ссылки на колбэки для предотвращения лишних перезапусков useEffect
  const handleClose = useCallback(() => onClose(), [onClose])
  const handlePrev  = useCallback(() => onPrev(), [onPrev])
  const handleNext  = useCallback(() => onNext(), [onNext])

  // Навигация с клавиатуры
  useEffect(() => {
    if (index === null) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     { e.preventDefault(); handleClose() }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); handlePrev()  }
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext()  }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, handleClose, handlePrev, handleNext])

  // Блокировка скролла (исправлено для SSR)
  useEffect(() => {
    if (index !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [index])

  // Рендерим портал только на клиенте и только в существующий document.body
  if (!mounted || typeof window === 'undefined') return null

  const isOpen = index !== null && photos.length > 0
  const photo = index !== null ? photos[index] : null

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && photo && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop (Задний фон) */}
          <motion.div
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Контейнер для фото и стрелок (фиксирует ширину для предотвращения дёргания UX) */}
          <div className="relative z-10 flex h-full w-full max-w-7xl items-center justify-center p-4 md:p-12">
            
            {/* Карточка фотографии */}
            <motion.div
              key={index} // Важно для анимации смены картинок через AnimatePresence
              className="relative max-h-full max-w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/80"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            >
              <div className="relative flex items-center justify-center" style={{ maxWidth: '90vw', maxHeight: '82vh' }}>
                <Image
                  src={getBestUrl(photo)}
                  alt={""}
                  width={1600}
                  height={1200}
                  priority
                  className="h-auto max-h-[82vh] w-auto max-w-[90vw] object-contain select-none pointer-events-none"
                  unoptimized
                />
              </div>
            </motion.div>

            {/* Кнопка закрытия */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {/* Навигация (Стрелки) */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrev() }}
                  className="absolute left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 disabled:opacity-30"
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNext() }}
                  className="absolute right-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95 disabled:opacity-30"
                  aria-label="Next photo"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}

            {/* Счетчик */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/50 px-4 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm tabular-nums tracking-wider">
                {index + 1} / {photos.length}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}