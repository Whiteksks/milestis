    import type { LayerEffectDef, EffectColors } from '../../types'
    import { withAlpha } from '../../types'

    const RAYS = [
    { offset: -15, widthPx: 2,  opDark: 0.06,  opLight: 0.18 },
    { offset: -5,  widthPx: 1,  opDark: 0.04,  opLight: 0.12 },
    { offset: 8,   widthPx: 3,  opDark: 0.07,  opLight: 0.22 },
    { offset: 18,  widthPx: 1,  opDark: 0.035, opLight: 0.10 },
    { offset: 30,  widthPx: 2,  opDark: 0.05,  opLight: 0.16 },
    { offset: 42,  widthPx: 1,  opDark: 0.03,  opLight: 0.09 },
    { offset: 55,  widthPx: 4,  opDark: 0.08,  opLight: 0.25 },
    { offset: 68,  widthPx: 1,  opDark: 0.03,  opLight: 0.08 },
    { offset: 78,  widthPx: 2,  opDark: 0.05,  opLight: 0.15 },
    { offset: 90,  widthPx: 1,  opDark: 0.025, opLight: 0.07 },
    ]

    function DiagonalRays({ isDark, rayColor, subtleColor }: { isDark: boolean } & EffectColors) {
    const angle = -35

    return (
        <div
        className="absolute inset-0 overflow-hidden"
        style={{ mixBlendMode: isDark ? 'screen' : 'multiply' }}
        >
        {RAYS.map((ray, i) => {
            const op = isDark ? ray.opDark : ray.opLight
            const color = ray.widthPx >= 3 ? rayColor : subtleColor
            const spread = ray.widthPx * (isDark ? 12 : 8)
            return (
            <div
                key={i}
                className="absolute"
                style={{
                width: `${spread}px`,
                height: '200%',
                top: '-50%',
                left: `${ray.offset}%`,
                background: `linear-gradient(180deg,
                    transparent 0%,
                    ${withAlpha(color, op * 0.3)} 20%,
                    ${withAlpha(color, op)} 45%,
                    ${withAlpha(color, op * 0.8)} 65%,
                    transparent 100%)`,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                filter: `blur(${4 + ray.widthPx * 3}px)`,
                }}
            />
            )
        })}
        </div>
    )
    }

    export const diagonalRays: LayerEffectDef<'diagonal-rays'> = {
    id: 'diagonal-rays',
    label: 'Diagonal Rays',
    Component: DiagonalRays,
    }
