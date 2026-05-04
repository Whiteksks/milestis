"use client"

import type { ComponentType } from "react"
import type { LucideIcon } from "lucide-react"
import { AlignLeft, Calendar, Image as ImageIcon, MapPin, PenLine, Type } from "lucide-react"

import { CoverImagePanel, CoverMetadataPanel, CoverTextPanel } from "@/editor/components/editor/section-settings/photobook/cover-panels"
import { IntroductionImagePanel, IntroductionTextPanel } from "@/editor/components/editor/section-settings/photobook/introduction-panels"
import { StoryHeaderPanel, StoryImagePanel } from "@/editor/components/editor/section-settings/photobook/story-panels"
import { GalleryHeaderPanel, GalleryImagesPanel } from "@/editor/components/editor/section-settings/photobook/gallery-panels"
import { HighlightImagePanel, HighlightTextPanel } from "@/editor/components/editor/section-settings/photobook/highlight-panels"
import { EndingImagePanel, EndingMessagePanel, EndingSignaturePanel } from "@/editor/components/editor/section-settings/photobook/ending-panels"

export interface PhotobookSectionQuickAction {
  id: string
  title: string
  Icon: LucideIcon
  Panel: ComponentType<{ dense?: boolean }>
}

const ACTIONS_BY_SECTION: Partial<Record<string, PhotobookSectionQuickAction[]>> = {
  cover: [
    { id: "cover.text", title: "Cover text", Icon: Type, Panel: CoverTextPanel },
    { id: "cover.meta", title: "Date & location", Icon: Calendar, Panel: CoverMetadataPanel },
    { id: "cover.image", title: "Cover image", Icon: ImageIcon, Panel: CoverImagePanel },
  ],
  introduction: [
    { id: "intro.text", title: "Intro text", Icon: AlignLeft, Panel: IntroductionTextPanel },
    { id: "intro.image", title: "Main image", Icon: ImageIcon, Panel: IntroductionImagePanel },
  ],
  story: [
    { id: "story.header", title: "Header", Icon: MapPin, Panel: StoryHeaderPanel },
    { id: "story.image", title: "Photo", Icon: ImageIcon, Panel: StoryImagePanel },
  ],
  gallery: [
    { id: "gallery.header", title: "Header", Icon: Type, Panel: GalleryHeaderPanel },
    { id: "gallery.photos", title: "Photos", Icon: ImageIcon, Panel: GalleryImagesPanel },
  ],
  highlight: [
    { id: "highlight.text", title: "Text", Icon: AlignLeft, Panel: HighlightTextPanel },
    { id: "highlight.image", title: "Image", Icon: ImageIcon, Panel: HighlightImagePanel },
  ],
  ending: [
    { id: "ending.message", title: "Message", Icon: AlignLeft, Panel: EndingMessagePanel },
    { id: "ending.signature", title: "Signature", Icon: PenLine, Panel: EndingSignaturePanel },
    { id: "ending.image", title: "Image", Icon: ImageIcon, Panel: EndingImagePanel },
  ],
}

export function getPhotobookQuickActions(sectionId: string): PhotobookSectionQuickAction[] {
  return ACTIONS_BY_SECTION[sectionId] ?? []
}
