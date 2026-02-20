'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'

export default function FirebaseInitializer() {
  const setProfile = useUserStore((state) => state.setProfile)
  const clearProfile = useUserStore((state) => state.clearProfile)
  const setLoading = useUserStore((state) => state.setLoading)

  useEffect(() => {
    setLoading(true)

    let unsubscribeUserDoc: (() => void) | null = null
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeUserDoc) {
        unsubscribeUserDoc()
        unsubscribeUserDoc = null
      }

      if (!user) {
        clearProfile()
        return
      }

      setLoading(true)
      const userDocRef = doc(db, 'users', user.uid)
      unsubscribeUserDoc = onSnapshot(
        userDocRef,
        (userSnapshot) => {
          if (userSnapshot.exists()) {
            const data = userSnapshot.data()
            setProfile({
              uid: user.uid,
              displayName: data.displayName ?? user.displayName ?? 'Без имени',
              email: data.email ?? user.email ?? null,
              photoURL: data.photoURL ?? user.photoURL ?? null,
              profileTemplate: data.profileTemplate,
              settings: data.settings,
              subscription: data.subscription,
              balance: data.balance,
              stats: data.stats,
            })
          } else {
            setProfile({
              uid: user.uid,
              displayName: user.displayName ?? 'Без имени',
              email: user.email ?? null,
              photoURL: user.photoURL ?? null,
            })
          }
        },
        (err) => {
          console.error('Ошибка при получении профиля пользователя:', err)
          clearProfile()
        }
      )
    })

    return () => {
      if (unsubscribeUserDoc) unsubscribeUserDoc()
      unsubscribeAuth()
    }
  }, [setProfile, clearProfile, setLoading])

  return null
}
