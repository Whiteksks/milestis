'use client'

import { useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQueryClient } from '@tanstack/react-query'
import { ShieldCheck, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCreditsAdmin } from '@/hooks/useCreditsAdmin'
import { useUserStore } from '@/hooks/useUserStore'
import { findCreditAccount, grantCompensation, type CreditAccount, type CompensationInput, type CompensationReceipt } from '@/lib/billing/admin-credits-api'
import { MAX_COMPENSATION_CREDITS } from '../../../../../functions/src/transactions/admin/contracts'

type PendingGrant = { input: CompensationInput; account: CreditAccount; retry: boolean }
function readPending(key: string): PendingGrant | null {
  try {
    const value = JSON.parse(sessionStorage.getItem(key) ?? 'null')
    if (value?.input?.requestId && value.account?.uid === value.input.targetUid) return { ...value, retry: true }
  } catch { /* A fresh form can still be displayed when browser storage is unavailable. */ }
  return null
}

export default function AdminCreditsPage() {
  const t = useTranslations('adminCredits')
  const access = useCreditsAdmin()
  const uid = useUserStore((state) => state.profile?.uid)
  if (access.isFetching && access.data === undefined) return <p role="status">{t('loading')}</p>
  if (!uid || access.data !== true) return <section className="space-y-4 rounded-2xl border p-6">
    <h1 className="text-xl font-semibold">{t('title')}</h1><p>{t('noAccess')}</p>
    <Button variant="outline" onClick={() => void access.refetch()}>{t('refreshAccess')}</Button>
  </section>
  return <CreditsAdminForm key={uid} adminUid={uid} />
}

