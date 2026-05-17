import type { Seller } from "@/types";

function sellerImage(seed: string) {
  return `https://picsum.photos/seed/shuk-seller-${seed}/400/400`;
}

export const sellers: Seller[] = [
  {
    id: "ani",
    slug: "ani",
    name: { hy: "Անի", ru: "Ани" },
    bio: {
      hy: "Բնական մեղր և մեղրամիս Գառնիից",
      ru: "Натуральный мёд и продукты пчеловодства из Гарни",
    },
    district: "Գառնի",
    image: sellerImage("ani"),
  },
  {
    id: "mariam",
    slug: "mariam",
    name: { hy: "Մարիամ", ru: "Мариам" },
    bio: {
      hy: "Տնային լավաշ և հացեր",
      ru: "Домашний лаваш и выпечка",
    },
    district: "Երևան",
    image: sellerImage("mariam"),
  },
  {
    id: "armen",
    slug: "armen",
    name: { hy: "Արմեն", ru: "Армен" },
    bio: {
      hy: "Կերամիկա և գեղարվեստ",
      ru: "Керамика ручной работы",
    },
    district: "Գյումրի",
    image: sellerImage("armen"),
  },
  {
    id: "lilit",
    slug: "lilit",
    name: { hy: "Լիլիթ", ru: "Лилит" },
    bio: {
      hy: "Արծաթե և հմուտ արդյունակություն",
      ru: "Серебряные украшения",
    },
    district: "Երևան",
    image: sellerImage("lilit"),
  },
  {
    id: "nare",
    slug: "nare",
    name: { hy: "Նարե", ru: "Наре" },
    bio: {
      hy: "Ձեռքով կարում և գործվածք",
      ru: "Вязаные изделия",
    },
    district: "Դիլիջան",
    image: sellerImage("nare"),
  },
  {
    id: "sona",
    slug: "sona",
    name: { hy: "Սոնա", ru: "Сона" },
    bio: {
      hy: "Ազգային գործվածք",
      ru: "Национальный текстиль",
    },
    district: "Երևան",
    image: sellerImage("sona"),
  },
  {
    id: "hakob",
    slug: "hakob",
    name: { hy: "Հակոբ", ru: "Акоб" },
    bio: {
      hy: "Կավի և կերամիկայի արտադրանք",
      ru: "Изделия из глины",
    },
    district: "Աշտարակ",
    image: sellerImage("hakob"),
  },
  {
    id: "gayane",
    slug: "gayane",
    name: { hy: "Գայանե", ru: "Гаяне" },
    bio: {
      hy: "Չրեր և տնական կոնսերվներ",
      ru: "Сухофрукты и домашние заготовки",
    },
    district: "Արարատ",
    image: sellerImage("gayane"),
  },
];
