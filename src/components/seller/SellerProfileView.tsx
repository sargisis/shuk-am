"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product/ProductCard";
import { useLocale } from "@/components/providers/LocaleProvider";
import { getProductsBySellerId } from "@/lib/products";
import { getSellerBySlug, getSellerDisplayName } from "@/lib/sellers";
import type { Product, Seller } from "@/types";
import Image from "next/image";

export function SellerProfileView({ slug }: { slug: string }) {
  const { locale, t } = useLocale();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const s = getSellerBySlug(slug);
    setSeller(s ?? null);
    if (s) setProducts(getProductsBySellerId(s.id));
  }, [slug]);

  if (!seller) {
    return (
      <p className="py-20 text-center text-ink-muted">{t.product.notFound}</p>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-6 rounded-3xl border border-gold/25 bg-white p-6 sm:flex-row sm:items-center">
        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-wheat">
          <Image
            src={seller.image}
            alt={getSellerDisplayName(seller, locale)}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-ink">
            {getSellerDisplayName(seller, locale)}
          </h1>
          <p className="mt-1 text-ink-muted">{seller.district}</p>
          <p className="mt-3 leading-relaxed text-ink-muted">
            {seller.bio[locale]}
          </p>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="text-ink-muted">{t.seller.noProducts}</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