function CreditsAdminForm({ adminUid }: { adminUid: string }) {
  const t = useTranslations('adminCredits')
  const queryClient = useQueryClient()
  const storageKey = `credits-compensation:${adminUid}`
  const [pending, setPending] = useState<PendingGrant | null>(() => readPending(storageKey))
  const [identifier, setIdentifier] = useState('')
  const [account, setAccount] = useState<CreditAccount | null>(null)
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [receipt, setReceipt] = useState<CompensationReceipt | null>(null)
  const [busy, setBusy] = useState(false)
  const inFlight = useRef(false)
  function errorMessage(cause: unknown) {
    const message = cause instanceof Error ? cause.message : 'UNKNOWN'
    return t.has(`errors.${message}`) ? t(`errors.${message}`) : t('errors.UNKNOWN')
  }
  async function search() {
    if (inFlight.current || pending) return
    inFlight.current = true; setBusy(true); setError(null); setReceipt(null); setAccount(null)
    try { setAccount(await findCreditAccount(identifier.trim())); setAmount(''); setReason('') }
    catch (cause) { setError(errorMessage(cause)) }
    finally { inFlight.current = false; setBusy(false) }
  }
  function review() {
    if (!account || account.needsReconciliation || inFlight.current || pending) return
    const value = Number(amount)
    if (!Number.isSafeInteger(value) || value < 1 || value > MAX_COMPENSATION_CREDITS || reason.trim().length < 3 || reason.trim().length > 500) return
    setError(null); setReceipt(null)
    setPending({ account, retry: false, input: { targetUid: account.uid, amount: value, reason: reason.trim(), requestId: crypto.randomUUID() } })
  }
  async function confirm() {
    if (inFlight.current || !pending) return
    inFlight.current = true; setBusy(true); setError(null)
    try {
      // Persist before dispatch. A lost response or reload must reuse the exact operation.
      try { sessionStorage.setItem(storageKey, JSON.stringify(pending)) }
      catch { throw new Error('STORAGE_UNAVAILABLE') }
      setPending({ ...pending, retry: true })
      const result = await grantCompensation(pending.input)
      sessionStorage.removeItem(storageKey)
      setReceipt(result); setPending(null); setAccount(null); setAmount(''); setReason('')
      void queryClient.invalidateQueries({ queryKey: ['billing', result.targetUid, 'transactions'] })
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : ''
      // A definitive first response is safe to discard. After a lost response, even
      // a disabled/deleted recipient cannot prove that the earlier attempt never committed.
      if (!pending.retry && ['BALANCE_INCONSISTENT', 'ACCOUNT_NOT_FOUND', 'ACCOUNT_DISABLED', 'INVALID_COMPENSATION'].includes(message)) {
        sessionStorage.removeItem(storageKey); setPending(null); setAccount(null)
      }
      setError(errorMessage(cause))
    } finally { inFlight.current = false; setBusy(false) }
  }
  return <div className="space-y-6">
    <header className="space-y-2"><h1 className="flex items-center gap-2 text-2xl font-semibold"><ShieldCheck className="size-6" />{t('title')}</h1><p className="text-sm text-muted-foreground">{t('description')}</p></header>
    {receipt && <section role="status" className="space-y-2 rounded-2xl border bg-muted/30 p-5">
      <h2 className="font-medium">{t('success', { amount: receipt.amount })}</h2>
      <p className="break-all text-sm">UID: {receipt.targetUid}</p><p className="text-sm">{t('balance', { amount: receipt.balance.total })}</p>
      <p className="break-all text-xs text-muted-foreground">{t('receipt', { id: receipt.tid })}</p>
    </section>}
    {pending ? <section className="space-y-4 rounded-2xl border p-5">
      <h2 className="font-semibold">{t(pending.retry ? 'retryTitle' : 'confirmTitle')}</h2>
      <p className="break-all">{pending.account.displayName} · {pending.account.email ?? pending.account.uid}</p>
      <p className="break-all text-xs text-muted-foreground">UID: {pending.input.targetUid}</p>
      <p className="text-xl font-semibold">+{pending.input.amount} {t('credits')}</p>
      <p className="whitespace-pre-wrap break-words text-sm">{pending.input.reason}</p>
      <p className="text-sm text-muted-foreground">{t(pending.retry ? 'retryHint' : 'permanent')}</p>
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void confirm()}>{t(busy ? 'processing' : pending.retry ? 'retry' : 'confirm')}</Button>
        {!pending.retry && <Button variant="outline" disabled={busy} onClick={() => setPending(null)}>{t('back')}</Button>}
      </div>
    </section> : <>
      <form className="space-y-3 rounded-2xl border p-5" onSubmit={(event) => { event.preventDefault(); void search() }}>
        <label htmlFor="credit-account" className="text-sm font-medium">{t('identifier')}</label>
        <div className="flex flex-col gap-2 sm:flex-row"><Input id="credit-account" value={identifier} maxLength={254} required disabled={busy} onChange={(event) => { setIdentifier(event.target.value); setAccount(null); setReceipt(null) }} autoComplete="off" />
          <Button type="submit" disabled={busy || !identifier.trim()}><Search className="size-4" />{t('search')}</Button></div>
      </form>
      {account && <section className="space-y-4 rounded-2xl border p-5">
        <div className="space-y-1"><h2 className="break-all font-semibold">{account.displayName || account.email || account.uid}</h2><p className="break-all text-sm">{account.email}</p><p className="break-all text-xs text-muted-foreground">UID: {account.uid}</p></div>
        {account.balance && <p>{t('balance', { amount: account.balance.total })}</p>}
        {account.availableCredits !== null && <p className="text-sm text-muted-foreground">{t('available', { amount: account.availableCredits })}</p>}
        {account.needsReconciliation ? <p role="alert" className="text-sm text-destructive">{t('errors.BALANCE_INCONSISTENT')}</p> : <form className="space-y-4 border-t pt-4" onSubmit={(event) => { event.preventDefault(); review() }}>
          <div className="space-y-2"><label htmlFor="credit-amount" className="text-sm font-medium">{t('amount')}</label><Input id="credit-amount" type="number" min={1} max={MAX_COMPENSATION_CREDITS} step={1} value={amount} onChange={(event) => setAmount(event.target.value)} required disabled={busy} /></div>
          <div className="space-y-2"><label htmlFor="credit-reason" className="text-sm font-medium">{t('reason')}</label><textarea id="credit-reason" className="min-h-24 w-full rounded-md border bg-background p-3 text-sm" value={reason} onChange={(event) => setReason(event.target.value)} minLength={3} maxLength={500} required disabled={busy} /></div>
          <p className="text-xs text-muted-foreground">{t('permanent')}</p><Button type="submit" disabled={busy}>{t('review')}</Button>
        </form>}
      </section>}
    </>}
    {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
  </div>
}
