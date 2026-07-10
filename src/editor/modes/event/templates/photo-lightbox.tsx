'use client'

import { useEffect, useState } from 'react'
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

/**
 * Full-screen lightbox for event guest photos.
 * Rendered via portal so overflow-hidden / will-change ancestors can't clip it.
 * Reusable across all event templates.
 */
export function PhotoLightbox({ photos, index, onClose, onPrev, onNext }: PhotoLightboxProps) {
  // Delay mount until client so createPortal is safe during SSR
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // Keyboard navigation
  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     { e.preventDefault(); onClose() }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); onPrev()  }
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext()  }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, onClose, onPrev, onNext])

  // Lock body scroll while open
  useEffect(() => {
    if (index !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [index])

  if (!mounted) return null

  const photo = index !== null ? photos[index] : null

  return createPortal(
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Photo card */}
          <motion.div
            key={index}
            className="relative z-10"
            initial={{ scale: 0.86, opacity: 0, y: 16 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{    scale: 0.86, opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-black/60"
              style={{ maxWidth: '90vw', maxHeight: '88vh' }}>
              <Image
                src={getBestUrl(photo)}
                alt=""
                width={1600}
                height={1200}
                className="block w-auto h-auto"
                style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain' }}
                unoptimized
              />
            </div>
          </motion.div>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
            aria-label="Close"
          >
            <X size={17} strokeWidth={2} />
          </button>

          {/* Prev / Next */}
          {photos.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
                aria-label="Previous photo"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/25 active:scale-95"
                aria-label="Next photo"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </>
          )}

          {/* Counter */}
          {photos.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 rounded-full bg-black/40 px-3 py-1 text-xs text-white/60 backdrop-blur-sm tabular-nums">
              {(index ?? 0) + 1} / {photos.length}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
