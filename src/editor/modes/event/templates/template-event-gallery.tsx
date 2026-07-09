'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { EventTemplateProps } from '@/editor/lib/template-types'
import type { EventGuestPhoto } from '@/editor/modes/event/content-types'

function getPhotoUrl(photo: EventGuestPhoto): string {
  if (photo.thumbUrl) return photo.thumbUrl
  const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? ''
  return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(photo.storageRef)}?alt=media`
}

const SKELETON_COUNT = 12

export function TemplateEventGallery({ theme, eventPhotos }: EventTemplateProps) {
  return (
    <div className={cn('min-h-screen', theme.background)}>
      <div className="px-4 py-4">
        {eventPhotos.length === 0 ? (
          // Empty skeleton grid — mirrors real layout so the canvas looks complete
          <div className="columns-2 gap-2 sm:columns-3 md:columns-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="mb-2 break-inside-avoid">
                <div className={cn('aspect-square w-full rounded-md', theme.muted)} />
              </div>
            ))}
          </div>
        ) : (
          <div className="columns-2 gap-2 sm:columns-3 md:columns-4">
            {eventPhotos.map((photo) => (
              <div key={photo.id} className="mb-2 overflow-hidden rounded-md break-inside-avoid">
                <div className="relative aspect-square w-full">
                  <Image
                    src={getPhotoUrl(photo)}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    unoptimized
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
