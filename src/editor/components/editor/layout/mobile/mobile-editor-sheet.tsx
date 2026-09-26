"use client"

import { memo, useState, useCallback, useEffect, useMemo, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import { useTranslations } from "next-intl"
import { Layers, Paintbrush, Wand2, Sparkles, LayoutTemplate, HelpCircle, Type, Heart } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUiSelector } from "@/editor/lib/store"
import { useUiStore } from "@/editor/lib/store/ui"
import { useAiBriefStore } from "@/editor/lib/store/ai-brief"
import { MODE_REGISTRY } from "@/editor/lib/modes"
import type { MobileEditorTab, MobileAppearanceSubTab } from "@/editor/lib/config/editor-tabs"
import { isModeEditorTabAvailable } from '@/editor/lib/config/editor-tabs'
import { MenuMascotSettingsPanel } from '@/editor/modes/menu/mascot/settings-panel'

import { MobileSnapSheet, type MobileSnapSheetRenderProps } from "./mobile-snap-sheet"
import { SectionsSheetActions } from "./sheet-actions/sections-sheet-actions"
import { ThemeSheetActions } from "./sheet-actions/theme-sheet-actions"
import { DecorationsSheetActions } from "./sheet-actions/decorations-sheet-actions"
import { SettingsContent } from "./settings-content"
import { ThemeSettingsPanel } from "../sidebar/theme-settings-panel"
import { DecorationsSettingsPanel } from "../sidebar/decorations-settings-panel"
import { MenuTypographyPanel } from "../sidebar/menu-typography-panel"

// ─── Constants ────────────────────────────────────────────────────────────────

const SNAP_NAV_INDEX = 0
const SNAP_NAV_HEIGHT = 68
const SNAP_ACTIONS_HEIGHT = 132
const SNAP_FULL_HEIGHT_RATIO = 0.9
const FULL_SNAP_INDEX = 2

const CONTENT_FADE = { duration: 0.16, ease: "linear" } as const
const PANEL_SWITCH_FADE = { duration: 0.14, ease: "easeOut" } as const

type TabDef = { id: MobileEditorTab; icon: React.ElementType; label: string }

// Labels come from the editor.layout.mobile namespace — key names match tab ids 1:1.
// "appearance" merges background+decorations behind an internal sub-tab switcher; "ai" opens the AI chat modal.
const ALL_TAB_ICONS: { id: MobileEditorTab; icon: React.ElementType }[] = [
  { id: "sections",    icon: Layers        },
  { id: "appearance",  icon: Paintbrush    },
  { id: "fonts",       icon: Type          },
  { id: "mascot",      icon: Heart         },
  { id: "design",      icon: LayoutTemplate },
  { id: "ai",          icon: Sparkles      },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type SheetMode = "nav" | "actions" | "full"

interface MobileEditorSheetProps {
  activeTab: MobileEditorTab
  onTabChange: (tab: MobileEditorTab) => void
  onAppearanceSubTabChange?: (subTab: MobileAppearanceSubTab) => void
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function resolveViewportHeight() {
  if (typeof window === "undefined") return 0
  return Math.round(window.visualViewport?.height ?? window.innerHeight)
}

function useViewportHeight() {
  const [height, setHeight] = useState(0)

  useEffect(() => {
    let frameId: number | null = null

    const sync = () => {
      const nextHeight = resolveViewportHeight()
      setHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight))
    }
    const schedule = () => {
      if (frameId !== null) return
      frameId = requestAnimationFrame(() => { frameId = null; sync() })
    }

    sync()

    const vv = window.visualViewport
    window.addEventListener("resize", schedule)
    window.addEventListener("orientationchange", schedule)
    vv?.addEventListener("resize", schedule)

    return () => {
      window.removeEventListener("resize", schedule)
      window.removeEventListener("orientationchange", schedule)
      vv?.removeEventListener("resize", schedule)
      if (frameId !== null) cancelAnimationFrame(frameId)
    }
  }, [])

  return height
}

function resolveSheetMode(snapIndex: number, fullSnapIndex: number): SheetMode {
  if (snapIndex <= SNAP_NAV_INDEX) return "nav"
  if (snapIndex >= fullSnapIndex) return "full"
  return "actions"
}

