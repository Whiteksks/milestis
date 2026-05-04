'use client'

import { SlotImage } from '@/editor/image'
import { resolveImage } from '@/editor/image/resolve'
import type { ImageValue } from '@/editor/image'

// Hardcoded test value — no async needed for a test page
const testValue: ImageValue = {
  asset: {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    width: 1200,
    height: 800,
    alt: 'Demo cover',
  },
}

export default function TestImagePage() {
  // Resolve without templateId — uses base slot policy
  const resolved = resolveImage(testValue, 'photobook.cover.primary')

  // Resolve with soleil templateId — forces 4/5
  const resolvedSoleil = resolveImage(testValue, 'photobook.cover.primary', 'photobook-soleil')

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-8 gap-10">
      <p className="text-xs text-neutral-500 uppercase tracking-widest">
        Image runtime test
      </p>

      <div className="flex gap-8 items-start">
        {/* Without template override */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Base policy</p>
          <div className="w-64">
            <SlotImage
              slotId="photobook.cover.primary"
              value={testValue}
              alt="Demo cover"
              priority
            />
          </div>
          <div className="text-xs text-neutral-600 space-y-1 text-center">
            <p>ratio: <span className="text-neutral-400">{resolved.ratio}</span></p>
            <p>frame: <span className="text-neutral-400">{resolved.frameStyle}</span></p>
            <p>crop: <span className="text-neutral-400">{resolved.crop ? 'yes' : 'none'}</span></p>
          </div>
        </div>

        {/* With soleil template override — ratio forced to 4/5 */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Soleil override (4/5 forced)</p>
          <div className="w-64">
            <SlotImage
              slotId="photobook.cover.primary"
              value={testValue}
              templateId="photobook-soleil"
              alt="Demo cover"
              priority
            />
          </div>
          <div className="text-xs text-neutral-600 space-y-1 text-center">
            <p>ratio: <span className="text-neutral-400">{resolvedSoleil.ratio}</span></p>
            <p>frame: <span className="text-neutral-400">{resolvedSoleil.frameStyle}</span></p>
            <p>crop: <span className="text-neutral-400">{resolvedSoleil.crop ? 'yes' : 'none'}</span></p>
          </div>
        </div>
      </div>
    </div>
  )
}
