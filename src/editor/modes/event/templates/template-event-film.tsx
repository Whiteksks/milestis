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

const SKELETON_COUNT = 10

export function TemplateEventFilm({ theme, eventPhotos }: EventTemplateProps) {
  return (
    <div className={cn('min-h-screen', theme.background)}>
      <div className="p-1">
        {eventPhotos.length === 0 ? (
          // Empty skeleton — portrait-ratio 2-col film grid
          <div className="grid grid-cols-2 gap-px">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className={cn('aspect-[3/4] w-full', theme.muted)} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-px">
            {eventPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={getPhotoUrl(photo)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 33vw"
                  unoptimized
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
