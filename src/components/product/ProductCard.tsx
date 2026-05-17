"use client";

import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useLocale } from "@/components/providers/LocaleProvider";
import { formatPrice } from "@/lib/format";
import { getSellerById, getSellerDisplayName } from "@/lib/sellers";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const seller = getSellerById(product.sellerId);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link
        href={`/product/${product.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-wheat"
      >
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <span className="absolute left-3 top-3 rounded-lg bg-white/90 px-2 py-0.5 text-xs font-medium text-terracotta backdrop-blur-sm">
          {t.categoryLabels[product.category]}
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-4 pb-2">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-ink line-clamp-1 hover:text-terracotta">
            {product.name[locale]}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-ink-muted">
          {product.district}
          {seller && (
            <>
              {" · "}
              <Link
                href={`/seller/${seller.slug}`}
                className="text-terracotta hover:underline"
              >
                {getSellerDisplayName(seller, locale)}
              </Link>
            </>
          )}
        </p>
        <p className="mt-3 text-lg font-bold text-terracotta">
          {formatPrice(product.price, locale)}{" "}
          <span className="text-sm font-normal text-ink-muted">֏</span>
        </p>
      </div>
      <div className="px-4 pb-4">
        <AddToCartButton
          productId={product.id}
          variant="compact"
          className="w-full"
        />
      </div>
    </article>
  );
}
