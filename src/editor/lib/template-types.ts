import type { ThemeConfig } from '@/editor/lib/config/themes'
import type {
  SectionContent,
  SectionVisibility,
  PhotobookSectionContent,
  PhotobookSectionVisibility,
} from '@/editor/lib/types'
import type { PortfolioImageContent } from '@/editor/modes/portfolio/image/content'
import type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
import type { EventGuestPhoto } from '@/editor/modes/event/content-types'

/** Shared base — fields present in every template regardless of mode. */
export interface BaseTemplateProps {
  theme: ThemeConfig
}

export interface PortfolioTemplateProps extends BaseTemplateProps {
  sectionVisibility: SectionVisibility
  sectionContent: SectionContent
  imageContent?: PortfolioImageContent
  handleAnchorClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void
  /** Set to true to disable all animations (used in editor preview). */
  disableAnimations?: boolean
}

export interface PhotobookTemplateProps extends BaseTemplateProps {
  sectionVisibility: PhotobookSectionVisibility
  sectionContent: PhotobookSectionContent
  /** New image system data — used by migrated sections alongside sectionContent. */
  imageContent?: PhotobookImageContent
  /** Set to true to disable all animations (used in editor preview). */
  disableAnimations?: boolean
}

export interface EventTemplateProps extends BaseTemplateProps {
  /** Approved guest photos — loaded live from Firestore, not from editor content. */
  eventPhotos: EventGuestPhoto[]
  /** Set to true to disable all animations (used in editor preview). */
  disableAnimations?: boolean
}
