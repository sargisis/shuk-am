import type {
  Category,
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  Product,
  Seller,
  User,
  UserRole,
} from "@/types";

export type ProductRow = {
  id: string;
  seller_id: string;
  category: Category;
  price_amd: number;
  district: string;
  image_url: string;
  featured: boolean;
  name_hy: string;
  name_ru: string;
  description_hy: string;
  description_ru: string;
};

export type SellerRow = {
  id: string;
  slug: string;
  owner_id: string | null;
  name_hy: string;
  name_ru: string;
  bio_hy: string;
  bio_ru: string;
  district: string;
  image_url: string;
};

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
};

export type OrderRow = {
  id: string;
  buyer_id: string | null;
  buyer_email: string;
  buyer_name: string;
  total_amd: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  seller_ids: string[];
  created_at: string;
};

export type OrderItemRow = {
  order_id: string;
  product_id: string;
  quantity: number;
  price_amd: number;
  name_hy: string;
  name_ru: string;
};

export function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    sellerId: row.seller_id,
    category: row.category,
    price: row.price_amd,
    district: row.district,
    image: row.image_url,
    featured: row.featured,
    name: { hy: row.name_hy, ru: row.name_ru },
    description: { hy: row.description_hy, ru: row.description_ru },
  };
}

export function mapSeller(row: SellerRow): Seller {
  return {
    id: row.id,
    slug: row.slug,
    name: { hy: row.name_hy, ru: row.name_ru },
    bio: { hy: row.bio_hy, ru: row.bio_ru },
    district: row.district,
    image: row.image_url,
  };
}

export function mapProfileToUser(
  profile: ProfileRow,
  sellerId?: string | null,
): User {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.full_name,
    role: profile.role,
    phone: profile.phone ?? undefined,
    sellerId: sellerId ?? undefined,
    createdAt: new Date().toISOString(),
  };
}

export function mapOrder(row: OrderRow, items: OrderItemRow[]): Order {
  return {
    id: row.id,
    buyerId: row.buyer_id ?? "guest",
    buyerEmail: row.buyer_email,
    buyerName: row.buyer_name,
    totalAmd: row.total_amd,
    status: row.status,
    paymentMethod: row.payment_method,
    createdAt: row.created_at,
    sellerIds: row.seller_ids,
    items: items.map(
      (i): OrderItem => ({
        productId: i.product_id,
        quantity: i.quantity,
        priceAmd: i.price_amd,
        name: { hy: i.name_hy, ru: i.name_ru },
      }),
    ),
  };
}

export function productToRow(product: Product): ProductRow {
  return {
    id: product.id,
    seller_id: product.sellerId,
    category: product.category,
    price_amd: product.price,
    district: product.district,
    image_url: product.image,
    featured: product.featured ?? false,
    name_hy: product.name.hy,
    name_ru: product.name.ru,
    description_hy: product.description.hy,
    description_ru: product.description.ru,
  };
}
