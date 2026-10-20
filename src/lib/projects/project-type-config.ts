/** Publication access settings for each project type. */
export const PROJECT_TYPE_CONFIG = {
  menu: { hasAccessToken: false },
  portfolio: { hasAccessToken: false },
  photobook: { hasAccessToken: true },
  event: { hasAccessToken: true },
} as const

export type ProjectMode = keyof typeof PROJECT_TYPE_CONFIG

export function getProjectConfig(mode: ProjectMode) {
  return PROJECT_TYPE_CONFIG[mode]
}
