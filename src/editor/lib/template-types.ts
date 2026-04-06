import type { ThemeConfig } from '@/editor/lib/themes'
import type {
  SectionContent,
  SectionVisibility,
  PhotobookSectionContent,
  PhotobookSectionVisibility,
} from '@/editor/lib/types'

/** Shared base — fields present in every template regardless of mode. */
export interface BaseTemplateProps {
  theme: ThemeConfig
}

export interface PortfolioTemplateProps extends BaseTemplateProps {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  /** Set to true to disable all animations (used in editor preview). */
  disableAnimations?: boolean
}

export interface PhotobookTemplateProps extends BaseTemplateProps {
  sectionVisibility: PhotobookSectionVisibility
  sectionContent: PhotobookSectionContent
}
