export type Currency = "KZT" | "USD" | "EUR" | "RUB";
export type PaymentProvider = "cloudpayments" | "kaspi";
export type PaymentMethodType = "card" | "qr_code";
export type CardBrand = "Visa" | "Mastercard" | "AmEx" | "Mir";


export interface UserPreferredPaymentMethod {
  provider: PaymentProvider;
  type: PaymentMethodType;
  cardType: CardBrand;
  cardLastFour: string;
  cardFirstSix?: string;
  cardExpirationDate: string; // MM/YY
  currency: Currency;
}

export interface UserBilling {
  preferredPaymentMethod?: UserPreferredPaymentMethod;
}

