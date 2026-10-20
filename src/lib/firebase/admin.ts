import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"
import { getFirestore } from "firebase-admin/firestore"
import { firebaseConfig } from '@/config/firebase'
import { requiredSetting } from '../../../functions/src/config/project'

// Инициализация один раз (Next.js может переиспользовать модуль между запросами)
if (!getApps().length) {
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY || process.env.FIREBASE_ADMIN_CLIENT_EMAIL) {
    // Локальная разработка: явные credentials из .env.local
    initializeApp({
      credential: cert({
        projectId: firebaseConfig.projectId,
        clientEmail: requiredSetting(process.env.FIREBASE_ADMIN_CLIENT_EMAIL, 'FIREBASE_ADMIN_CLIENT_EMAIL'),
        privateKey: requiredSetting(process.env.FIREBASE_ADMIN_PRIVATE_KEY, 'FIREBASE_ADMIN_PRIVATE_KEY').replace(/\n/g, "\n"),
      }),
    })
  } else {
    // Firebase App Hosting / Cloud Run: Application Default Credentials (ADC)
    // Сервисный аккаунт автоматически предоставляется платформой
    initializeApp({ projectId: firebaseConfig.projectId })
  }
}

export const adminDb = getFirestore()
export const adminAuth = getAuth()
