// Requires "Firebase AI Logic" to be enabled in the Firebase console.
// https://console.firebase.google.com → Build → AI Logic → Get started
import { getApp } from 'firebase/app'
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'

const MODEL = 'gemini-3.7-flash'

let _model: ReturnType<typeof getGenerativeModel> | null = null

// Lazily initialized to avoid running before Firebase app is ready
export function getGeminiModel() {
  if (!_model) {
    const ai = getAI(getApp(), { backend: new GoogleAIBackend() })
    _model = getGenerativeModel(ai, { model: MODEL })
  }
  return _model
}
