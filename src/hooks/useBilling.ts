import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { useLocale } from 'next-intl'
import { auth, db } from '@/lib/firebase'
import {
  selectCurrentUid,
  selectProfileHydrating,
  selectSubscription,
  selectBalance,
  useUserStore,
} from "@/hooks/useUserStore"
import {
  getPlanTranslationKey,
  isPaidPlan,
  formatResetDate,
} from "@/lib/billing/billing.utils"

export interface BillingCreditsData {
  monthly: { used: number; total: number; resetDate: string }
  bonus: { amount: number }
  purchased: { amount: number }
}

interface BillingBalanceSnapshot {
  total: number
  purchased: number
  subscription: number
  bonus: number
}

type BillingTransactionType = 'buy_credits' | 'subscription_payment' | 'refund'
type CreditTransactionType = 'grant' | 'spend' | 'expire' | 'admin_adjustment'

interface BillingTransactionBase {
  id: string
  direction: 'in' | 'out'
  createdAt: Date
  balanceSnapshot: BillingBalanceSnapshot
  meta?: Record<string, unknown>
}

export interface BillingInvoiceItem extends BillingTransactionBase {
  category: 'billing'
  type: BillingTransactionType
  currency: string
  amountMinor: number
}

export interface BillingCreditHistoryItem extends BillingTransactionBase {
  category: 'credit'
  type: CreditTransactionType
  amount: number
}


interface FirestoreTransactionData {
  category?: 'billing' | 'credit'
  type?: BillingTransactionType | CreditTransactionType
  direction?: 'in' | 'out'
  createdAt?: string | { toDate?: () => Date } | Date
  balanceSnapshot?: Partial<BillingBalanceSnapshot>
  meta?: Record<string, unknown>
  currency?: string
  amountMinor?: number
  amount?: number
  tid?: string
}

interface ExportUserDataResponse {
  transactions?: FirestoreTransactionData[]
}

function parseTransactionDate(value: FirestoreTransactionData['createdAt']): Date {
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const parsed = new Date(value)
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed
  }
  if (value && typeof value === 'object' && typeof value.toDate === 'function') {
    return value.toDate()
  }
  return new Date(0)
}

function normalizeBalanceSnapshot(snapshot: FirestoreTransactionData['balanceSnapshot']): BillingBalanceSnapshot {
  return {
    total: typeof snapshot?.total === 'number' ? snapshot.total : 0,
    purchased: typeof snapshot?.purchased === 'number' ? snapshot.purchased : 0,
    subscription: typeof snapshot?.subscription === 'number' ? snapshot.subscription : 0,
    bonus: typeof snapshot?.bonus === 'number' ? snapshot.bonus : 0,
  }
}

function getStringMeta(meta: Record<string, unknown> | undefined, keys: string[]): string | null {
  for (const key of keys) {
    const value = meta?.[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

function getNumberMeta(meta: Record<string, unknown> | undefined, keys: string[]): number | null {
  for (const key of keys) {
    const value = meta?.[key]
    if (typeof value === 'number' && Number.isFinite(value)) return value
  }
  return null
}

async function fetchTransactions(uid: string): Promise<Array<BillingInvoiceItem | BillingCreditHistoryItem>> {
  try {
    return await fetchTransactionsFromFirestore(uid)
  } catch {
    return await fetchTransactionsFromExport(uid)
  }
}

async function fetchTransactionsFromFirestore(uid: string): Promise<Array<BillingInvoiceItem | BillingCreditHistoryItem>> {
  const transactionsQuery = query(
    collection(db, 'transactions'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(50),
  )

  const snapshot = await getDocs(transactionsQuery)

  return snapshot.docs.flatMap((docSnap) => {
    const data = docSnap.data() as FirestoreTransactionData
    return mapTransactionRecord(data, docSnap.id)
  })
}

async function fetchTransactionsFromExport(uid: string): Promise<Array<BillingInvoiceItem | BillingCreditHistoryItem>> {
  const url = process.env.NEXT_PUBLIC_EXPORT_USER_DATA_URL
  const user = auth.currentUser

  if (!url || !user) {
    return []
  }

  const idToken = await user.getIdToken()
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch billing history')
  }

  const payload = await response.json() as ExportUserDataResponse
  const transactions = Array.isArray(payload.transactions) ? payload.transactions : []

  return transactions
    .filter((transaction) => typeof transaction === 'object' && transaction !== null)
    .flatMap((transaction, index) => mapTransactionRecord(transaction, transaction.tid ?? `${uid}-${index}`))
}

function mapTransactionRecord(
  data: FirestoreTransactionData,
  id: string,
): Array<BillingInvoiceItem | BillingCreditHistoryItem> {
  const base = {
    id,
    direction: data.direction === 'in' ? 'in' : 'out',
    createdAt: parseTransactionDate(data.createdAt),
    balanceSnapshot: normalizeBalanceSnapshot(data.balanceSnapshot),
    meta: data.meta,
  } satisfies BillingTransactionBase

  if (data.category === 'billing') {
    if (typeof data.amountMinor !== 'number') return []
    return [{
      ...base,
      category: 'billing' as const,
      type: (data.type as BillingTransactionType) ?? 'buy_credits',
      currency: typeof data.currency === 'string' && data.currency ? data.currency : 'USD',
      amountMinor: data.amountMinor,
    }]
  }

  if (data.category === 'credit') {
    if (typeof data.amount !== 'number') return []
    return [{
      ...base,
      category: 'credit' as const,
      type: (data.type as CreditTransactionType) ?? 'grant',
      amount: data.amount,
    }]
  }

  return []
}

export function useBilling() {
  const locale = useLocale()
  const loading = useUserStore(selectProfileHydrating)
  const uid = useUserStore(selectCurrentUid)
  const subscription = useUserStore(selectSubscription)
  const balance = useUserStore(selectBalance)
  const transactionsQuery = useQuery({
    queryKey: ['billing', uid, 'transactions'],
    queryFn: () => fetchTransactions(uid ?? ''),
    enabled: !loading && !!uid,
    staleTime: 5 * 60 * 1000,
  })

  // ─── Credits ──────────────────────────────────────────────────────────────
  // monthly.total  = tier's full grant (from features.monthlyCredits)
  // monthly.used   = total - remaining balance (real consumption this period)
  // monthly.value shown in UI = total - used = balance.subscription
  const creditsData: BillingCreditsData | null = useMemo(() => {
    if (!balance) return null
    const monthlyTotal = subscription?.features?.monthlyCredits ?? 0
    const monthlyUsed  = Math.max(0, monthlyTotal - balance.subscription)
    return {
      monthly: {
        used: monthlyUsed,
        total: monthlyTotal,
        resetDate: formatResetDate(locale, subscription?.currentPeriodEnd),
      },
      bonus:     { amount: balance.bonus },
      purchased: { amount: balance.purchased },
    }
  }, [balance, subscription, locale])

  // ─── Plan ─────────────────────────────────────────────────────────────────
  const planTier = subscription?.planTier
  const planKey = getPlanTranslationKey(planTier)
  const isPro = isPaidPlan(planTier)
  const transactions = transactionsQuery.data ?? []
  const creditHistory = transactions.filter(
    (transaction): transaction is BillingCreditHistoryItem => transaction.category === 'credit'
  )
  const invoiceHistory = transactions.filter(
    (transaction): transaction is BillingInvoiceItem => transaction.category === 'billing'
  )

  return {
    loading,
    historyLoading: transactionsQuery.isLoading,
    historyError: transactionsQuery.error,
    creditsData,
    isPro,
    creditHistory,
    invoiceHistory,
  }
}