/**
 * Resolves which snap to jump to when a tab is pressed:
 * - At nav → always step up one level
 * - At actions/full and pressing the same tab → step up one level
 * - Switching to a different tab → stay at current snap
 */
function resolveNextSnapIndex(
  currentIndex: number,
  currentTab: MobileEditorTab,
  nextTab: MobileEditorTab,
  fullIndex: number,
): number {
  const stepped = Math.min(currentIndex + 1, fullIndex)
  if (currentIndex === SNAP_NAV_INDEX) return stepped
  if (currentIndex < fullIndex && nextTab === currentTab) return stepped
  return currentIndex
}

function renderActions(
  tab: MobileEditorTab,
  appearanceSubTab: MobileAppearanceSubTab,
  scrollContainerRef: React.RefObject<HTMLDivElement | null>,
): ReactNode {
  switch (tab) {
    case "sections":   return <SectionsSheetActions />
    case "appearance": return appearanceSubTab === "background"
      ? <ThemeSheetActions />
      : <DecorationsSheetActions scrollContainerRef={scrollContainerRef} />
    case "fonts": return <FontSheetActions />
    default:           return null
  }
}

function FontSheetActions() {
  const t = useTranslations('editor.menu.typography')
  return <div className="flex items-center gap-3 px-5 py-3 text-sm text-muted-foreground"><Type className="size-4 shrink-0" />{t('hint')}</div>
}

function renderPanel(tab: MobileEditorTab, appearanceSubTab: MobileAppearanceSubTab): ReactNode {
  switch (tab) {
    case "sections":   return <SettingsContent />
    case "appearance": return appearanceSubTab === "background"
      ? <ThemeSettingsPanel />
      : <DecorationsSettingsPanel />
    case "fonts": return <MenuTypographyPanel />
    case "mascot": return <MenuMascotSettingsPanel />
    default:           return null
  }
}

