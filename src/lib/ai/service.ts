import { getApp } from 'firebase/app'
import { getAI, getGenerativeModel, GoogleAIBackend } from 'firebase/ai'
import { buildSystemPrompt, buildUserMessage } from './prompt'
import { PHOTOBOOK_SCHEMA, PORTFOLIO_SCHEMA } from './schema'
import type { AiAgentRequest, AiResponse } from './types'

// ─── Session ───────────────────────────────────────────────────────────────────

let _session: ReturnType<ReturnType<typeof getGenerativeModel>['startChat']> | null = null
let _sessionKey = ''

export function resetChatSession(): void {
  _session = null
  _sessionKey = ''
}

function getOrCreateSession(mode: AiAgentRequest['mode'], projectId: string | null) {
  const key = `${mode}:${projectId ?? ''}`
  if (_session && _sessionKey === key) return _session

  const ai = getAI(getApp(), { backend: new GoogleAIBackend() })
  const model = getGenerativeModel(ai, {
    model: 'gemini-3.5-flash-lite',
    systemInstruction: buildSystemPrompt(mode),
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: mode === 'photobook' ? PHOTOBOOK_SCHEMA : PORTFOLIO_SCHEMA,
    },
  })

  _session = model.startChat()
  _sessionKey = key
  return _session
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

async function fetchAsBase64(url: string): Promise<{ mimeType: string; data: string }> {
  const res = await fetch(url)
  const blob = await res.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = reader.result as string
      resolve({ mimeType: blob.type || 'image/jpeg', data: dataUrl.split(',')[1] })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function sendMessage(request: AiAgentRequest): Promise<AiResponse> {
  const { mode, prompt, photos, language, currentContent, projectId } = request
  const session = getOrCreateSession(mode, projectId ?? null)

  // Label each image with its stable id so the model can reference it by id, never by position
  const photoParts = (
    await Promise.all(
      photos.map(async (photo) => {
        const { mimeType, data } = await fetchAsBase64(photo.url)
        return [{ text: `Photo ${photo.id}:` }, { inlineData: { mimeType, data } }]
      }),
    )
  ).flat()

  const textPart = { text: buildUserMessage(prompt, photos.map((p) => p.id), language, currentContent) }

  const raw = await session.sendMessage([...photoParts, textPart])
  const parsed = JSON.parse(raw.response.text())
  return { mode, ...parsed } as AiResponse
}

