"use client"

import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import {
  AlignLeft,
  Award,
  Copyright,
  FolderKanban,
  Link,
  List,
  Mail,
  Navigation,
  Plus,
  Share2,
  Type,
  Video,
  Image as ImageIcon,
} from "lucide-react"

import { BioAchievementsPanel, BioBiographyPanel, BioPhotoPanel, BioTitlePanel } from "@/editor/components/editor/section-settings/portfolio/bio-panels"
import { ContactDetailsPanel, ContactHeadingPanel } from "@/editor/components/editor/section-settings/portfolio/contact-panels"
import { FeaturedWorkHeaderPanel, FeaturedWorkProjectsPanel } from "@/editor/components/editor/section-settings/portfolio/featured-work-panels"
import { FooterCopyrightPanel, FooterSocialLinksPanel } from "@/editor/components/editor/section-settings/portfolio/footer-panels"
import { HeaderBrandPanel, HeaderLinksPanel } from "@/editor/components/editor/section-settings/portfolio/header-panels"
import { HeroDescriptionPanel, HeroTitlePanel } from "@/editor/components/editor/section-settings/portfolio/hero-panels"
import { VideoHeaderPanel, VideoUrlPanel } from "@/editor/components/editor/section-settings/portfolio/video-panels"

export type PortfolioSectionQuickActionId =
  | "bio.title"
  | "bio.photo"
  | "bio.bio"
  | "bio.achievements"
  | "contact.heading"
  | "contact.details"
  | "featuredWork.header"
  | "featuredWork.add"
  | "featuredWork.project"
  | "footer.copyright"
  | "footer.social"
  | "header.brand"
  | "header.links"
  | "hero.title"
  | "hero.description"
  | "video.header"
  | "video.url"

export interface PortfolioSectionQuickAction {
  id: PortfolioSectionQuickActionId
  title: string
  Icon: LucideIcon
  Panel: ComponentType<{ dense?: boolean }>
}

const ACTIONS_BY_SECTION: Partial<Record<string, PortfolioSectionQuickAction[]>> = {
  header: [
    { id: "header.brand", title: "Brand", Icon: Navigation, Panel: HeaderBrandPanel },
    { id: "header.links", title: "Menu links", Icon: List, Panel: HeaderLinksPanel },
  ],
  bio: [
    { id: "bio.title", title: "Edit title", Icon: Type, Panel: BioTitlePanel },
    { id: "bio.photo", title: "Edit photo", Icon: ImageIcon, Panel: BioPhotoPanel },
    { id: "bio.bio", title: "Edit bio text", Icon: AlignLeft, Panel: BioBiographyPanel },
    { id: "bio.achievements", title: "Achievements", Icon: Award, Panel: BioAchievementsPanel },
  ],
  hero: [
    { id: "hero.title", title: "Edit title", Icon: Type, Panel: HeroTitlePanel },
    { id: "hero.description", title: "Edit description", Icon: AlignLeft, Panel: HeroDescriptionPanel },
  ],
  featuredWork: [
    { id: "featuredWork.header", title: "Header", Icon: Type, Panel: FeaturedWorkHeaderPanel },
    { id: "featuredWork.project", title: "Edit project", Icon: FolderKanban, Panel: FeaturedWorkProjectsPanel },
  ],
  video: [
    { id: "video.header", title: "Header", Icon: Video, Panel: VideoHeaderPanel },
    { id: "video.url", title: "YouTube URL", Icon: Link, Panel: VideoUrlPanel },
  ],
  contact: [
    { id: "contact.heading", title: "Heading", Icon: Type, Panel: ContactHeadingPanel },
    { id: "contact.details", title: "Email / phone", Icon: Mail, Panel: ContactDetailsPanel },
  ],
  footer: [
    { id: "footer.copyright", title: "Copyright", Icon: Copyright, Panel: FooterCopyrightPanel },
    { id: "footer.social", title: "Social links", Icon: Share2, Panel: FooterSocialLinksPanel },
  ],
}

export function getPortfolioQuickActions(sectionId: string): PortfolioSectionQuickAction[] {
  return ACTIONS_BY_SECTION[sectionId] ?? []
}
