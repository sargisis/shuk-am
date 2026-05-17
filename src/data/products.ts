import type { Product } from "@/types";

/** Stable demo images (picsum.photos seeds — no broken Unsplash IDs). */
function productImage(seed: string) {
  return `https://picsum.photos/seed/shuk-${seed}/800/600`;
}

export const products: Product[] = [
  {
    id: "honey-garni",
    category: "food",
    price: 4500,
    district: "Գառնի",
    image: productImage("honey"),
    seller: "Անի",
    featured: true,
    name: { hy: "Բնական մեղր", ru: "Натуральный мёд" },
    description: {
      hy: "Լեռնային մեղր Գառնիից, 500 գ",
      ru: "Горный мёд из Гарни, 500 г",
    },
  },
  {
    id: "lavash-traditional",
    category: "food",
    price: 800,
    district: "Երևան",
    image: productImage("lavash"),
    seller: "Մարիամ",
    featured: true,
    name: { hy: "Լավաշ տնային", ru: "Домашний лаваш" },
    description: {
      hy: "Թարմ լավաշ, 5 հատ",
      ru: "Свежий лаваш, 5 штук",
    },
  },
  {
    id: "ceramic-bowl",
    category: "crafts",
    price: 12000,
    district: "Գյումրի",
    image: productImage("ceramic"),
    seller: "Արմեն",
    featured: true,
    name: { hy: "Կերամիկայի կուժ", ru: "Керамическая чаша" },
    description: {
      hy: "Ձեռքով պատրաստված, հատուկ նախշ",
      ru: "Ручная работа, уникальный узор",
    },
  },
  {
    id: "silver-bracelet",
    category: "crafts",
    price: 28000,
    district: "Երևան",
    image: productImage("bracelet"),
    seller: "Լիլիթ",
    featured: true,
    name: { hy: "Արծաթե թևնոց", ru: "Серебряный браслет" },
    description: {
      hy: "Արտիսանական արծաթ, չափը կարգավորվող",
      ru: "Артизанское серебро, регулируемый размер",
    },
  },
  {
    id: "knit-sweater",
    category: "clothing",
    price: 35000,
    district: "Դիլիջան",
    image: productImage("sweater"),
    seller: "Նարե",
    name: { hy: "Ձեռքով կարած զգավեստ", ru: "Вязаный свитер" },
    description: {
      hy: "100% բուրդ, չափ M",
      ru: "100% шерсть, размер M",
    },
  },
  {
    id: "national-scarf",
    category: "clothing",
    price: 15000,
    district: "Երևան",
    image: productImage("scarf"),
    seller: "Սոնա",
    name: { hy: "Ազգային շալ", ru: "Национальный шарф" },
    description: {
      hy: "Վուշի գույներ, մեղմ բամբակ",
      ru: "Цвета войлока, мягкий хлопок",
    },
  },
  {
    id: "clay-pot",
    category: "home",
    price: 8500,
    district: "Աշտարակ",
    image: productImage("clay-pot"),
    seller: "Հակոբ",
    name: { hy: "Կավի կուժ", ru: "Глиняный горшок" },
    description: {
      hy: "Բնական կավ, կերամիկայի համար",
      ru: "Натуральная глина, для керамики",
    },
  },
  {
    id: "dried-fruits",
    category: "food",
    price: 3200,
    district: "Արարատ",
    image: productImage("dried-fruits"),
    seller: "Գայանե",
    name: { hy: "Չրերի հավաքածու", ru: "Набор сухофруктов" },
    description: {
      hy: "Ճիշտ, տանձ, սալոր — 400 գ",
      ru: "Айва, яблоко, слива — 400 г",
    },
  },
];
