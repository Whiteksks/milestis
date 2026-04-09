import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

// Инициализация один раз (Next.js может переиспользовать модуль между запросами)
if (!getApps().length) {
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    // Локальная разработка: явные credentials из .env.local
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    })
  } else {
    // Firebase App Hosting / Cloud Run: Application Default Credentials (ADC)
    // Сервисный аккаунт автоматически предоставляется платформой
    initializeApp()
  }
}

export const adminDb = getFirestore()
