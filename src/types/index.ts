export type Locale = "hy" | "ru";

export type Category = "food" | "crafts" | "clothing" | "home";

export type LocalizedString = Record<Locale, string>;

export interface Product {
  id: string;
  category: Category;
  price: number;
  district: string;
  image: string;
  seller: string;
  featured?: boolean;
  name: LocalizedString;
  description: LocalizedString;
}
