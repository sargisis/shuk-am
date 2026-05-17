import type { Category, Locale } from "@/types";

export interface Dictionary {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    home: string;
    catalog: string;
    sell: string;
    order: string;
    cart: string;
  };
  hero: {
    title: string;
    subtitle: string;
    ctaShop: string;
    ctaSell: string;
  };
  categories: {
    title: string;
    food: string;
    crafts: string;
    clothing: string;
    home: string;
    viewAll: string;
  };
  popular: {
    title: string;
    subtitle: string;
  };
  why: {
    title: string;
    items: { title: string; text: string }[];
  };
  catalog: {
    title: string;
    subtitle: string;
    filters: string;
    allCategories: string;
    maxPrice: string;
    district: string;
    districtPlaceholder: string;
    apply: string;
    reset: string;
    empty: string;
    results: string;
  };
  product: {
    seller: string;
    district: string;
    buy: string;
    addToCart: string;
    back: string;
    notFound: string;
  };
  cart: {
    title: string;
    empty: string;
    emptyCta: string;
    total: string;
    quantity: string;
    remove: string;
    clear: string;
    payStripe: string;
    payStripeHint: string;
    payTelegram: string;
    stripeTestNote: string;
    stripeNotConfigured: string;
    processing: string;
    continueShopping: string;
  };
  checkout: {
    successTitle: string;
    successText: string;
    cancelTitle: string;
    cancelText: string;
    backToCart: string;
    backHome: string;
  };
  sell: {
    title: string;
    subtitle: string;
    benefits: string[];
    cta: string;
    formNote: string;
    telegram: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
  categoryLabels: Record<Category, string>;
}

export type { Locale };
