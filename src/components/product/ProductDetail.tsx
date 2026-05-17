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
import { ButtonLink } from "@/components/ui/Button";

export function ProductDetail({ product }: { product: Product }) {
  const { locale, t } = useLocale();
  const seller = getSellerBySlugStatic(product.sellerId);

  return (
    <article className="grid gap-8 lg:grid-cols-2">
      <div className="relative aspect-square overflow-hidden rounded-3xl bg-wheat">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      <div>
        <span className="inline-block rounded-lg bg-terracotta/10 px-2.5 py-1 text-xs font-semibold text-terracotta">
          {t.categoryLabels[product.category]}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-ink">
          {product.name[locale]}
        </h1>
        <p className="mt-4 text-ink-muted leading-relaxed">
          {product.description[locale]}
        </p>
        <p className="mt-6 text-3xl font-bold text-terracotta">
          {formatPrice(product.price, locale)}{" "}
          <span className="text-lg font-normal text-ink-muted">֏</span>
        </p>
        <dl className="mt-6 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-ink-muted">{t.product.seller}:</dt>
            <dd className="font-medium text-ink">
              {seller ? (
                <Link
                  href={`/seller/${seller.slug}`}
                  className="text-terracotta hover:underline"
                >
                  {getSellerDisplayName(seller, locale)}
                </Link>
              ) : (
                product.sellerId
              )}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-ink-muted">{t.product.district}:</dt>
            <dd className="font-medium text-ink">{product.district}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap gap-3">
          <AddToCartButton productId={product.id} />
          <ButtonLink href="/cart" variant="primary">
            {t.nav.cart}
          </ButtonLink>
          <ButtonLink href="/catalog" variant="outline">
            {t.product.back}
          </ButtonLink>
        </div>
      </div>
    </article>
  );
}
