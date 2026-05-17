"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatPrice } from "@/lib/format";
import {
  getSellerBySlugStatic,
  getSellerDisplayName,
} from "@/lib/sellers";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const seller = getSellerBySlugStatic(product.sellerId);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-surface shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[var(--shadow-hover)]">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-wheat"
      >
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        <span className="absolute left-3 top-3 rounded-lg border border-white/30 bg-white/95 px-2.5 py-1 text-xs font-semibold text-terracotta shadow-sm backdrop-blur-sm">
          {t.categoryLabels[product.category]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4 pb-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-ink line-clamp-2 leading-snug transition-colors group-hover:text-terracotta">
            {product.name[locale]}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-ink-muted">
          {product.district}
          {seller && (
            <>
              {" · "}
              <Link
                href={`/seller/${seller.slug}`}
                className="font-medium text-terracotta/90 hover:text-terracotta hover:underline"
              >
                {getSellerDisplayName(seller, locale)}
              </Link>
            </>
          )}
        </p>
        <p className="mt-3 font-display text-xl font-semibold text-terracotta">
          {formatPrice(product.price, locale)}{" "}
          <span className="font-sans text-sm font-normal text-ink-muted">֏</span>
        </p>
      </div>
      <div className="px-4 pb-4 pt-0">
        <AddToCartButton
          productId={product.id}
          variant="compact"
          className="w-full"
        />
      </div>
    </article>
  );
}
