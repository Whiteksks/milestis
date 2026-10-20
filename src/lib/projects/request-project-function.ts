import { functionUrl, type HttpFunction } from '@/config/firebase'
import { auth } from '../firebase/firebase'

interface RequestErrorOptions {
  errorClass: new (code: string, message: string) => Error
  fallbackMessage: string
  useServerMessage?: boolean
}

export async function requestProjectFunction<T>(
  name: HttpFunction,
  body: Record<string, unknown>,
  { errorClass: RequestError, fallbackMessage, useServerMessage = true }: RequestErrorOptions,
): Promise<T> {
  const user = auth.currentUser
  if (!user) throw new RequestError('UNAUTHORIZED', 'Not authenticated')

  const idToken = await user.getIdToken()
  const response = await fetch(functionUrl(name), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new RequestError(
      data.error ?? 'UNKNOWN',
      useServerMessage ? (data.message ?? fallbackMessage) : fallbackMessage,
    )
  }
  return data as T
}
