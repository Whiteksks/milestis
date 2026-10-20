import { createFunctionsConfig, requiredSetting } from '../../functions/src/config/project'

export const firebaseConfig = {
  apiKey: requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_API_KEY, 'NEXT_PUBLIC_FIREBASE_API_KEY'),
  authDomain: requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
  projectId: requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
  storageBucket: requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET, 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID, 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'),
  appId: requiredSetting(process.env.NEXT_PUBLIC_FIREBASE_APP_ID, 'NEXT_PUBLIC_FIREBASE_APP_ID'),
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

export const functionsConfig = createFunctionsConfig(
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION,
  process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN,
)

export const functionsEmulatorOrigin = process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_ORIGIN

export type HttpFunction = 'createUser' | 'createProject' | 'forceDeleteProject' | 'unpublishProject'
  | 'republishProject' | 'publishProject' | 'publishMenu' | 'analyzeProject' | 'analyzeRepublish'
  | 'uploadEventPhoto' | 'exportUserData' | 'exportProjectContent' | 'deleteUserAccount' | 'menuBilling'

export function functionUrl(name: HttpFunction): string {
  return `${functionsConfig.baseUrl}/${name}`
}
