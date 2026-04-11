'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/firebase'
import { useUserStore } from '@/hooks/useUserStore'

const SESSION_COOKIE = 'milestis_session'

function setSessionCookie(value: '1' | '0') {
  if (value === '1') {
    document.cookie = `${SESSION_COOKIE}=1; path=/; SameSite=Lax`
  } else {
    document.cookie = `${SESSION_COOKIE}=0; path=/; max-age=0; SameSite=Lax`
  }
}

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
        setSessionCookie('0')
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
            setSessionCookie('1')
          } else {
            // Документ ещё не существует — это переходное состояние между
            // регистрацией и созданием документа через createUser cloud function.
            // Оставляем loading: true, onSnapshot сработает снова при создании.
            setLoading(true)
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
