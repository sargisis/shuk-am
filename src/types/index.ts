export type Locale = "hy" | "ru";

export type Category = "food" | "crafts" | "clothing" | "home";

export type UserRole = "buyer" | "seller";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type PaymentMethod = "telegram" | "stripe" | "manual";

export type LocalizedString = Record<Locale, string>;

export interface Seller {
  id: string;
  slug: string;
  name: LocalizedString;
  bio: LocalizedString;
  district: string;
  image: string;
}

export interface Product {
  id: string;
  sellerId: string;
  category: Category;
  price: number;
  district: string;
  image: string;
  featured?: boolean;
  name: LocalizedString;
  description: LocalizedString;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  sellerId?: string;
  phone?: string;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAmd: number;
  name: LocalizedString;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  items: OrderItem[];
  totalAmd: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  sellerIds: string[];
}

export interface SellerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: Category;
  message: string;
  createdAt: string;
}
