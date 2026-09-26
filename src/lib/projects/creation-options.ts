import type { ProjectMode } from './project-type-config'

// Event stays registered for existing projects, but is not offered for creation.
export const PROJECT_CREATION_OPTIONS = (['photobook', 'portfolio', 'menu'] as const).map((mode, index) => ({
  mode: mode satisfies ProjectMode,
  number: String(index + 1).padStart(2, '0'),
  titleKey: `createCards.${mode}.title`,
  descriptionKey: `createCards.${mode}.description`,
}))
