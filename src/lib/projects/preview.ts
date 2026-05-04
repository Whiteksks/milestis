export interface ProjectPreviewCropData {
  editorX: number
  editorY: number
  zoom: number
  area: {
    x: number
    y: number
    width: number
    height: number
  }
  naturalWidth: number
  naturalHeight: number
}

export interface ProjectPreviewData {
  themeId: string
  templateId: string
  heroImageUrl?: string
  title?: string
  subtitle?: string
  date?: string
  aspectRatio?: string
  frameStyle?: string
  cropData?: ProjectPreviewCropData
}