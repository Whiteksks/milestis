// Public API for templates — import only from here.
// For editor write-path (createImageValue, policy internals), import directly from the submodule.

// The one component templates need:
export { SlotImage, type SlotImageProps } from './render/slot-image'

// Editor UI pickers — read constraints from policy automatically:
export { RatioPicker } from './editor/ratio-picker'
export { FramePicker } from './editor/frame-picker'

// Image value mutations for editor flows:
export {
  updateImageRatio,
  updateImageFrame,
  setUserCrop,
  clearImageCrop,
} from './editor/update-image-value'

// Crop system:
export { useImageCrop, type UseImageCropOptions, type UseImageCropReturn } from './crop/use-image-crop'
export { ImageCropPanel, type ImageCropPanelProps } from './crop/image-crop-panel'

// Image picker:
export { ImagePicker, type ImagePickerProps } from './editor/image-picker'

// Data types templates and store contracts need:
export type {
  ImageValue,
  ImageAsset,
  ImageCropValue,
  ImageCropRect,
  ImageFocalPoint,
  ImagePresentation,
  ImageRatioValue,
  ImageFitMode,
  ImageUsageMode,
} from './data'

// Slot IDs:
export type { ImageSlotId, ImageSlotFamily } from './slots'

// Photobook domain:
export type { PhotobookImageContent } from '@/editor/modes/photobook/image/content'
export {
  createEmptyPhotobookImageContent,
  setPhotobookSingleImage,
  appendPhotobookRepeatingImage,
  replacePhotobookRepeatingImage,
  removePhotobookRepeatingImage,
  findPhotobookRepeatingImage,
} from '@/editor/modes/photobook/image/content'
export type { PhotobookManagedImage } from '@/editor/modes/photobook/image/types'
export {
  createPhotobookSectionImage,
  createPhotobookRepeatingImage,
  replacePhotobookManagedImageAsset,
  resolvePhotobookManagedImage,
} from '@/editor/modes/photobook/image/helpers'
export {
  selectPhotobookSingleResolvedImage,
  selectPhotobookRepeatingResolvedImage,
  selectPhotobookImageContent,
} from '@/editor/modes/photobook/image/selectors'

// Portfolio domain:
export type { PortfolioImageContent } from '@/editor/modes/portfolio/image/content'
export {
  createEmptyPortfolioImageContent,
  setPortfolioSingleImage,
  appendPortfolioRepeatingImage,
  replacePortfolioRepeatingImage,
  removePortfolioRepeatingImage,
  findPortfolioRepeatingImage,
} from '@/editor/modes/portfolio/image/content'
export type { PortfolioManagedImage } from '@/editor/modes/portfolio/image/types'
export {
  createPortfolioSectionImage,
  createPortfolioRepeatingImage,
  replacePortfolioManagedImageAsset,
  resolvePortfolioManagedImage,
} from '@/editor/modes/portfolio/image/helpers'
export {
  selectPortfolioSingleResolvedImage,
  selectPortfolioRepeatingResolvedImage,
} from '@/editor/modes/portfolio/image/selectors'
