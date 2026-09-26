export const MENU_TEMPLATE_IDS = ['menu-classic', 'menu-bistro', 'menu-picnic', 'menu-gallery', 'menu-pulse'] as const;
export type MenuTemplateId = typeof MENU_TEMPLATE_IDS[number];

export function isMenuTemplateId(value: unknown): value is MenuTemplateId {
  return typeof value === 'string' && MENU_TEMPLATE_IDS.some((id) => id === value);
}

export function resolveMenuTemplateId(value: unknown): MenuTemplateId {
  return isMenuTemplateId(value) ? value : 'menu-classic';
}
