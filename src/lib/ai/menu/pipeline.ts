import { requestAi } from '../client'
import { createAiOperation } from '../pipeline/operation'
import type { RunAiPipelineInput, AiPipelineResult } from '../pipeline/orchestrator'
import { useContentStore } from '@/editor/lib/store/content'
import { useThemeStore } from '@/editor/lib/store/theme'
import { useUiStore } from '@/editor/lib/store/ui'
import { useAiBriefStore } from '@/editor/lib/store/ai-brief'
import { readMenuContent } from '@/editor/modes/menu/model'
import { resolveMenuTemplateId } from '@/editor/modes/menu/template-ids'
import { getProjectImageSelectUrl, getProjectImageThumbUrl } from '@/editor/hooks/use-project-images'
import type { MenuImageContent } from '@/editor/modes/menu/content-types'

export async function runMenuPipeline(input: RunAiPipelineInput): Promise<AiPipelineResult> {
  const operation = createAiOperation(input.projectId, input.signal)
  const before = useContentStore.getState()
  const themeBefore = useThemeStore.getState()
  const briefBefore = useAiBriefStore.getState()
  try {
    operation.check()
    input.onStage?.({ kind: 'replying' })
    const result = await Promise.race([requestAi('generateMenu', {
      prompt: input.prompt, language: input.language, current: before.menuContent,
      activePageId: before.menuContent.pages.find((page) => page.id === useUiStore.getState().activeMenuPageId)?.id ?? before.menuContent.homePageId,
      style: { templateId: resolveMenuTemplateId(themeBefore.currentTemplateId), currentTheme: themeBefore.currentTheme },
      history: input.history ?? [],
      photos: input.newPhotoIds.map((id) => ({ id, url: getProjectImageThumbUrl(input.idToDoc.get(id)!) })),
    }, { projectId: input.projectId, signal: operation.signal }), operation.interrupted])
    operation.check()
    if (!result.menu && !result.style && result.photoAssignments.length === 0) return { kind: 'chat', message: result.message }
    const menuContent = result.menu ? readMenuContent({ ...result.menu, mascot: before.menuContent.mascot }) : before.menuContent
    const menuImages: MenuImageContent = {
      ...before.menuImages,
      dishes: Object.fromEntries(Object.entries(before.menuImages.dishes).filter(([id]) => menuContent.dishes.some((dish) => dish.id === id))),
      pageBackgrounds: Object.fromEntries(Object.entries(before.menuImages.pageBackgrounds).filter(([id]) => menuContent.pages.some((page) => page.id === id))),
    }
    for (const { dishId, photoId } of result.photoAssignments) {
      const photo = input.idToDoc.get(photoId)
      if (!photo || !menuContent.dishes.some((dish) => dish.id === dishId)) throw new Error('AI_INVALID_RESPONSE')
      menuImages.dishes[dishId] = { asset: {
        src: getProjectImageSelectUrl(photo), width: photo.meta?.width ?? 0, height: photo.meta?.height ?? 0,
        alt: menuContent.dishes.find((dish) => dish.id === dishId)?.name,
      } }
    }
    operation.apply(() => {
      useContentStore.setState({ menuContent, menuImages })
      if (result.style) {
        useThemeStore.getState().setTemplate(result.style.templateId)
        useThemeStore.getState().setTheme(result.style.currentTheme)
      }
      useAiBriefStore.getState().markGenerated(['menu', 'venue'])
    })
    const after = useContentStore.getState()
    const themeAfter = useThemeStore.getState()
    return {
      kind: 'applied', intent: 'edit_section', sectionsWritten: ['menu'], styleChanged: !!result.style, message: result.message,
      undo: () => {
        if (useUiStore.getState().projectId !== input.projectId || useContentStore.getState() !== after || useThemeStore.getState() !== themeAfter) return false
        useContentStore.setState({ menuContent: before.menuContent, menuImages: before.menuImages })
        useThemeStore.setState({ currentTemplateId: themeBefore.currentTemplateId, currentTheme: themeBefore.currentTheme })
        useAiBriefStore.setState(briefBefore)
        return true
      },
    }
  } finally { operation.dispose() }
}
