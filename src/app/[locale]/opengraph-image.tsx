import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const TAGLINES: Record<string, string> = {
  en: 'Create your interactive photo book',
  ru: 'Создайте интерактивную фотокнигу',
  kz: 'Интерактивті фотокітапты жасаңыз',
}

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const tagline = TAGLINES[locale] ?? TAGLINES.en

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0f0f10',
          color: '#f5f1ea',
        }}
      >
        <div style={{ fontSize: 108, fontWeight: 600, letterSpacing: -2 }}>Milestis</div>
        <div style={{ marginTop: 20, fontSize: 36, color: '#b8b2a6' }}>{tagline}</div>
      </div>
    ),
    { ...size }
  )
}