// Pill switcher between the two panels merged into the "appearance" tab.
function AppearanceSubTabSwitcher({
  value,
  onChange,
  labels,
}: {
  value: MobileAppearanceSubTab
  onChange: (subTab: MobileAppearanceSubTab) => void
  labels: Record<MobileAppearanceSubTab, string>
}) {
  return (
    <div className="shrink-0 flex gap-1 px-3 pt-2 pb-1.5 border-b border-border/30">
      {(["background", "decorations"] as const).map((id) => {
        const Icon = id === "background" ? Paintbrush : Wand2
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={cn(
              "flex-1 h-8 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors",
              value === id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {labels[id]}
          </button>
        )
      })}
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const SheetNav = memo(function SheetNav({
  activeTab,
  onTabPress,
  dragHandleProps,
  tabs,
  aiUnread,
  onHelpPress,
  helpLabel,
}: {
  activeTab: MobileEditorTab
  onTabPress: (tab: MobileEditorTab) => void
  dragHandleProps: MobileSnapSheetRenderProps["dragHandleProps"]
  tabs: TabDef[]
  aiUnread: boolean
  onHelpPress: () => void
  helpLabel: string
}) {
  return (
    // Entire nav area is the drag surface — tabs stop propagation individually
    <div
      {...dragHandleProps}
      className="relative shrink-0 select-none touch-none cursor-grab active:cursor-grabbing"
      aria-label="Editor sheet navigation"
    >
      {/* Handle pill — help icon shares this thin top strip so it doesn't crowd the tab row below */}
      <div className="relative flex h-5 items-center justify-center pt-2.5 pb-0">
        <div className="w-10 h-1 rounded-full bg-foreground/20" />
        <button
          type="button"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); onHelpPress() }}
          aria-label={helpLabel}
          title={helpLabel}
          className="absolute right-3 -top-0.5 flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:text-foreground transition-colors"
        >
          <HelpCircle className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Tab bar */}
      <div
        className="mb-2 shrink-0 grid h-12 pb-2 items-center justify-items-center"
        style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
      >
        {tabs.map((tab) => {
          const isAi = tab.id === "ai"
          return (
            <button
              key={tab.id}
              aria-label={tab.label}
              aria-current={activeTab === tab.id ? "page" : undefined}
              // Block the drag from starting when the finger lands on a tab button
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.currentTarget.blur(); onTabPress(tab.id) }}
              className={cn(
                "relative touch-auto cursor-pointer min-w-0 w-full h-full px-1 flex flex-col items-center justify-center gap-1 transition-colors",
                isAi
                  ? (activeTab === tab.id ? "text-primary" : "text-primary/75")
                  : (activeTab === tab.id ? "text-foreground" : "text-muted-foreground"),
              )}
            >
              <tab.icon className="h-4 w-4" aria-hidden="true" />
              <span className="max-w-full truncate text-[11px] font-medium tracking-tight">{tab.label}</span>
              {isAi && aiUnread && (
                <span className="absolute top-1 right-2.5 h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
})

const SheetBody = memo(function SheetBody({
  mode,
  activeTab,
  appearanceSubTab,
  onAppearanceSubTabChange,
  subTabLabels,
  scrollContainerRef,
}: {
  mode: SheetMode
  activeTab: MobileEditorTab
  appearanceSubTab: MobileAppearanceSubTab
  onAppearanceSubTabChange: (subTab: MobileAppearanceSubTab) => void
  subTabLabels: Record<MobileAppearanceSubTab, string>
  scrollContainerRef: React.RefObject<HTMLDivElement | null>
}) {
  const content = mode === "actions"
    ? renderActions(activeTab, appearanceSubTab, scrollContainerRef)
    : mode === "full"
    ? renderPanel(activeTab, appearanceSubTab)
    : null

  const contentClass = mode === "actions"
    ? "overflow-x-auto overscroll-x-contain no-scrollbar"
    : "overflow-y-auto overscroll-contain"

  const visible = mode !== "nav" && activeTab !== "design" && activeTab !== "ai" && (content !== null || activeTab === 'fonts')
  const editorMode = useUiSelector((s) => s.editorMode)
  const showSubTabs = visible && activeTab === "appearance" && !MODE_REGISTRY[editorMode].uiConfig.hideDecorations

  return (
    <motion.div
      className="min-h-0 flex-1 flex flex-col overflow-hidden border-t border-border/30"
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={CONTENT_FADE}
    >
      {showSubTabs && (
        <AppearanceSubTabSwitcher value={appearanceSubTab} onChange={onAppearanceSubTabChange} labels={subTabLabels} />
      )}
      <div className="min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {visible ? (
            <motion.div
              key={`${mode}:${activeTab}:${activeTab === "appearance" ? appearanceSubTab : ""}`}
              className={cn("h-full", contentClass)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={PANEL_SWITCH_FADE}
            >
              {content}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.div>
  )
})

// ─── Main export ──────────────────────────────────────────────────────────────

export function MobileEditorSheet({
  activeTab,
  onTabChange,
  onAppearanceSubTabChange,
  scrollContainerRef,
}: MobileEditorSheetProps) {
  const [snapIndex, setSnapIndex] = useState(SNAP_NAV_INDEX)
  const viewportHeight = useViewportHeight()

  const snapHeights = useMemo(
    () => [
      SNAP_NAV_HEIGHT,
      SNAP_ACTIONS_HEIGHT,
      Math.max(SNAP_ACTIONS_HEIGHT, Math.round(viewportHeight * SNAP_FULL_HEIGHT_RATIO)),
    ],
    [viewportHeight],
  )

  const mode = resolveSheetMode(snapIndex, FULL_SNAP_INDEX)

  const openDesignModal = useUiSelector((state) => state.openDesignModal)
  const designModalSection = useUiSelector((state) => state.designModalSection)
  const setSelectedDecorationId = useUiSelector((state) => state.setSelectedDecorationId)
  const editorMode = useUiSelector((state) => state.editorMode)
  const setIsAiChatOpen = useUiStore((s) => s.setIsAiChatOpen)
  const setIsHelpGuideOpen = useUiStore((s) => s.setIsHelpGuideOpen)
  const hasAiGenerated = useAiBriefStore((s) => s.hasGenerated)
  const tHelpGuide = useTranslations("editor.layout.helpGuide")

  const hideDecorations = MODE_REGISTRY[editorMode].uiConfig.hideDecorations
  const [storedAppearanceSubTab, setAppearanceSubTab] = useState<MobileAppearanceSubTab>("background")

  const appearanceSubTab = hideDecorations ? "background" : storedAppearanceSubTab

  const tMobile = useTranslations("editor.layout.mobile")
  const subTabLabels = useMemo(
    () => ({ background: tMobile("background"), decorations: tMobile("decorations") }),
    [tMobile],
  )
  const tabs = useMemo(() => {
    const hideSections = MODE_REGISTRY[editorMode]?.uiConfig.hideSectionsTab ?? false
    const allTabs: TabDef[] = ALL_TAB_ICONS.map(({ id, icon }) => ({ id, icon, label: tMobile(id) }))
    return allTabs.filter((tab) => !(hideSections && tab.id === 'sections') && !(MODE_REGISTRY[editorMode].uiConfig.hideAiButton && tab.id === 'ai') && isModeEditorTabAvailable(tab.id, editorMode))
  }, [editorMode, tMobile])

  // If sections tab becomes hidden while active, redirect to appearance
  useEffect(() => {
    const hideSections = MODE_REGISTRY[editorMode]?.uiConfig.hideSectionsTab ?? false
    if ((hideSections && activeTab === 'sections') || !isModeEditorTabAvailable(activeTab, editorMode)) {
      onTabChange(editorMode === 'menu' ? 'sections' : 'appearance')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode])

  // Collapse to nav when design/ai tab is active — both open their own modal instead
  useEffect(() => {
    if (activeTab !== "design" && activeTab !== "ai") return
    setSnapIndex(SNAP_NAV_INDEX)
  }, [activeTab])

  // Keep the desktop sidebar's tab in sync with whichever appearance sub-tab is showing
  useEffect(() => {
    if (activeTab !== "appearance") return
    onAppearanceSubTabChange?.(appearanceSubTab)
  }, [activeTab, appearanceSubTab, onAppearanceSubTabChange])

  const handleTabPress = useCallback(
    (tab: MobileEditorTab) => {
      if (tab === "design") {
        onTabChange("design")
        setSnapIndex(SNAP_NAV_INDEX)
        openDesignModal(designModalSection)
        return
      }

      if (tab === "ai") {
        onTabChange("ai")
        setSnapIndex(SNAP_NAV_INDEX)
        setIsAiChatOpen(true)
        return
      }

      if (tab === "fonts" || tab === "mascot") {
        onTabChange(tab)
        setSnapIndex(FULL_SNAP_INDEX)
        return
      }

      if (!(tab === "appearance" && appearanceSubTab === "decorations")) {
        setSelectedDecorationId(null)
      }

      onTabChange(tab)
      setSnapIndex((current) => resolveNextSnapIndex(current, activeTab, tab, FULL_SNAP_INDEX))
    },
    [activeTab, appearanceSubTab, designModalSection, onTabChange, openDesignModal, setIsAiChatOpen, setSelectedDecorationId],
  )

  const handleAppearanceSubTabChange = useCallback(
    (subTab: MobileAppearanceSubTab) => {
      setAppearanceSubTab(subTab)
      if (subTab !== "decorations") setSelectedDecorationId(null)
    },
    [setSelectedDecorationId],
  )
  const handleStopPropagation = useCallback((e: React.PointerEvent) => e.stopPropagation(), [])
  return (
    <MobileSnapSheet
      open
      snapHeights={snapHeights}
      snapIndex={snapIndex}
      onSnapIndexChange={setSnapIndex}
      ariaLabel="Editor controls"
      className={cn(
        "bg-card/90",
        "border border-foreground/15 border-b-0 rounded-t-2xl",
        "focus:outline-none",
      )}
    >
      {({ dragHandleProps }) => (
        <div
          onPointerDown={handleStopPropagation}
          className="flex h-full flex-col overflow-hidden"
        >
          <SheetNav
            activeTab={activeTab}
            onTabPress={handleTabPress}
            dragHandleProps={dragHandleProps}
            tabs={tabs}
            aiUnread={!hasAiGenerated}
            onHelpPress={() => setIsHelpGuideOpen(true)}
            helpLabel={tHelpGuide("buttonLabel")}
          />
          <SheetBody
            mode={mode}
            activeTab={activeTab}
            appearanceSubTab={appearanceSubTab}
            onAppearanceSubTabChange={handleAppearanceSubTabChange}
            subTabLabels={subTabLabels}
            scrollContainerRef={scrollContainerRef}
          />
          <div className="shrink-0 h-[env(safe-area-inset-bottom,0px)]" />
        </div>
      )}
    </MobileSnapSheet>
  )
}
