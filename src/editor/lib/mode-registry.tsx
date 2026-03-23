// Barrel re-export — all logic lives in src/editor/lib/modes/
// To add a new mode: create modes/<name>.tsx, register it in modes/index.ts
export * from '@/editor/lib/modes'
// UI-only config (labels, icons, helper functions) per mode
export { getModeUiConfig, MODE_UI_CONFIGS } from '@/editor/lib/mode-ui-configs'
export type { ModeUiConfig } from '@/editor/lib/mode-ui-configs'
