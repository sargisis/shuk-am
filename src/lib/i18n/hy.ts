import type { Dictionary } from "./types";

const hy: Dictionary = {
  meta: {
    title: "Shuk.am — Հայկական մարկետփլեյս",
    description:
      "Տեղական արտադրողներից գնումներ առցանց՝ սնունդ, արհեստ, հագուստ և տուն",
  },
  nav: {
    home: "Գլխավոր",
    catalog: "Կատալոգ",
    sell: "Վաճառել",
    order: "Պատվիրել",
    cart: "Զամբյուղ",
  },
  hero: {
    title: "Հայկական շուկան՝ ձեր տանը",
    subtitle:
      "Գտեք տեղական սնունդ, արհեստ, հագուստ և ավելին։ Աջակցեք հայ արտադրողներին։",
    ctaShop: "Դիտել ապրանքները",
    ctaSell: "Դառնալ վաճառող",
  },
  categories: {
    title: "Կատեգորիաներ",
    food: "Սնունդ",
    crafts: "Արհեստ",
    clothing: "Հագուստ",
    home: "Տուն",
    viewAll: "Բոլորը",
  },
  popular: {
    title: "Հայտնի ապրանքներ",
    subtitle: "Ընտրված տեղական արտադրողներից",
  },
  why: {
    title: "Ինչու Shuk.am",
    items: [
      {
        title: "Տեղական",
        text: "Ապրանքներ հայ արտադրողներից և վարպետներից",
      },
      {
        title: "Հեշտ պատվեր",
        text: "Գտեք, պատվիրեք և ստացեք առաքումով",
      },
      {
        title: "Աջակցեք մասնագետներին",
        text: "Օգնեք փոքր բիզնեսին աճել առցանց",
      },
    ],
  },
  catalog: {
    title: "Կատալոգ",
    subtitle: "Բոլոր ապրանքները տեղական վաճառողներից",
    filters: "Զտիչներ",
    allCategories: "Բոլոր կատեգորիաները",
    maxPrice: "Առավելագույն գին (դր.)",
    district: "Շրջան",
    districtPlaceholder: "Օր. Երևան",
    apply: "Կիրառել",
    reset: "Մաքրել",
    empty: "Ապրանքներ չեն գտնվել",
    results: "ապրանք",
  },
  product: {
    seller: "Վաճառող",
    district: "Շրջան",
    buy: "Պատվիրել Telegram",
    addToCart: "Զամբյուղ",
    back: "Հետ կատալոգ",
    notFound: "Ապրանքը չի գտնվել",
  },
  cart: {
    title: "Զամբյուղ",
    empty: "Զամբյուղը դատարկ է",
    emptyCta: "Դիտել կատալոգը",
    total: "Ընդամենը",
    quantity: "Քանակ",
    remove: "Հեռացնել",
    clear: "Մաքրել",
    payStripe: "Վճարել քարտով (Stripe test)",
    payStripeHint: "Փորձարկման ռեժիմ",
    payTelegram: "Պատվիրել Telegram-ում",
    stripeTestNote:
      "Stripe test — գինը USD-ով է փորձարկման համար։ Ապագայում՝ ArCa / IDram։",
    stripeNotConfigured:
      "Ավելացրեք Stripe բանալիները .env.local-ում (տես README)",
    processing: "Բեռնվում է…",
    continueShopping: "Շարունակել գնումները",
  },
  checkout: {
    successTitle: "Շնորհավորում ենք",
    successText: "Վճարումը հաջող էր (կամ ստուգվում է)։ Կկապվենք ձեզ հետ։",
    cancelTitle: "Վճարումը չեղարկված է",
    cancelText: "Դուք կարող եք փորձել կրկին կամ պատվիրել Telegram-ում։",
    backToCart: "Զամբյուղ",
    backHome: "Գլխավոր",
  },
  sell: {
    title: "Վաճառեք Shuk.am-ում",
    subtitle:
      "Միացեք առաջին տեղական վաճառողներին։ Ստեղծեք ձեր խանութը մի քանի րոպեում։",
    benefits: [
      "Անվճար 3 ամիս առաջին վաճառողների համար",
      "Օգնություն լուսանկարներով և նկարագրությամբ",
      "Հասանելիություն գնորդների և սփյուռքին",
    ],
    cta: "Գրանցվել Telegram-ում",
    formNote:
      "Կապվեք մեզ հետ՝ ձեր ապրանքները ավելացնելու համար։ Շուտով՝ անձնական գրասենյակ։",
    telegram: "@shuk.am",
  },
  footer: {
    tagline: "Առաջին հայկական մարկետփլեյս",
    rights: "Բոլոր իրավունքները պաշտպանված են",
  },
  categoryLabels: {
    food: "Սնունդ",
    crafts: "Արհեստ",
    clothing: "Հագուստ",
    home: "Տուն",
  },
};

export default hy;
