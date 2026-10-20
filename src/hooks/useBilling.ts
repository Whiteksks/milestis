import { functionUrl } from '@/config/firebase'
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
  formatResetDate,
  getEffectiveSubscriptionFeatures,
  isEffectivePaidSubscription,
} from "@/lib/billing/billing.utils"

export interface BillingCreditsData {
  monthly: {
    used: number
    total: number
    /** Actual subscription bucket balance from Firestore (may exceed total during plan transitions). */
    balance: number
    resetDate: string
    interval: 'month' | 'year'
  }
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

function safeNumber(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0
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
  const url = functionUrl('exportUserData')
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
  // For monthly plans: periodTotal = monthlyCredits (e.g. 750 for archive).
  // For yearly plans:  periodTotal = monthlyCredits × 12 (e.g. 9000 for archive yearly).
  // Polar fires one webhook per period and grants the full periodTotal at once.
  const creditsData: BillingCreditsData | null = useMemo(() => {
    if (!balance) return null
    const monthlyCredits = getEffectiveSubscriptionFeatures(subscription).monthlyCredits
    const interval: 'month' | 'year' = subscription?.planInterval === 'year' ? 'year' : 'month'
    const periodMultiplier = interval === 'year' ? 12 : 1
    const periodTotal = monthlyCredits * periodMultiplier
    const subscriptionBalance = safeNumber(balance.subscription)
    const bonusBalance = safeNumber(balance.bonus)
    const purchasedBalance = safeNumber(balance.purchased)
    // Remaining = min(subscriptionBalance, periodTotal); used = periodTotal - remaining
    const periodUsed = Math.max(0, periodTotal - subscriptionBalance)
    return {
      monthly: {
        used: periodUsed,
        total: periodTotal,
        balance: subscriptionBalance,
        resetDate: formatResetDate(locale, subscription?.currentPeriodEnd),
        interval,
      },
      bonus:     { amount: bonusBalance },
      purchased: { amount: purchasedBalance },
    }
  }, [balance, subscription, locale])

  // ─── Plan ─────────────────────────────────────────────────────────────────
  const isPro = isEffectivePaidSubscription(subscription)
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
