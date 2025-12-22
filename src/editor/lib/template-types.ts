import type { ThemeConfig } from '@/editor/lib/themes'
import type { 
  FrameStyle, 
  SectionContent, 
  SectionVisibility,
  PhotobookSectionContent,
  PhotobookSectionVisibility
} from '@/editor/lib/types'

export interface PortfolioTemplateProps {
  theme: ThemeConfig
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  frameStyle: FrameStyle
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
}

export interface PhotobookTemplateProps {
  theme: ThemeConfig
  sectionVisibility: PhotobookSectionVisibility
  sectionContent: PhotobookSectionContent
  frameStyle: FrameStyle
}
