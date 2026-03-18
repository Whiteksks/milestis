// --- ENUMS ---

export interface BalanceSnapshot {
  total: number;
  purchased: number;
  subscription: number;
  bonus: number;
}

export interface SpendMetadata {
  projectId: string;
  action: 'publish' | 'renew' | 'highlight'; 
  projectNameSnapshot: string; 
  ipAddress?: string; // Полезно для отслеживания фрода (мультиаккаунтов)
}
export interface PurchaseMetadata {
  paddlePriceId: string;
  paddleProductId: string;
  promocodeApplied?: string;
}
export interface RefundMetadata {
  reason: string;
  supportTicketId?: string;
  issuedByAdminId?: string;
}
export type DefaultMetadata = Record<string, unknown>;

// Типы транзакций в вашей БД
export enum TransactionType {
  PADDLE_PAYMENT = 'PADDLE_PAYMENT',     // Реальные деньги прошли через Paddle
  CREDIT_PURCHASE = 'CREDIT_PURCHASE',   // Начисление кредитов за покупку
  CREDIT_SPEND = 'CREDIT_SPEND',         // Списание кредитов за услуги сайта
  CREDIT_REFUND = 'CREDIT_REFUND',       // Возврат кредитов (например, при ошибке)
}

// Актуальные статусы транзакций из API Paddle Billing
export enum PaddleTransactionStatus {
  COMPLETED = 'completed',
  BILLED = 'billed',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
  REFUNDED = 'refunded',
}

// --- ИНТЕРФЕЙСЫ ---

/**
 * 1. Базовый интерфейс для ЛЮБОЙ транзакции в вашей БД.
 */
export interface ITransactionBase {
  id: string;             // Внутренний ID транзакции в вашей БД (UUID/ObjectId)
  userId: string;         // ID пользователя в вашей системе
  type: TransactionType;  // Тип операции
  createdAt: Date;        // Дата создания записи
}

/**
 * 2. Финансовая транзакция (Эквайринг Paddle).
 * Содержит только реальные поля, которые приходят в вебхуках Paddle (transaction.completed).
 */
export interface IPaddleMonetaryTransaction extends ITransactionBase {
  type: TransactionType.PADDLE_PAYMENT;
  
  // КРИТИЧНО: ID события вебхука (начинается с evt_...). 
  // По нему вы проверяете, не обрабатывали ли вы этот платеж ранее.
  paddleEventId: string;       
  
  // Уникальный ID самой транзакции в Paddle (начинается с txn_...)
  paddleTransactionId: string; 
  
  // ID покупателя в Paddle (начинается с ctm_...)
  paddleCustomerId?: string;   
  
  amount: string;              // Сумма (в API Paddle суммы часто приходят строками, например "15.00", чтобы избежать потери точности float)
  currency: string;            // Код валюты (USD, EUR)
  status: PaddleTransactionStatus; 

  // Ссылка на внутреннюю транзакцию начисления кредитов, 
  // чтобы вы могли легко найти, какие именно кредиты были выданы за эти деньги.
  relatedCreditTransactionId?: string; 
}

/**
 * 3. Кредитная транзакция (Ваша внутренняя экономика).
 * Описывает движение ваших виртуальных кредитов.
 */
export interface ICreditTransaction extends ITransactionBase {
  type: TransactionType.CREDIT_PURCHASE | TransactionType.CREDIT_SPEND | TransactionType.CREDIT_REFUND;
  
  // Количество кредитов (положительное при покупке/возврате, отрицательное при трате)
  creditAmount: number; 
  
  // Снапшот баланса ПОСЛЕ транзакции. 
  // Жизненно важно для аудита, если баланс вдруг "поедет" из-за race conditions.
  balanceAfter: BalanceSnapshot; 
  
  // Метаданные для аналитики (например, projectId, action)
  metadata: SpendMetadata | PurchaseMetadata | RefundMetadata | DefaultMetadata;  
  // Если кредиты получены за реальные деньги, здесь хранится ID из БД (от IPaddleMonetaryTransaction)
  linkedMonetaryTransactionId?: string; 
}