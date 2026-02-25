import type { Theme } from './types'

export interface ThemeConfig {
  id: Theme
  name: string
  description: string
  tags?: string[]

  // --- ОСНОВНЫЕ ЦВЕТА ---
  background: string
  foreground: string
  primary: string
  primaryText: string
  muted: string
  mutedText: string
  border: string

  // --- ДОПОЛНИТЕЛЬНЫЕ СЕМАНТИЧЕСКИЕ ЦВЕТА ---
  secondary: string           // Дополнительный акцентный цвет
  secondaryText: string
  accent: string              // Цвет для выделения или акцента
  accentText: string
  success: string             // Цвет для успешных действий (зеленый)
  warning: string             // Цвет для предупреждений (желтый/оранжевый)

  // --- ЦВЕТА КОМПОНЕНТОВ UI ---
  card: string                // Фон карточек, часто отличается от background
  cardForeground: string
  popover: string             // Фон всплывающих окон/тултипов
  popoverForeground: string
  input: string               // Фон поля ввода (input)
  ring: string                // Базовый цвет кольца фокуса (ring-color)

  // --- СПЕЦИФИЧНЫЕ СОСТОЯНИЯ ---
  placeholder: string         // placeholder-... (Цвет плейсхолдера)
  caretColor: string          // caret-... (Цвет курсора)

  // --- ЭФФЕКТЫ ---
  cardStyle: string           // Полный стиль карточки: bg-color/opac, backdrop-blur, border
  glassPanel: string          // ✨ NEW: Для хедеров и оверлеев (bg + blur + border)
  elementGlow: string         // Свечение или сложная тень
  gradient: string            // ✨ NEW: Градиент для акцентов

  // --- ТИПОГРАФИКА ---
  fontTitle: string
  fontBody: string
  lineHeight: string
  letterSpacing: string

  // --- SIZING & DECORATIONS ---
  radiusMedium: string
  shadow: string
  // decorations were moved to a separate model (`DecorationsConfig` in `lib/types.ts`)
}

