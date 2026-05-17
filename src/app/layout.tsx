import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Armenian } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/components/providers/CartProvider";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const notoArmenian = Noto_Sans_Armenian({
  variable: "--font-noto-arm",
  subsets: ["armenian"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Shuk.am — Армянский маркетплейс",
  description:
    "Покупайте у местных производителей: еда, ремёсла, одежда и товары для дома",
  openGraph: {
    title: "Shuk.am",
    description: "Первый армянский маркетплейс",
    locale: "hy_AM",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${notoSans.variable} ${notoArmenian.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col antialiased">
        <LocaleProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </CartProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
