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
    login: string;
    account: string;
    dashboard: string;
    logout: string;
    about: string;
    delivery: string;
    howToOrder: string;
  };
  auth: {
    loginTitle: string;
    registerTitle: string;
    email: string;
    password: string;
    name: string;
    phone: string;
    shopName: string;
    roleBuyer: string;
    roleSeller: string;
    submitLogin: string;
    submitRegister: string;
    noAccount: string;
    hasAccount: string;
    demoNote: string;
  };
  account: {
    title: string;
    profile: string;
    orders: string;
    noOrders: string;
    orderId: string;
    status: string;
  };
  seller: {
    dashboardTitle: string;
    tabProducts: string;
    tabOrders: string;
    tabStats: string;
    addProduct: string;
    editProduct: string;
    delete: string;
    save: string;
    statsProducts: string;
    statsOrders: string;
    statsRevenue: string;
    viewShop: string;
    noProducts: string;
    noOrders: string;
    productNameHy: string;
    productNameRu: string;
    productDescHy: string;
    productDescRu: string;
    price: string;
    category: string;
    imageUrl: string;
    district: string;
  };
  pages: {
    aboutTitle: string;
    aboutText: string;
    deliveryTitle: string;
    deliveryText: string;
    howToOrderTitle: string;
    howToOrderSteps: string[];
  };
  sell: {
    title: string;
    subtitle: string;
    benefits: string[];
    cta: string;
    formNote: string;
    telegram: string;
    formTitle: string;
    formSubmit: string;
    formSuccess: string;
    message: string;
  };
  orderStatus: Record<
    import("@/types").OrderStatus,
    string
  >;
  errors: Record<string, string>;
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
    contactTitle: string;
    contactHint: string;
  };
  checkout: {
    successTitle: string;
    successText: string;
    cancelTitle: string;
    cancelText: string;
    backToCart: string;
    backHome: string;
  };
  footer: {
    tagline: string;
    rights: string;
  };
  categoryLabels: Record<Category, string>;
}

export type { Locale };
