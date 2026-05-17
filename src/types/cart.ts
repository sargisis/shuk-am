export interface CartItem {
  productId: string;
  quantity: number;
}

export type PaymentProviderId = "stripe" | "telegram";
