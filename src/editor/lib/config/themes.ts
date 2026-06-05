export interface ThemeConfig {
  id: string
  name: string
  description: string
  nameKey?: string
  descriptionKey?: string
  tags?: string[]

  // --- CORE COLORS ---
  background: string
  foreground: string
  primary: string
  primaryText: string
  muted: string
  mutedText: string
  border: string

  // --- SEMANTIC COLORS ---
  secondary: string
  secondaryText: string
  accent: string
  accentText: string
  success: string
  warning: string

  // --- UI COMPONENT COLORS ---
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  input: string
  ring: string

  // --- STATE ---
  placeholder: string
  caretColor: string

  // --- EFFECTS ---
  cardStyle: string
  glassPanel: string
  elementGlow: string
  gradient: string

  // --- BG EFFECT COLORS (raw hex) ---
  bgEffectColors: {
    primary: string
    secondary: string
    ray: string
    subtle: string
    highlight: string
    shadow: string
    accent2: string
  }

  // --- TYPOGRAPHY ---
  fontTitle: string
  fontBody: string
  lineHeight: string
  letterSpacing: string

  // --- SIZING & DECORATIONS ---
  radiusMedium: string
  shadow: string
}

const rawThemes: ThemeConfig[] = [

  // =====================================================
  // 1. PARCHMENT  (Light + Warm + Neutral)
  //    Aged paper, ink, and candlelight. Timeless editorial.
  // =====================================================
  {
    id: 'parchment',
    name: 'Parchment',
    description: 'Aged paper warmth with ink-dark type and candlelit accents',
    tags: ['light', 'warm'],

    background: 'bg-[#F5F1EB]',
    foreground: 'text-[#2C2419]',
    primary: 'bg-[#8B7355]',
    primaryText: 'text-[#FAF8F5]',
    muted: 'bg-[#EBE5DB]',
    mutedText: 'text-[#8C7E6E]',
    border: 'border-[#DDD5C8]',

    secondary: 'bg-[#D9CEBD]',
    secondaryText: 'text-[#2C2419]',
    accent: 'bg-[#B8704B]',
    accentText: 'text-[#FAF8F5]',
    success: 'bg-[#6B7F4E]',
    warning: 'bg-[#C49234]',

    card: 'bg-[#FAF8F5]',
    cardForeground: 'text-[#2C2419]',
    popover: 'bg-[#FAF8F5]',
    popoverForeground: 'text-[#2C2419]',
    input: 'bg-[#F0EADE]',
    ring: 'ring-[#8B7355]',

    placeholder: 'placeholder:text-[#B0A493]',
    caretColor: 'caret-[#B8704B]',

    cardStyle: 'bg-[#FAF8F5]/85 backdrop-blur-sm border border-[#E6DFD3] shadow-[0_2px_12px_rgba(44,36,25,0.06)]',
    glassPanel: 'bg-[#F5F1EB]/85 backdrop-blur-md border-b border-[#DDD5C8]/60',
    elementGlow: 'shadow-[0_0_24px_rgba(139,115,85,0.12)]',
    gradient: 'bg-gradient-to-r from-[#8B7355] to-[#B8704B]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-md',
    shadow: 'shadow-[0_4px_20px_-2px_rgba(44,36,25,0.08)]',
    bgEffectColors: {
      primary: '#8B7355',
      secondary: '#B8704B',
      ray: '#E8D9C4',
      subtle: '#CFC4B2',
      highlight: '#FFF9F2',
      shadow: '#1A1409',
      accent2: '#C49234',
    },
  },

  // =====================================================
  // 2. FROST  (Light + Cool)
  //    Scandinavian ice, steel blue, clean precision.
  // =====================================================
  {
    id: 'frost',
    name: 'Frost',
    description: 'Ice-cool Scandinavian clarity with steel blue precision',
    tags: ['light', 'cool', 'minimal'],

    background: 'bg-[#F4F7FA]',
    foreground: 'text-[#1A2332]',
    primary: 'bg-[#3B6B8A]',
    primaryText: 'text-[#F8FAFB]',
    muted: 'bg-[#E8EDF2]',
    mutedText: 'text-[#6B7D8E]',
    border: 'border-[#D4DCE4]',

    secondary: 'bg-[#DCE4EC]',
    secondaryText: 'text-[#1A2332]',
    accent: 'bg-[#2E8B9A]',
    accentText: 'text-[#F8FAFB]',
    success: 'bg-[#4A8B6F]',
    warning: 'bg-[#B8883A]',

    card: 'bg-[#FAFBFC]',
    cardForeground: 'text-[#1A2332]',
    popover: 'bg-[#FAFBFC]',
    popoverForeground: 'text-[#1A2332]',
    input: 'bg-[#EEF1F5]',
    ring: 'ring-[#3B6B8A]',

    placeholder: 'placeholder:text-[#9AAAB8]',
    caretColor: 'caret-[#2E8B9A]',

    cardStyle: 'bg-[#FAFBFC]/80 backdrop-blur-sm border border-[#DCE4EC] shadow-[0_2px_12px_rgba(26,35,50,0.05)]',
    glassPanel: 'bg-[#F4F7FA]/80 backdrop-blur-md border-b border-[#D4DCE4]/60',
    elementGlow: 'shadow-[0_0_20px_rgba(59,107,138,0.10)]',
    gradient: 'bg-gradient-to-r from-[#3B6B8A] to-[#2E8B9A]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-lg',
    shadow: 'shadow-[0_4px_16px_rgba(26,35,50,0.06)]',
    bgEffectColors: {
      primary: '#3B6B8A',
      secondary: '#2E8B9A',
      ray: '#C8DAE8',
      subtle: '#B4C5D4',
      highlight: '#F0F6FB',
      shadow: '#0D1520',
      accent2: '#5BA0AE',
    },
  },

  // =====================================================
  // 3. EMBER  (Dark + Warm)
  //    Charcoal, amber glow, fireside intimacy.
  // =====================================================
  {
    id: 'ember',
    name: 'Ember',
    description: 'Deep charcoal with amber glow and fireside warmth',
    tags: ['dark', 'warm'],

    background: 'bg-[#141110]',
    foreground: 'text-[#E8E0D6]',
    primary: 'bg-[#C8956C]',
    primaryText: 'text-[#141110]',
    muted: 'bg-[#1E1A17]',
    mutedText: 'text-[#8A7D72]',
    border: 'border-[#2E2723]',

    secondary: 'bg-[#2A2320]',
    secondaryText: 'text-[#D4C8BA]',
    accent: 'bg-[#D4784A]',
    accentText: 'text-[#FFF8F3]',
    success: 'bg-[#7A9B6A]',
    warning: 'bg-[#D4A94A]',

    card: 'bg-[#1A1614]',
    cardForeground: 'text-[#E0D6C8]',
    popover: 'bg-[#1E1A17]',
    popoverForeground: 'text-[#E0D6C8]',
    input: 'bg-[#1A1614]',
    ring: 'ring-[#C8956C]',

    placeholder: 'placeholder:text-[#5E544A]',
    caretColor: 'caret-[#D4784A]',

    cardStyle: 'bg-[#1A1614]/80 backdrop-blur-md border border-[#2E2723] shadow-[0_4px_24px_rgba(0,0,0,0.3)]',
    glassPanel: 'bg-[#141110]/75 backdrop-blur-xl border-b border-[#2E2723]/60',
    elementGlow: 'shadow-[0_0_28px_rgba(200,149,108,0.15)]',
    gradient: 'bg-gradient-to-r from-[#C8956C] to-[#D4784A]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-md',
    shadow: 'shadow-[0_8px_32px_-4px_rgba(0,0,0,0.4)]',
    bgEffectColors: {
      primary: '#C8956C',
      secondary: '#D4784A',
      ray: '#3D2E22',
      subtle: '#2E2723',
      highlight: '#F5E6D6',
      shadow: '#080604',
      accent2: '#D4A94A',
    },
  },

  // =====================================================
  // 4. OBSIDIAN  (Dark + Cool)
  //    Volcanic glass, icy blue edge, surgical precision.
  // =====================================================
  {
    id: 'obsidian',
    name: 'Obsidian',
    description: 'Volcanic dark with icy blue edge and surgical precision',
    tags: ['dark', 'cool'],

    background: 'bg-[#0C0F14]',
    foreground: 'text-[#D6DCE6]',
    primary: 'bg-[#5B8FB9]',
    primaryText: 'text-[#F0F4F8]',
    muted: 'bg-[#151921]',
    mutedText: 'text-[#6E7A8A]',
    border: 'border-[#1E2530]',

    secondary: 'bg-[#1C2230]',
    secondaryText: 'text-[#C0CAD8]',
    accent: 'bg-[#4AACB0]',
    accentText: 'text-[#0C0F14]',
    success: 'bg-[#4A9B7F]',
    warning: 'bg-[#C49950]',

    card: 'bg-[#10141B]',
    cardForeground: 'text-[#CCD4E0]',
    popover: 'bg-[#151921]',
    popoverForeground: 'text-[#D6DCE6]',
    input: 'bg-[#10141B]',
    ring: 'ring-[#5B8FB9]',

    placeholder: 'placeholder:text-[#4A5568]',
    caretColor: 'caret-[#4AACB0]',

    cardStyle: 'bg-[#10141B]/80 backdrop-blur-md border border-[#1E2530] shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
    glassPanel: 'bg-[#0C0F14]/75 backdrop-blur-xl border-b border-[#1E2530]/60',
    elementGlow: 'shadow-[0_0_24px_rgba(91,143,185,0.12)]',
    gradient: 'bg-gradient-to-r from-[#5B8FB9] to-[#4AACB0]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-lg',
    shadow: 'shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)]',
    bgEffectColors: {
      primary: '#5B8FB9',
      secondary: '#4AACB0',
      ray: '#1E3448',
      subtle: '#1E2530',
      highlight: '#D6EAF0',
      shadow: '#040608',
      accent2: '#7BAFD4',
    },
  },

  // =====================================================
  // 5. SAND  (Light + Warm + Soft)
  //    Desert light, terracotta, sun-bleached linen.
  // =====================================================
  {
    id: 'sand',
    name: 'Sand',
    description: 'Sun-bleached desert warmth with terracotta and linen softness',
    tags: ['light', 'warm'],

    background: 'bg-[#F8F3ED]',
    foreground: 'text-[#33261A]',
    primary: 'bg-[#B57A56]',
    primaryText: 'text-[#FDF9F5]',
    muted: 'bg-[#EFE7DC]',
    mutedText: 'text-[#96836E]',
    border: 'border-[#E2D6C6]',

    secondary: 'bg-[#E5D9CA]',
    secondaryText: 'text-[#33261A]',
    accent: 'bg-[#C4633A]',
    accentText: 'text-[#FDF9F5]',
    success: 'bg-[#7A8F5C]',
    warning: 'bg-[#C89040]',

    card: 'bg-[#FDF9F5]',
    cardForeground: 'text-[#33261A]',
    popover: 'bg-[#FDF9F5]',
    popoverForeground: 'text-[#33261A]',
    input: 'bg-[#F2EBE1]',
    ring: 'ring-[#B57A56]',

    placeholder: 'placeholder:text-[#BEA992]',
    caretColor: 'caret-[#C4633A]',

    cardStyle: 'bg-[#FDF9F5]/80 backdrop-blur-sm border border-[#E5D9CA] shadow-[0_2px_12px_rgba(51,38,26,0.06)]',
    glassPanel: 'bg-[#F8F3ED]/85 backdrop-blur-md border-b border-[#E2D6C6]/60',
    elementGlow: 'shadow-[0_0_24px_rgba(181,122,86,0.14)]',
    gradient: 'bg-gradient-to-r from-[#B57A56] to-[#C4633A]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-xl',
    shadow: 'shadow-[0_4px_20px_-2px_rgba(51,38,26,0.08)]',
    bgEffectColors: {
      primary: '#B57A56',
      secondary: '#C4633A',
      ray: '#ECDBC6',
      subtle: '#D8C8B2',
      highlight: '#FFF7EE',
      shadow: '#1A1008',
      accent2: '#C89040',
    },
  },

  // =====================================================
  // 6. NOIR  (Dark + Neutral / Pure B&W)
  //    Maximum contrast, zero color, raw typography.
  // =====================================================
  {
    id: 'noir',
    name: 'Noir',
    description: 'Pure black and white with maximum contrast and zero color',
    tags: ['dark', 'minimal'],

    background: 'bg-[#090909]',
    foreground: 'text-[#EBEBEB]',
    primary: 'bg-[#EBEBEB]',
    primaryText: 'text-[#090909]',
    muted: 'bg-[#161616]',
    mutedText: 'text-[#6E6E6E]',
    border: 'border-[#232323]',

    secondary: 'bg-[#1C1C1C]',
    secondaryText: 'text-[#D4D4D4]',
    accent: 'bg-[#A0A0A0]',
    accentText: 'text-[#090909]',
    success: 'bg-[#8A8A8A]',
    warning: 'bg-[#8A8A8A]',

    card: 'bg-[#0F0F0F]',
    cardForeground: 'text-[#E0E0E0]',
    popover: 'bg-[#161616]',
    popoverForeground: 'text-[#EBEBEB]',
    input: 'bg-[#0F0F0F]',
    ring: 'ring-[#4A4A4A]',

    placeholder: 'placeholder:text-[#4A4A4A]',
    caretColor: 'caret-[#EBEBEB]',

    cardStyle: 'bg-[#0F0F0F] border border-[#232323]',
    glassPanel: 'bg-[#090909]/85 backdrop-blur-md border-b border-[#232323]',
    elementGlow: 'shadow-[0_0_16px_rgba(235,235,235,0.06)]',
    gradient: 'bg-gradient-to-r from-[#EBEBEB] to-[#6E6E6E]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-widest',

    radiusMedium: 'rounded-none',
    shadow: 'shadow-none',
    bgEffectColors: {
      primary: '#FFFFFF',
      secondary: '#8A8A8A',
      ray: '#2A2A2A',
      subtle: '#1A1A1A',
      highlight: '#E8E8E8',
      shadow: '#000000',
      accent2: '#4A4A4A',
    },
  },

  // =====================================================
  // 7. SAGE  (Light + Natural)
  //    Botanical garden, green-gray, organic calm.
  // =====================================================
  {
    id: 'sage',
    name: 'Sage',
    description: 'Botanical calm with muted greens and organic warmth',
    tags: ['light', 'warm'],

    background: 'bg-[#F3F5F0]',
    foreground: 'text-[#2A2F24]',
    primary: 'bg-[#6B7F5E]',
    primaryText: 'text-[#F7F8F5]',
    muted: 'bg-[#E7ECE2]',
    mutedText: 'text-[#7D8A72]',
    border: 'border-[#D4DCC9]',

    secondary: 'bg-[#DAE0D0]',
    secondaryText: 'text-[#2A2F24]',
    accent: 'bg-[#8B6F4E]',
    accentText: 'text-[#F7F8F5]',
    success: 'bg-[#5E8A5E]',
    warning: 'bg-[#B89550]',

    card: 'bg-[#F9FAF7]',
    cardForeground: 'text-[#2A2F24]',
    popover: 'bg-[#F9FAF7]',
    popoverForeground: 'text-[#2A2F24]',
    input: 'bg-[#EDF0E8]',
    ring: 'ring-[#6B7F5E]',

    placeholder: 'placeholder:text-[#A3AE97]',
    caretColor: 'caret-[#8B6F4E]',

    cardStyle: 'bg-[#F9FAF7]/80 backdrop-blur-sm border border-[#DAE0D0] shadow-[0_2px_12px_rgba(42,47,36,0.05)]',
    glassPanel: 'bg-[#F3F5F0]/85 backdrop-blur-md border-b border-[#D4DCC9]/60',
    elementGlow: 'shadow-[0_0_22px_rgba(107,127,94,0.10)]',
    gradient: 'bg-gradient-to-r from-[#6B7F5E] to-[#8B6F4E]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-lg',
    shadow: 'shadow-[0_4px_16px_rgba(42,47,36,0.06)]',
    bgEffectColors: {
      primary: '#6B7F5E',
      secondary: '#8B6F4E',
      ray: '#D4DEC6',
      subtle: '#C2CCB4',
      highlight: '#F4F7EE',
      shadow: '#141810',
      accent2: '#A4B88C',
    },
  },

  // =====================================================
  // 8. DUSK  (Dark + Purple-Blue)
  //    Late twilight sky, deep indigo, starlight accents.
  // =====================================================
  {
    id: 'dusk',
    name: 'Dusk',
    description: 'Twilight sky depth with indigo richness and starlight accents',
    tags: ['dark', 'cool'],

    background: 'bg-[#0E0C16]',
    foreground: 'text-[#D4D0E4]',
    primary: 'bg-[#8878B8]',
    primaryText: 'text-[#F4F2FA]',
    muted: 'bg-[#16131F]',
    mutedText: 'text-[#7A7294]',
    border: 'border-[#221E30]',

    secondary: 'bg-[#1E1A2C]',
    secondaryText: 'text-[#C4BED8]',
    accent: 'bg-[#A88FD0]',
    accentText: 'text-[#0E0C16]',
    success: 'bg-[#6E9B88]',
    warning: 'bg-[#C4A05A]',

    card: 'bg-[#121018]',
    cardForeground: 'text-[#CCC6E0]',
    popover: 'bg-[#16131F]',
    popoverForeground: 'text-[#D4D0E4]',
    input: 'bg-[#121018]',
    ring: 'ring-[#8878B8]',

    placeholder: 'placeholder:text-[#504868]',
    caretColor: 'caret-[#A88FD0]',

    cardStyle: 'bg-[#121018]/80 backdrop-blur-md border border-[#221E30] shadow-[0_4px_24px_rgba(0,0,0,0.4)]',
    glassPanel: 'bg-[#0E0C16]/75 backdrop-blur-xl border-b border-[#221E30]/60',
    elementGlow: 'shadow-[0_0_28px_rgba(136,120,184,0.12)]',
    gradient: 'bg-gradient-to-r from-[#8878B8] to-[#A88FD0]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-xl',
    shadow: 'shadow-[0_8px_32px_-4px_rgba(0,0,0,0.5)]',
    bgEffectColors: {
      primary: '#8878B8',
      secondary: '#A88FD0',
      ray: '#2A2440',
      subtle: '#221E30',
      highlight: '#E4DCF4',
      shadow: '#060410',
      accent2: '#6E8BC4',
    },
  },

  // =====================================================
  // 9. PORCELAIN  (Light + Cool + Soft)
  //    Delicate ceramic, blush-gray, quiet refinement.
  // =====================================================
  {
    id: 'porcelain',
    name: 'Porcelain',
    description: 'Delicate ceramic softness with blush-gray quiet refinement',
    tags: ['light', 'warm'],

    background: 'bg-[#F6F4F5]',
    foreground: 'text-[#2D262A]',
    primary: 'bg-[#9B7E8A]',
    primaryText: 'text-[#FAF8F9]',
    muted: 'bg-[#EDEAEB]',
    mutedText: 'text-[#92848B]',
    border: 'border-[#DED8DA]',

    secondary: 'bg-[#E4DDE0]',
    secondaryText: 'text-[#2D262A]',
    accent: 'bg-[#B07580]',
    accentText: 'text-[#FAF8F9]',
    success: 'bg-[#6E957E]',
    warning: 'bg-[#C09860]',

    card: 'bg-[#FBFAFB]',
    cardForeground: 'text-[#2D262A]',
    popover: 'bg-[#FBFAFB]',
    popoverForeground: 'text-[#2D262A]',
    input: 'bg-[#F0EDEE]',
    ring: 'ring-[#9B7E8A]',

    placeholder: 'placeholder:text-[#B8AEB2]',
    caretColor: 'caret-[#B07580]',

    cardStyle: 'bg-[#FBFAFB]/80 backdrop-blur-sm border border-[#E4DDE0] shadow-[0_2px_12px_rgba(45,38,42,0.04)]',
    glassPanel: 'bg-[#F6F4F5]/85 backdrop-blur-md border-b border-[#DED8DA]/60',
    elementGlow: 'shadow-[0_0_22px_rgba(155,126,138,0.10)]',
    gradient: 'bg-gradient-to-r from-[#9B7E8A] to-[#B07580]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-xl',
    shadow: 'shadow-[0_4px_16px_rgba(45,38,42,0.05)]',
    bgEffectColors: {
      primary: '#9B7E8A',
      secondary: '#B07580',
      ray: '#DFD0D6',
      subtle: '#D0C4C8',
      highlight: '#FAF4F6',
      shadow: '#1A1418',
      accent2: '#C4A0AA',
    },
  },

  // =====================================================
  // 10. CARBON  (Dark + Neutral-Warm)
  //     Matte graphite, warm gray, quiet luxury.
  // =====================================================
  {
    id: 'carbon',
    name: 'Carbon',
    description: 'Matte graphite surface with warm gray tones and quiet luxury',
    tags: ['dark', 'minimal'],

    background: 'bg-[#111111]',
    foreground: 'text-[#DDDAD6]',
    primary: 'bg-[#A39888]',
    primaryText: 'text-[#111111]',
    muted: 'bg-[#1A1918]',
    mutedText: 'text-[#777269]',
    border: 'border-[#282624]',

    secondary: 'bg-[#222120]',
    secondaryText: 'text-[#C8C2B8]',
    accent: 'bg-[#B8A080]',
    accentText: 'text-[#111111]',
    success: 'bg-[#7A9670]',
    warning: 'bg-[#C4A04A]',

    card: 'bg-[#161514]',
    cardForeground: 'text-[#D4D0C8]',
    popover: 'bg-[#1A1918]',
    popoverForeground: 'text-[#DDDAD6]',
    input: 'bg-[#161514]',
    ring: 'ring-[#A39888]',

    placeholder: 'placeholder:text-[#555048]',
    caretColor: 'caret-[#B8A080]',

    cardStyle: 'bg-[#161514]/80 backdrop-blur-md border border-[#282624] shadow-[0_4px_24px_rgba(0,0,0,0.35)]',
    glassPanel: 'bg-[#111111]/80 backdrop-blur-xl border-b border-[#282624]/60',
    elementGlow: 'shadow-[0_0_24px_rgba(163,152,136,0.10)]',
    gradient: 'bg-gradient-to-r from-[#A39888] to-[#B8A080]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-wide',

    radiusMedium: 'rounded-md',
    shadow: 'shadow-[0_8px_32px_-4px_rgba(0,0,0,0.45)]',
    bgEffectColors: {
      primary: '#A39888',
      secondary: '#B8A080',
      ray: '#302A22',
      subtle: '#282624',
      highlight: '#E8E2D8',
      shadow: '#060606',
      accent2: '#8A9498',
    },
  },


  // =====================================================
  // 11. NEON  (Dark + Cyberpunk)
  //     Electric accents on void black, futuristic edge.
  // =====================================================
  {
    id: 'neon',
    name: 'Neon',
    description: 'Electric cyberpunk with vibrant accents on void black',
    tags: ['dark', 'cool', 'vibrant'],

    background: 'bg-[#0A0A0F]',
    foreground: 'text-[#E0E8F0]',
    primary: 'bg-[#00F5FF]',
    primaryText: 'text-[#0A0A0F]',
    muted: 'bg-[#12121A]',
    mutedText: 'text-[#6B7280]',
    border: 'border-[#1E1E2E]',

    secondary: 'bg-[#1A1A28]',
    secondaryText: 'text-[#C8D0DC]',
    accent: 'bg-[#FF2D92]',
    accentText: 'text-[#FFFFFF]',
    success: 'bg-[#00FF88]',
    warning: 'bg-[#FFB800]',

    card: 'bg-[#0E0E16]',
    cardForeground: 'text-[#D8E0EC]',
    popover: 'bg-[#12121A]',
    popoverForeground: 'text-[#E0E8F0]',
    input: 'bg-[#0E0E16]',
    ring: 'ring-[#00F5FF]',

    placeholder: 'placeholder:text-[#4A5060]',
    caretColor: 'caret-[#FF2D92]',

    cardStyle: 'bg-[#0E0E16]/90 backdrop-blur-md border border-[#1E1E2E] shadow-[0_0_30px_rgba(0,245,255,0.08)]',
    glassPanel: 'bg-[#0A0A0F]/80 backdrop-blur-xl border-b border-[#00F5FF]/20',
    elementGlow: 'shadow-[0_0_40px_rgba(0,245,255,0.25)]',
    gradient: 'bg-gradient-to-r from-[#00F5FF] via-[#7B61FF] to-[#FF2D92]',

    fontTitle: 'font-mono',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-lg',
    shadow: 'shadow-[0_8px_32px_-4px_rgba(0,245,255,0.15)]',
    bgEffectColors: {
      primary: '#00F5FF',
      secondary: '#FF2D92',
      ray: '#1A2A40',
      subtle: '#1E1E2E',
      highlight: '#E0FFFF',
      shadow: '#000008',
      accent2: '#7B61FF',
    },
  },

  // =====================================================
  // 12. OCEAN  (Dark + Deep Blue)
  //     Abyssal depths, bioluminescent glow, premium SaaS.
  // =====================================================
  {
    id: 'ocean',
    name: 'Ocean',
    description: 'Deep abyssal blue with bioluminescent accents for premium SaaS',
    tags: ['dark', 'cool'],

    background: 'bg-[#0D1B2A]',
    foreground: 'text-[#D8E4EE]',
    primary: 'bg-[#1B9AAA]',
    primaryText: 'text-[#F0F8FF]',
    muted: 'bg-[#142536]',
    mutedText: 'text-[#6A8FA8]',
    border: 'border-[#1E3448]',

    secondary: 'bg-[#1A3040]',
    secondaryText: 'text-[#C4D6E4]',
    accent: 'bg-[#EF6F6C]',
    accentText: 'text-[#FFFFFF]',
    success: 'bg-[#3EB489]',
    warning: 'bg-[#F4A261]',

    card: 'bg-[#102030]',
    cardForeground: 'text-[#D0E0F0]',
    popover: 'bg-[#142536]',
    popoverForeground: 'text-[#D8E4EE]',
    input: 'bg-[#102030]',
    ring: 'ring-[#1B9AAA]',

    placeholder: 'placeholder:text-[#4A6A84]',
    caretColor: 'caret-[#EF6F6C]',

    cardStyle: 'bg-[#102030]/85 backdrop-blur-md border border-[#1E3448] shadow-[0_4px_28px_rgba(0,0,0,0.4)]',
    glassPanel: 'bg-[#0D1B2A]/80 backdrop-blur-xl border-b border-[#1B9AAA]/20',
    elementGlow: 'shadow-[0_0_32px_rgba(27,154,170,0.18)]',
    gradient: 'bg-gradient-to-r from-[#1B9AAA] to-[#3EB489]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-xl',
    shadow: 'shadow-[0_8px_40px_-4px_rgba(0,0,0,0.5)]',
    bgEffectColors: {
      primary: '#1B9AAA',
      secondary: '#3EB489',
      ray: '#1E4060',
      subtle: '#1E3448',
      highlight: '#D0F0FF',
      shadow: '#040A10',
      accent2: '#EF6F6C',
    },
  },

  // =====================================================
  // 13. MINT  (Light + Cool Green)
  //     Fresh and clean, health/fintech vibes.
  // =====================================================
  {
    id: 'mint',
    name: 'Mint',
    description: 'Fresh mint clarity for health, wellness, and fintech',
    tags: ['light', 'cool'],

    background: 'bg-[#F0FDF4]',
    foreground: 'text-[#14352A]',
    primary: 'bg-[#10B981]',
    primaryText: 'text-[#FFFFFF]',
    muted: 'bg-[#E0F5EA]',
    mutedText: 'text-[#4A7A68]',
    border: 'border-[#C8ECD8]',

    secondary: 'bg-[#D1FAE5]',
    secondaryText: 'text-[#14352A]',
    accent: 'bg-[#064E3B]',
    accentText: 'text-[#ECFDF5]',
    success: 'bg-[#059669]',
    warning: 'bg-[#D97706]',

    card: 'bg-[#F8FDFB]',
    cardForeground: 'text-[#14352A]',
    popover: 'bg-[#F8FDFB]',
    popoverForeground: 'text-[#14352A]',
    input: 'bg-[#E8F8F0]',
    ring: 'ring-[#10B981]',

    placeholder: 'placeholder:text-[#7FB8A0]',
    caretColor: 'caret-[#064E3B]',

    cardStyle: 'bg-[#F8FDFB]/85 backdrop-blur-sm border border-[#D1FAE5] shadow-[0_2px_14px_rgba(20,53,42,0.05)]',
    glassPanel: 'bg-[#F0FDF4]/85 backdrop-blur-md border-b border-[#C8ECD8]/70',
    elementGlow: 'shadow-[0_0_26px_rgba(16,185,129,0.14)]',
    gradient: 'bg-gradient-to-r from-[#10B981] to-[#059669]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-xl',
    shadow: 'shadow-[0_4px_18px_rgba(20,53,42,0.06)]',
    bgEffectColors: {
      primary: '#10B981',
      secondary: '#059669',
      ray: '#A7F3D0',
      subtle: '#C8ECD8',
      highlight: '#ECFDF5',
      shadow: '#0A1A14',
      accent2: '#6EE7B7',
    },
  },

  // =====================================================
  // 14. AURORA  (Dark + Multi-color Gradient)
  //     Northern lights, AI/creative products.
  // =====================================================
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Northern lights gradient for AI and creative products',
    tags: ['dark', 'cool', 'vibrant'],

    background: 'bg-[#0F0F1A]',
    foreground: 'text-[#E4E8F0]',
    primary: 'bg-[#7C3AED]',
    primaryText: 'text-[#FFFFFF]',
    muted: 'bg-[#161625]',
    mutedText: 'text-[#7A7E94]',
    border: 'border-[#252540]',

    secondary: 'bg-[#1E1E35]',
    secondaryText: 'text-[#C8CCE0]',
    accent: 'bg-[#06B6D4]',
    accentText: 'text-[#0F0F1A]',
    success: 'bg-[#10B981]',
    warning: 'bg-[#F59E0B]',

    card: 'bg-[#14141F]',
    cardForeground: 'text-[#DDE0EC]',
    popover: 'bg-[#161625]',
    popoverForeground: 'text-[#E4E8F0]',
    input: 'bg-[#14141F]',
    ring: 'ring-[#7C3AED]',

    placeholder: 'placeholder:text-[#5A5E74]',
    caretColor: 'caret-[#06B6D4]',

    cardStyle: 'bg-[#14141F]/85 backdrop-blur-md border border-[#252540] shadow-[0_4px_32px_rgba(124,58,237,0.08)]',
    glassPanel: 'bg-[#0F0F1A]/80 backdrop-blur-xl border-b border-[#7C3AED]/15',
    elementGlow: 'shadow-[0_0_40px_rgba(124,58,237,0.20)]',
    gradient: 'bg-gradient-to-r from-[#7C3AED] via-[#06B6D4] to-[#10B981]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-2xl',
    shadow: 'shadow-[0_8px_48px_-4px_rgba(124,58,237,0.18)]',
    bgEffectColors: {
      primary: '#7C3AED',
      secondary: '#06B6D4',
      ray: '#2A2050',
      subtle: '#252540',
      highlight: '#DDD6FE',
      shadow: '#08080E',
      accent2: '#10B981',
    },
  },

  // =====================================================
  // 15. CORAL  (Light + Warm Peach)
  //     Sunset vibes, lifestyle/beauty.
  // =====================================================
  {
    id: 'coral',
    name: 'Coral',
    description: 'Warm coral sunset for lifestyle and beauty brands',
    tags: ['light', 'warm', 'vibrant'],

    background: 'bg-[#FFF5F5]',
    foreground: 'text-[#3D1F1F]',
    primary: 'bg-[#FF6B6B]',
    primaryText: 'text-[#FFFFFF]',
    muted: 'bg-[#FFE8E8]',
    mutedText: 'text-[#A05050]',
    border: 'border-[#FFD4D4]',

    secondary: 'bg-[#FFDADA]',
    secondaryText: 'text-[#3D1F1F]',
    accent: 'bg-[#F59E0B]',
    accentText: 'text-[#FFFFFF]',
    success: 'bg-[#34D399]',
    warning: 'bg-[#FBBF24]',

    card: 'bg-[#FFFAFA]',
    cardForeground: 'text-[#3D1F1F]',
    popover: 'bg-[#FFFAFA]',
    popoverForeground: 'text-[#3D1F1F]',
    input: 'bg-[#FFEEEE]',
    ring: 'ring-[#FF6B6B]',

    placeholder: 'placeholder:text-[#D08080]',
    caretColor: 'caret-[#F59E0B]',

    cardStyle: 'bg-[#FFFAFA]/85 backdrop-blur-sm border border-[#FFDADA] shadow-[0_2px_14px_rgba(61,31,31,0.05)]',
    glassPanel: 'bg-[#FFF5F5]/85 backdrop-blur-md border-b border-[#FFD4D4]/70',
    elementGlow: 'shadow-[0_0_26px_rgba(255,107,107,0.16)]',
    gradient: 'bg-gradient-to-r from-[#FF6B6B] to-[#F59E0B]',

    fontTitle: 'font-serif',
    fontBody: 'font-sans',
    lineHeight: 'leading-relaxed',
    letterSpacing: 'tracking-normal',

    radiusMedium: 'rounded-2xl',
    shadow: 'shadow-[0_4px_20px_rgba(255,107,107,0.10)]',
    bgEffectColors: {
      primary: '#FF6B6B',
      secondary: '#F59E0B',
      ray: '#FFB8B8',
      subtle: '#FFD4D4',
      highlight: '#FFF0F0',
      shadow: '#1A0808',
      accent2: '#FB923C',
    },
  },

  // =====================================================
  // 16. SLATE  (Light + Neutral Cool)
  //     Modern B2B SaaS, professional and clean.
  // =====================================================
  {
    id: 'slate',
    name: 'Slate',
    description: 'Modern B2B SaaS with professional slate-blue tones',
    tags: ['light', 'cool', 'minimal'],

    background: 'bg-[#F8FAFC]',
    foreground: 'text-[#1E293B]',
    primary: 'bg-[#475569]',
    primaryText: 'text-[#F8FAFC]',
    muted: 'bg-[#F1F5F9]',
    mutedText: 'text-[#64748B]',
    border: 'border-[#E2E8F0]',

    secondary: 'bg-[#E2E8F0]',
    secondaryText: 'text-[#1E293B]',
    accent: 'bg-[#6366F1]',
    accentText: 'text-[#FFFFFF]',
    success: 'bg-[#22C55E]',
    warning: 'bg-[#F59E0B]',

    card: 'bg-[#FFFFFF]',
    cardForeground: 'text-[#1E293B]',
    popover: 'bg-[#FFFFFF]',
    popoverForeground: 'text-[#1E293B]',
    input: 'bg-[#F1F5F9]',
    ring: 'ring-[#6366F1]',

    placeholder: 'placeholder:text-[#94A3B8]',
    caretColor: 'caret-[#6366F1]',

    cardStyle: 'bg-[#FFFFFF]/90 backdrop-blur-sm border border-[#E2E8F0] shadow-[0_1px_3px_rgba(0,0,0,0.05)]',
    glassPanel: 'bg-[#F8FAFC]/90 backdrop-blur-md border-b border-[#E2E8F0]',
    elementGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.12)]',
    gradient: 'bg-gradient-to-r from-[#475569] to-[#6366F1]',

    fontTitle: 'font-sans',
    fontBody: 'font-sans',
    lineHeight: 'leading-normal',
    letterSpacing: 'tracking-tight',

    radiusMedium: 'rounded-lg',
    shadow: 'shadow-[0_4px_12px_rgba(0,0,0,0.05)]',
    bgEffectColors: {
      primary: '#475569',
      secondary: '#6366F1',
      ray: '#CBD5E1',
      subtle: '#E2E8F0',
      highlight: '#F1F5F9',
      shadow: '#0F172A',
      accent2: '#818CF8',
    },
  },
]

export const themes: ThemeConfig[] = rawThemes.map((theme) => ({
  ...theme,
  nameKey: theme.nameKey ?? `editor.paletteLabels.themes.${theme.id}`,
  descriptionKey: theme.descriptionKey ?? `editor.paletteLabels.themeDescriptions.${theme.id}`,
}))

export const getTheme = (id: string): ThemeConfig => {
  return themes.find(t => t.id === id) || themes[0]
}
