import { useQuery } from '@tanstack/react-query'
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { useShallow } from "zustand/react/shallow"
import { db } from '@/lib/firebase'
import { useUserStore } from "@/hooks/useUserStore"
import {
  planDisplayName,
  planDescription,
  isPaidPlan,
  formatResetDate,
  subscriptionStatusLabel,
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

export interface BillingPaymentMethod {
  type: string
  last4: string
  expiry: string
  brand: 'visa' | 'mastercard' | 'amex' | 'default'
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

function normalizeBrand(value: string | null): BillingPaymentMethod['brand'] {
  switch (value?.toLowerCase()) {
    case 'visa':
      return 'visa'
    case 'mastercard':
    case 'master_card':
      return 'mastercard'
    case 'amex':
    case 'american_express':
      return 'amex'
    default:
      return 'default'
  }
}

async function fetchTransactions(uid: string): Promise<Array<BillingInvoiceItem | BillingCreditHistoryItem>> {
  const transactionsQuery = query(
    collection(db, 'transactions'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc'),
    limit(50),
  )

  const snapshot = await getDocs(transactionsQuery)

  return snapshot.docs.flatMap((docSnap) => {
    const data = docSnap.data() as FirestoreTransactionData
    const base = {
      id: docSnap.id,
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
  })
}

function extractPaymentMethod(invoices: BillingInvoiceItem[]): BillingPaymentMethod | null {
  for (const invoice of invoices) {
    const last4 = getStringMeta(invoice.meta, ['last4', 'cardLast4', 'paymentLast4'])
    if (!last4) continue

    const expiryString = getStringMeta(invoice.meta, ['expiry', 'cardExpiry'])
    const expiryMonth = getNumberMeta(invoice.meta, ['expiryMonth', 'cardExpiryMonth'])
    const expiryYear = getNumberMeta(invoice.meta, ['expiryYear', 'cardExpiryYear'])
    const expiry = expiryString
      ?? (expiryMonth && expiryYear
        ? `${String(expiryMonth).padStart(2, '0')}/${String(expiryYear).slice(-2)}`
        : '—')

    return {
      type: getStringMeta(invoice.meta, ['paymentMethodType', 'cardType']) ?? 'Card',
      last4,
      expiry,
      brand: normalizeBrand(getStringMeta(invoice.meta, ['brand', 'cardBrand', 'paymentBrand'])),
    }
  }

  return null
}

export function useBilling() {
  const { profile, loading, uid } = useUserStore(
    useShallow((s) => ({ profile: s.profile, loading: s.loading, uid: s.profile?.uid ?? null }))
  )

  const subscription = profile?.subscription ?? null
  const balance = profile?.balance ?? null
  const transactionsQuery = useQuery({
    queryKey: ['billing', uid, 'transactions'],
    queryFn: () => fetchTransactions(uid ?? ''),
    enabled: !loading && !!uid,
    staleTime: 5 * 60 * 1000,
  })

  // ─── Credits ──────────────────────────────────────────────────────────────
  // balance.subscription = remaining subscription/monthly credits
  // We show it as the "total" with 0 used since the separate "used" count
  // is not stored client-side (it lives in Firestore statsfor totalCreditsSpent).
  const creditsData: BillingCreditsData | null = balance
    ? {
        monthly: {
          used: 0,
          total: balance.subscription,
          resetDate: formatResetDate(subscription?.currentPeriodEnd),
        },
        bonus: { amount: balance.bonus },
        purchased: { amount: balance.purchased },
      }
    : null

  // ─── Plan ─────────────────────────────────────────────────────────────────
  const planTier = subscription?.planTier
  const planName = planDisplayName(planTier)
  const planDesc = planDescription(planTier)
  const isPro = isPaidPlan(planTier)
  const statusLabel = subscriptionStatusLabel(subscription ?? undefined)
  const transactions = transactionsQuery.data ?? []
  const creditHistory = transactions.filter(
    (transaction): transaction is BillingCreditHistoryItem => transaction.category === 'credit'
  )
  const invoiceHistory = transactions.filter(
    (transaction): transaction is BillingInvoiceItem => transaction.category === 'billing'
  )
  const paymentMethod = extractPaymentMethod(invoiceHistory)

  return {
    loading: loading || transactionsQuery.isLoading,
    subscription,
    balance,
    creditsData,
    planName,
    planDesc,
    isPro,
    statusLabel,
    creditHistory,
    invoiceHistory,
    paymentMethod,
  }
}
