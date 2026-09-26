import { NextIntlClientProvider } from 'next-intl'
import type { PublishedMenuPage } from '@/lib/projects/published-menu'
import { resolveMenuTemplateId } from '@/editor/modes/menu/template-ids'
import { PublishedView } from './published-view'
import menuEn from '../../../../messages/en/editor/editor-menu.json'
import menuRu from '../../../../messages/ru/editor/editor-menu.json'
import menuKz from '../../../../messages/kz/editor/editor-menu.json'

export function MenuPageView({ resolved }: { resolved: PublishedMenuPage }) {
  const { project, menu, page } = resolved
  const theme = project.theme ?? {}
  return <NextIntlClientProvider locale={project.locale} messages={{ en: menuEn, ru: menuRu, kz: menuKz }[project.locale]}>
    <PublishedView
      mode="menu"
      projectId={project.id}
      pageId={page.id}
      templateId={resolveMenuTemplateId(theme.currentTemplateId)}
      themeId={theme.currentTheme ?? 'parchment'}
      themeCustomizations={theme.themeCustomizations ?? {}}
      customDecorations={[]}
      content={menu as unknown as Record<string, unknown>}
      imageContent={project.content.imageContent ?? {}}
      visibility={project.content.sectionVisibility ?? {}}
      referrerUid={project.ownerId ?? undefined}
    />
  </NextIntlClientProvider>
}
