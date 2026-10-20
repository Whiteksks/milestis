'use client'

import { useState } from 'react'
import { sendSignInLinkToEmail, signInWithPassword, signInWithGoogle } from '@/lib/auth'

export function useLoginForm(onGoogleSuccess?: () => void) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPasswordLogin, setShowPasswordLogin] = useState(false)
  const [showEmailFlow, setShowEmailFlow] = useState(false)

  async function handleSendMagicLink() {
    if (!email) return
    setLoading(true)
    setError(null)

    const result = await sendSignInLinkToEmail(email)
    if (result.success) setSent(true)
    else if (result.error) setError(result.error)
    setLoading(false)
  }

  async function handleSignInWithPassword() {
    if (!email || !password) return
    setLoading(true)
    setError(null)

    const result = await signInWithPassword(email, password)
    if (result.error) setError(result.error)
    setLoading(false)
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    setError(null)

    const result = await signInWithGoogle()
    if (result.success) onGoogleSuccess?.()
    else if (result.error) setError(result.error)
    setGoogleLoading(false)
  }

  function handleChangeEmail() {
    setSent(false)
    setError(null)
  }

  function reset() {
    setEmail('')
    setPassword('')
    setSent(false)
    setError(null)
    setLoading(false)
    setShowPasswordLogin(false)
    setShowEmailFlow(false)
  }

  return {
    email, setEmail,
    password, setPassword,
    loading, googleLoading, sent, error,
    showPasswordLogin, setShowPasswordLogin,
    showEmailFlow, setShowEmailFlow,
    handleSendMagicLink,
    handleSignInWithPassword,
    handleGoogleSignIn,
    handleChangeEmail,
    reset,
  }
}
