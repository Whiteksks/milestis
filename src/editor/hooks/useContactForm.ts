'use client'

import { useState, type FormEvent } from 'react'

interface ContactFormState {
  name: string
  email: string
  subject: string
  message: string
}

type SubmitStatus = 'idle' | 'sent' | 'error'

export function useContactForm(recipientEmail: string) {
  const [fields, setFields] = useState<ContactFormState>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<SubmitStatus>('idle')

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target
    setFields((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const { name, email, subject, message } = fields

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus('error')
      return
    }

    const body = `From: ${name} <${email}>\n\n${message}`
    const mailto =
      `mailto:${encodeURIComponent(recipientEmail)}` +
      `?subject=${encodeURIComponent(subject || `Message from ${name}`)}` +
      `&body=${encodeURIComponent(body)}`

    try {
      window.location.href = mailto
      setFields({ name: '', email: '', subject: '', message: '' })
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return { fields, status, handleChange, handleSubmit }
}