export const themes: ThemeConfig[] = [
  // -------------------------------------------------------
  // 1. VELLUM VINTAGE
  // -------------------------------------------------------
  {
    id: 'vellum-vintage',
    name: 'Vellum Vintage',
    description: 'Elegant aged paper with warm contrast and soft serif typography',
    tags: ['classic', 'elegant'],

    background: 'bg-[#F2EFE9]',
    foreground: 'text-[#463C33]',
    primary: 'bg-[#8C7A63]',
    primaryText: 'text-[#F9F7F5]',
    muted: 'bg-[#E6E2D8]',
    mutedText: 'text-[#8A8175]',
    border: 'border-[#D6CEC3]',

    secondary: 'bg-[#D1C7B7]',
    secondaryText: 'text-[#2E2822]',
    accent: 'bg-[#A65D46]',
    accentText: 'text-white',
    success: 'bg-[#5F7D58]',
    warning: 'bg-[#C48F45]',

    card: 'bg-[#F9F7F5]',
    cardForeground: 'text-[#463C33]',
    popover: 'bg-[#FAF9F6]',
    popoverForeground: 'text-[#463C33]',
    input: 'bg-[#EBE7DE]',
    ring: 'ring-[#B5A896]',

    placeholder: 'placeholder:text-[#9D9388]',
    caretColor: 'caret-[#8C7A63]',

    cardStyle: 'bg-[#F9F7F5]/80 backdrop-blur-[2px] border border-[#E6E2D8] shadow-sm',
    glassPanel: 'bg-[#F2EFE9]/80 backdrop-blur-md border-b border-[#D6CEC3]/50',
    elementGlow: 'shadow-[0_0_20px_rgba(140,122,99,0.15)]',
    gradient: 'bg-gradient-to-r from-[#8C7A63] to-[#A65D46]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-md',
    shadow: 'shadow-[0_4px_20px_-2px_rgba(70,60,50,0.1)]',
  },

  // -------------------------------------------------------
  // 2. NORDIC LIGHT
  // -------------------------------------------------------
  {
    id: 'nordic-light',
    name: 'Nordic Light',
    description: 'Minimal clean theme inspired by Scandinavian aesthetics',
    tags: ['minimal', 'modern'],

    background: 'bg-[#F8FAFC]',
    foreground: 'text-[#0F172A]',
    primary: 'bg-[#0F172A]',
    primaryText: 'text-white',
    muted: 'bg-[#F1F5F9]',
    mutedText: 'text-[#64748B]',
    border: 'border-[#E2E8F0]',

    secondary: 'bg-[#FFFFFF]',
    secondaryText: 'text-[#0F172A]',
    accent: 'bg-[#38BDF8]',
    accentText: 'text-white',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',

    card: 'bg-white',
    cardForeground: 'text-[#334155]',
    popover: 'bg-white',
    popoverForeground: 'text-[#0F172A]',
    input: 'bg-white',
    ring: 'ring-[#94A3B8]',

    placeholder: 'placeholder:text-[#94A3B8]',
    caretColor: 'caret-[#0F172A]',

    cardStyle: 'bg-white border border-[#E2E8F0] shadow-sm',
    glassPanel: 'bg-[#F8FAFC]/80 backdrop-blur-md border-b border-[#E2E8F0]/60',
    elementGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.1)]',
    gradient: 'bg-gradient-to-r from-[#0F172A] to-[#334155]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-lg',
    shadow: 'shadow-sm',
  },

  // -------------------------------------------------------
  // 3. MIDNIGHT NEON
  // -------------------------------------------------------
  {
    id: 'midnight-neon',
    name: 'Midnight Neon',
    description: 'Dark futuristic theme with neon highlights',
    tags: ['dark', 'modern'],

    background: 'bg-[#030712]',
    foreground: 'text-[#F3F4F6]',
    primary: 'bg-[#6366F1]',
    primaryText: 'text-white',
    muted: 'bg-[#111827]',
    mutedText: 'text-[#9CA3AF]',
    border: 'border-[#1F2937]',

    secondary: 'bg-[#1F2937]',
    secondaryText: 'text-[#F3F4F6]',
    accent: 'bg-[#D946EF]',
    accentText: 'text-white',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#EAB308]',

    card: 'bg-[#0B0F19]',
    cardForeground: 'text-[#E5E7EB]',
    popover: 'bg-[#111827]',
    popoverForeground: 'text-[#F3F4F6]',
    input: 'bg-[#111827]',
    ring: 'ring-[#818CF8]',

    placeholder: 'placeholder:text-[#4B5563]',
    caretColor: 'caret-[#D946EF]',

    cardStyle: 'bg-[#0B0F19]/80 backdrop-blur-md border border-[#1F2937]',
    glassPanel: 'bg-[#030712]/70 backdrop-blur-xl border-b border-[#1F2937]/60',
    elementGlow: 'shadow-[0_0_30px_rgba(99,102,241,0.3)]',
    gradient: 'bg-gradient-to-r from-[#6366F1] via-[#818CF8] to-[#D946EF]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-xl',
    shadow: 'shadow-[0_10px_40px_-10px_rgba(99,102,241,0.2)]',
  },

  // -------------------------------------------------------
  // 4. SUNSET WARM
  // -------------------------------------------------------
  {
    id: 'sunset-warm',
    name: 'Sunset Warm',
    description: 'Soft warm theme inspired by sunset and cozy tones',
    tags: ['warm', 'elegant'],

    background: 'bg-[#FFF9F5]',
    foreground: 'text-[#431407]',
    primary: 'bg-[#FB923C]',
    primaryText: 'text-white',
    muted: 'bg-[#FFF1E6]',
    mutedText: 'text-[#9A3412]',
    border: 'border-[#FED7AA]',

    secondary: 'bg-[#FFEDD5]',
    secondaryText: 'text-[#7C2D12]',
    accent: 'bg-[#F43F5E]',
    accentText: 'text-white',
    success: 'bg-[#65A30D]',
    warning: 'bg-[#EA580C]',

    card: 'bg-white',
    cardForeground: 'text-[#431407]',
    popover: 'bg-[#FFF7ED]',
    popoverForeground: 'text-[#431407]',
    input: 'bg-[#FFF7ED]',
    ring: 'ring-[#FB923C]',

    placeholder: 'placeholder:text-[#CA8A04]/50',
    caretColor: 'caret-[#F43F5E]',

    cardStyle: 'bg-white/60 backdrop-blur-sm border border-[#FED7AA]',
    glassPanel: 'bg-[#FFF9F5]/80 backdrop-blur-md border-b border-[#FED7AA]/50',
    elementGlow: 'shadow-[0_0_25px_rgba(251,146,60,0.25)]',
    gradient: 'bg-gradient-to-r from-[#FB923C] to-[#F43F5E]',

    fontTitle: 'font-serif',
    fontBody: 'font-serif',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-2xl',
    shadow: 'shadow-[0_8px_30px_rgba(251,146,60,0.1)]',
  },

  // -------------------------------------------------------
  // 5. OCEAN PROFESSIONAL
  // -------------------------------------------------------
  {
    id: 'ocean-pro',
    name: 'Ocean Professional',
    description: 'Deep blues and clean sharp edges for business look',

    background: 'bg-[#0B1120]',
    foreground: 'text-[#E2E8F0]',
    primary: 'bg-[#0EA5E9]',
    primaryText: 'text-white',
    muted: 'bg-[#1E293B]',
    mutedText: 'text-[#94A3B8]',
    border: 'border-[#334155]',

    secondary: 'bg-[#334155]',
    secondaryText: 'text-[#F1F5F9]',
    accent: 'bg-[#38BDF8]',
    accentText: 'text-[#0F172A]',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',

    card: 'bg-[#151F32]',
    cardForeground: 'text-[#F1F5F9]',
    popover: 'bg-[#1E293B]',
    popoverForeground: 'text-[#F1F5F9]',
    input: 'bg-[#0F172A]',
    ring: 'ring-[#0284C7]',

    placeholder: 'placeholder:text-[#475569]',
    caretColor: 'caret-[#38BDF8]',

    cardStyle: 'bg-[#151F32] border border-[#334155] shadow-lg',
    glassPanel: 'bg-[#0B1120]/80 backdrop-blur-md border-b border-[#334155]/50',
    elementGlow: 'shadow-[0_0_20px_rgba(14,165,233,0.15)]',
    gradient: 'bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-md',
    shadow: 'shadow-lg shadow-[#0B1120]/50',
  },

  // -------------------------------------------------------
  // 6. ROYAL CLASSIC
  // -------------------------------------------------------
  {
    id: 'royal-classic',
    name: 'Royal Classic',
    description: 'Rich royal colors combined with textured elegance',

    background: 'bg-[#FCFAF8]',
    foreground: 'text-[#3E2723]',
    primary: 'bg-[#7F1D1D]',
    primaryText: 'text-[#FEF2F2]',
    muted: 'bg-[#F5F5F4]',
    mutedText: 'text-[#78716C]',
    border: 'border-[#D7CCC8]',

    secondary: 'bg-[#E7E5E4]',
    secondaryText: 'text-[#44403C]',
    accent: 'bg-[#B45309]',
    accentText: 'text-white',
    success: 'bg-[#15803D]',
    warning: 'bg-[#A16207]',

    card: 'bg-white',
    cardForeground: 'text-[#292524]',
    popover: 'bg-[#FAFAF9]',
    popoverForeground: 'text-[#292524]',
    input: 'bg-[#F5F5F4]',
    ring: 'ring-[#7F1D1D]',

    placeholder: 'placeholder:text-[#A8A29E]',
    caretColor: 'caret-[#B45309]',

    cardStyle: 'bg-white/90 backdrop-blur-sm border border-[#E7E5E4] shadow-[0_4px_20px_rgba(0,0,0,0.05)]',
    glassPanel: 'bg-[#FCFAF8]/90 backdrop-blur-sm border-b border-[#D7CCC8]/50',
    elementGlow: 'shadow-[0_0_25px_rgba(127,29,29,0.15)]',
    gradient: 'bg-gradient-to-r from-[#7F1D1D] to-[#B45309]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-loose',
    letterSpacing: 'tracking-wider',

    radiusMedium: 'rounded-sm',
    shadow: 'shadow-xl shadow-[#7F1D1D]/10',
  },

  // -------------------------------------------------------
  // 7. GLASS FROST
  // -------------------------------------------------------
  {
    id: 'glass-frost',
    name: 'Glass Frost',
    description: 'Прозрачный стеклянный эффект с мягким свечением и размытием',

    background: 'bg-gradient-to-br from-[#E0E7FF] to-[#F3E8FF]',
    foreground: 'text-[#1E1B4B]',
    primary: 'bg-white/40',
    primaryText: 'text-[#1E1B4B]',
    muted: 'bg-white/20',
    mutedText: 'text-[#6366F1]',
    border: 'border-white/50',

    secondary: 'bg-white/30',
    secondaryText: 'text-[#312E81]',
    accent: 'bg-[#818CF8]',
    accentText: 'text-white',
    success: 'text-emerald-600',
    warning: 'text-amber-600',

    card: 'bg-white/30',
    cardForeground: 'text-[#1E1B4B]',
    popover: 'bg-white/70',
    popoverForeground: 'text-[#1E1B4B]',
    input: 'bg-white/20',
    ring: 'ring-white',

    placeholder: 'placeholder:text-[#6366F1]/50',
    caretColor: 'caret-[#4F46E5]',

    cardStyle: 'bg-white/25 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)]',
    glassPanel: 'bg-white/30 backdrop-blur-xl border-b border-white/40',
    elementGlow: 'shadow-[0_0_30px_rgba(255,255,255,0.6)]',
    gradient: 'bg-gradient-to-r from-[#818CF8] to-[#C084FC]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-2xl',
    shadow: 'shadow-lg',
  },

  // -------------------------------------------------------
  // 8. MONO NOIR
  // -------------------------------------------------------
  {
    id: 'mono-noir',
    name: 'Monochrome Noir',
    description: 'Чёрно-белая минималистичная тема с высокой контрастностью',

    background: 'bg-[#000000]',
    foreground: 'text-[#F5F5F5]',
    primary: 'bg-[#FFFFFF]',
    primaryText: 'text-black',
    muted: 'bg-[#171717]',
    mutedText: 'text-[#737373]',
    border: 'border-[#262626]',

    secondary: 'bg-[#262626]',
    secondaryText: 'text-[#E5E5E5]',
    accent: 'bg-[#404040]',
    accentText: 'text-white',
    success: 'text-green-400',
    warning: 'text-yellow-400',

    card: 'bg-[#0A0A0A]',
    cardForeground: 'text-[#EDEDED]',
    popover: 'bg-[#171717]',
    popoverForeground: 'text-white',
    input: 'bg-[#0A0A0A]',
    ring: 'ring-[#525252]',

    placeholder: 'placeholder:text-[#525252]',
    caretColor: 'caret-white',

    cardStyle: 'bg-[#0A0A0A] border border-[#262626]',
    glassPanel: 'bg-[#000000]/80 backdrop-blur-md border-b border-[#262626]',
    elementGlow: 'shadow-[0_0_15px_rgba(255,255,255,0.1)]',
    gradient: 'bg-gradient-to-r from-[#FFFFFF] to-[#A3A3A3]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-widest',

    radiusMedium: 'rounded-none',
    shadow: 'shadow-none',
  },

  // -------------------------------------------------------
  // 9. FLORAL BLOOM
  // -------------------------------------------------------
  {
    id: 'floral-bloom',
    name: 'Floral Bloom',
    description: 'Нежная цветочная тема с пастельными оттенками и мягкой типографикой',

    background: 'bg-[#FFF1F2]',
    foreground: 'text-[#881337]',
    primary: 'bg-[#FDA4AF]',
    primaryText: 'text-[#881337]',
    muted: 'bg-[#FFE4E6]',
    mutedText: 'text-[#9F1239]',
    border: 'border-[#FECDD3]',

    secondary: 'bg-[#FFF0F5]',
    secondaryText: 'text-[#831843]',
    accent: 'bg-[#F43F5E]',
    accentText: 'text-white',
    success: 'text-[#059669]',
    warning: 'text-[#D97706]',

    card: 'bg-white/80',
    cardForeground: 'text-[#881337]',
    popover: 'bg-[#FFF1F2]',
    popoverForeground: 'text-[#881337]',
    input: 'bg-white',
    ring: 'ring-[#FDA4AF]',

    placeholder: 'placeholder:text-[#FDA4AF]',
    caretColor: 'caret-[#E11D48]',

    cardStyle: 'bg-white/60 backdrop-blur-sm border border-[#FECDD3] shadow-sm',
    glassPanel: 'bg-[#FFF1F2]/80 backdrop-blur-md border-b border-[#FECDD3]/50',
    elementGlow: 'shadow-[0_4px_25px_rgba(251,113,133,0.3)]',
    gradient: 'bg-gradient-to-r from-[#FDA4AF] to-[#F43F5E]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-loose',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-3xl',
    shadow: 'shadow-[0_10px_30px_-5px_rgba(253,164,175,0.3)]',
  }
]

export const getTheme = (id: Theme): ThemeConfig => {
  return themes.find(t => t.id === id) || themes[0]
}