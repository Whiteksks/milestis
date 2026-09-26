import 'server-only'
import type { NextRequest } from 'next/server'
import { aiTasks, type AiTasks } from './tasks'
import { AiServiceError } from './openai'
import { readMenuContent } from '@/editor/modes/menu/model'

const fail = () => { throw new AiServiceError('AI_INVALID_REQUEST', 400) }
const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value)
export function isAiId(value: unknown): value is string { return typeof value === 'string' && /^[a-zA-Z0-9_-]{1,80}$/.test(value) }

function bounded(value: unknown, depth = 0): void {
  if (depth > 14) fail()
  if (typeof value === 'string' && value.length > 20000) fail()
  if (Array.isArray(value)) {
    if (value.length > 200) fail()
    value.forEach((entry) => bounded(entry, depth + 1))
  } else if (isObject(value)) {
    if (Object.keys(value).length > 100) fail()
    Object.values(value).forEach((entry) => bounded(entry, depth + 1))
  }
}

export async function readAiRequest(request: NextRequest) {
  const reader = request.body?.getReader()
  if (!reader) return fail()
  const chunks: Uint8Array[] = []
  let size = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 512_000) {
        await reader.cancel()
        throw new AiServiceError('AI_REQUEST_TOO_LARGE', 413)
      }
      chunks.push(value)
    }
  } finally { reader.releaseLock() }
  let raw: unknown
  try { raw = JSON.parse(Buffer.concat(chunks).toString('utf8')) } catch { return fail() }
  if (!isObject(raw) || !isAiId(raw.projectId) || typeof raw.task !== 'string' || !Object.hasOwn(aiTasks, raw.task) || !isObject(raw.input)) return fail()
  bounded(raw.input)
  const input = raw.input
  if (typeof input.prompt !== 'string' || input.prompt.length > 12000 ||
    typeof input.language !== 'string' || !['en', 'ru', 'kz'].includes(input.language)) return fail()
  for (const key of ['photos', 'storyPhotos', 'newPhotos']) {
    if (input[key] === undefined) continue
    if (!Array.isArray(input[key]) || input[key].length > (raw.task === 'generateMenu' ? 20 : 100)) return fail()
    for (const photo of input[key]) if (!isObject(photo) || !isAiId(photo.id)) return fail()
  }
  if (input.photo !== undefined && (!isObject(input.photo) || !isAiId(input.photo.id))) return fail()
  if (raw.task.startsWith('generatePhotobook') || raw.task.startsWith('generatePortfolio')) {
    if (!isObject(input.current)) return fail()
    if (raw.task === 'generatePhotobookStory' && !Array.isArray(input.storyPhotos)) return fail()
    if (raw.task === 'generatePortfolioFeaturedWork' && (!Array.isArray(input.existingProjects) || !Array.isArray(input.newPhotos))) return fail()
  }
  if (raw.task.startsWith('decide') && !Array.isArray(input.photos)) return fail()
  if (raw.task === 'classifyIntent' && (!Array.isArray(input.sectionKeys) || !input.sectionKeys.every((key) => typeof key === 'string') ||
    typeof input.isBlankProject !== 'boolean' || typeof input.hasNewPhotos !== 'boolean')) return fail()
  if (raw.task === 'generateChatReply' && !['photobook', 'portfolio'].includes(String(input.mode))) return fail()
  if (raw.task === 'generateMenu') {
    try { input.current = readMenuContent(input.current) } catch { return fail() }
    if (!isAiId(input.activePageId) || !isObject(input.style) || !Array.isArray(input.photos) ||
      !Array.isArray(input.history) || input.history.length > 8) return fail()
    for (const entry of input.history) {
      if (!isObject(entry) || !['user', 'assistant'].includes(String(entry.role)) || typeof entry.content !== 'string' || entry.content.length > 2000) return fail()
    }
  }
  return { projectId: raw.projectId, task: raw.task as keyof AiTasks, input }
}

export function taskMatchesMode(task: keyof AiTasks, mode: unknown): boolean {
  if (task === 'generateMenu') return mode === 'menu'
  if (task.includes('Photobook')) return mode === 'photobook'
  if (task.includes('Portfolio')) return mode === 'portfolio'
  return mode === 'photobook' || mode === 'portfolio'
}
