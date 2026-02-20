// ================= ENUMS =================

export type TransactionCategory = 'billing' | 'credit';

export type TransactionStatus =
  | 'pending'
  | 'completed'
  | 'declined'
  | 'refunded'
  | 'chargeback'
  | 'chargeback_won';

export type Currency = 'KZT' | 'USD' | 'EUR' | 'RUB';

export type Direction = 'in' | 'out';

// ================= COMMON =================

export interface BalanceSnapshot {
  total: number;
  purchased: number;
  subscription: number;
  bonus: number;
}

interface BaseTransaction {
  version: number;

  tid: string;
  uid: string;

  createdAt: string;      // ISO
  processedAt?: string;   // ISO (когда подтверждено / обновлено)

  status: TransactionStatus;
  direction: Direction;

  category: TransactionCategory;

  idempotencyKey: string;
  isManual: boolean;

  termsVersion: number;
  clientIpCountry: string;
  balanceSnapshot: BalanceSnapshot;
}

// ================= BILLING (FIAT) =================

export type BillingType =
  | 'buy_credits'
  | 'subscription_purchase'
  | 'subscription_renewal'
  | 'subscription_change'
  | 'refund'
  | 'chargeback';

export interface BillingTransaction extends BaseTransaction {
  category: 'billing';
  type: BillingType;

  // Деньги храним в минимальных единицах (тиыны / центы)
  currency: Currency;
  currencyAmountMinor: number;

  // Если транзакция связана с предыдущей (refund / chargeback)
  originalTransactionId?: string;

  metadata: {
    provider: 'cloudpayments' | 'kaspi' | 'admin_panel';

    cpTransactionId?: string;
    cpInvoiceId?: string;

    cardLastFour?: string;
    cardType?: string;
    cardExpDate?: string;
    issuerBankCountry?: string;

    packId?: string;
    planId?: string;
    promoCode?: string;

    declinedReason?: string;
    errorCode?: string;
  };
}

// ================= CREDIT (INTERNAL ECONOMY) =================

export type CreditType =
  | 'spend'               // публикация
  | 'grant'               // начисление (покупка, подписка, бонус)
  | 'expire'              // сгорание
  | 'compensation'        // компенсация
  | 'admin_adjustment'    // ручная правка
  | 'usage_refund';       // возврат за неудачную операцию

export interface CreditTransaction extends BaseTransaction {
  category: 'credit';
  type: CreditType;

  // Всегда положительное число
  amount: number;

  // Никогда нет валюты
  currency?: never;
  currencyAmountMinor?: never;

  // Связь с биллингом (если начисление после оплаты)
  relatedBillingId?: string;

  metadata: {
    projectId?: string;
    projectTitle?: string;

    itemType?: 'photobook' | 'portfolio';

    promoCode?: string;
    referralUserId?: string;

    adminId?: string;
    supportTicketId?: string;

    reason?: string; // общее текстовое пояснение
  };
}

// ================= UNION =================

export type Transaction =
  | BillingTransaction
  | CreditTransaction;