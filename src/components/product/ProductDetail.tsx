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
    <article className="grid gap-10 lg:grid-cols-2 lg:gap-12">
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-wheat shadow-[var(--shadow-card)] ring-1 ring-gold/20">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="flex flex-col">
        <span className="inline-flex w-fit rounded-full bg-terracotta/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-terracotta">
          {t.categoryLabels[product.category]}
        </span>
        <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {product.name[locale]}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          {product.description[locale]}
        </p>
        <p className="mt-8 font-display text-4xl font-semibold text-terracotta">
          {formatPrice(product.price, locale)}{" "}
          <span className="text-xl font-sans font-normal text-ink-muted">֏</span>
        </p>
        <dl className="mt-8 space-y-3 rounded-2xl border border-gold/25 bg-cream/50 p-5 text-sm">
          <div className="flex gap-2">
            <dt className="min-w-24 text-ink-muted">{t.product.seller}:</dt>
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
            <dt className="min-w-24 text-ink-muted">{t.product.district}:</dt>
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
