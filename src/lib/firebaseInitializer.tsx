'use client'

import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { useUserStore } from '@/hooks/useUserStore'

export default function FirebaseInitializer() {
  const setProfile = useUserStore((state) => state.setProfile)
  const clearProfile = useUserStore((state) => state.clearProfile)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Получаем документ пользователя из коллекции /users
          const userDocRef = doc(db, 'users', user.uid)
          const userSnapshot = await getDoc(userDocRef)

          if (userSnapshot.exists()) {
            const data = userSnapshot.data()
            setProfile({
              displayName: data.displayName ?? 'Без имени',
              email: data.email ?? user.email ?? 'example@email.com',
              // сюда можно добавить другие поля из Firestore (photoURL, publicName и т.д.)
            })
          } else {
            // Документ не найден
            setProfile({
              displayName: user.displayName ?? 'Без имени',
              email: user.email ?? 'example@email.com',
            })
          }
        } catch (err) {
          console.error('Ошибка при получении профиля пользователя:', err)
          clearProfile()
        }
      } else {
        clearProfile()
      }
    })

    return () => unsubscribe()
  }, [setProfile, clearProfile])

  return null
}
