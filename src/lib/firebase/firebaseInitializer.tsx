'use client'

import { useEffect } from 'react'
import { type User, onIdTokenChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { clearServerSession, syncServerSession } from '@/lib/auth/session-client'
import { auth, db } from '@/lib/firebase/firebase'
import { useUserStore } from '@/hooks/useUserStore'

function buildFallbackProfile(user: User) {
  return {
    uid: user.uid,
    displayName: user.displayName ?? 'Без имени',
    email: user.email ?? null,
    photoURL: user.photoURL ?? null,
  }
}

export default function FirebaseInitializer() {
  const setAuthLoading = useUserStore((state) => state.setAuthLoading)
  const setAuthenticatedProfile = useUserStore((state) => state.setAuthenticatedProfile)
  const clearProfile = useUserStore((state) => state.clearProfile)

  useEffect(() => {
    setAuthLoading()

    let unsubscribeUserDoc: (() => void) | null = null
    let currentUserUid: string | null = null

    const unsubscribeAuth = onIdTokenChanged(auth, (user) => {
      const nextUid = user?.uid ?? null

      if (currentUserUid !== nextUid && unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      const isTokenRotation = currentUserUid === nextUid && nextUid !== null
      currentUserUid = nextUid

      if (!user) {
        clearProfile()
        void clearServerSession()
        return
      }

      // On token rotation — only refresh the server session cookie, keep UI state intact.
      void user.getIdToken().then(
        (idToken) => syncServerSession(idToken),
        (err) => {
          console.error('Ошибка при синхронизации серверной сессии:', err)
        },
      )

      if (isTokenRotation) {
        return
      }

      const fallbackProfile = buildFallbackProfile(user)
      setAuthenticatedProfile(fallbackProfile, 'loading')

      if (unsubscribeUserDoc) {
        return
      }

      const userDocRef = doc(db, 'users', user.uid)
      unsubscribeUserDoc = onSnapshot(
        userDocRef,
        async (userSnapshot) => {
          if (!userSnapshot.exists()) {
            // Document missing — likely registration failed mid-flight.
            // Call createUser Cloud Function to self-heal; it handles duplicates gracefully (409).
            try {
              const idToken = await user.getIdToken()
              const url = process.env.NEXT_PUBLIC_CREATEUSER_URL
              if (url) {
                await fetch(url, {
                  method: 'POST',
                  headers: { Authorization: `Bearer ${idToken}` },
                })
              }
            } catch (err) {
              console.error('Failed to self-heal user document:', err)
            }
            // onSnapshot will fire again once the document is created
            return
          }
          const data = userSnapshot.data()
          setAuthenticatedProfile({
            ...fallbackProfile,
            displayName: data.displayName ?? fallbackProfile.displayName,
            email: data.email ?? fallbackProfile.email,
            photoURL: data.photoURL ?? fallbackProfile.photoURL,
            profileTemplate: data.profileTemplate,
            settings: data.settings,
            subscription: data.subscription,
            balance: data.balance,
            stats: data.stats,
          }, 'ready')
        },
        (err) => {
          console.error('Ошибка при получении профиля пользователя:', err)
          setAuthenticatedProfile(fallbackProfile, 'ready')
        }
      )
    })

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc()
      unsubscribeAuth()
    }
  }, [setAuthLoading, setAuthenticatedProfile, clearProfile])

  return null
}
