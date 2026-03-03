// Backward-compatibility re-export for existing photobook panels.
// New code should import PhotobookImagePicker from './photobook-image-picker' directly.

export {
  PhotobookImagePicker as ImagePicker,
  type PhotobookImagePickerValue as ImagePickerValue,
} from "@/editor/components/editor/section-settings/ui/photobook-image-picker"
