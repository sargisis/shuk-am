"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { useLocale } from "@/components/providers/LocaleProvider";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/format";
import { getProductsBySellerId } from "@/lib/products";
import { generateId } from "@/lib/storage/client";
import {
  deleteSellerProduct,
  getProductsBySellerId as getCustomBySeller,
  saveSellerProduct,
} from "@/lib/storage/seller-products";
import {
  getOrdersForSeller,
  updateOrderStatus,
} from "@/lib/storage/orders";
import type { Category, Order, OrderStatus, Product } from "@/types";
import { ButtonLink } from "@/components/ui/Button";

type Tab = "products" | "orders" | "stats";

const emptyForm = {
  nameHy: "",
  nameRu: "",
  descHy: "",
  descRu: "",
  price: "",
  category: "food" as Category,
  district: "",
  image: "",
};

export function SellerDashboard() {
  const { user, ready } = useAuth();
  const { locale, t } = useLocale();
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const sellerId = user?.sellerId;

  function reload() {
    if (!sellerId) return;
    setProducts(getProductsBySellerId(sellerId));
    setOrders(getOrdersForSeller(sellerId));
  }

  useEffect(() => {
    reload();
  }, [sellerId]);

  const stats = useMemo(() => {
    const revenue = orders
      .filter((o) => o.status !== "cancelled")
      .reduce((s, o) => s + o.totalAmd, 0);
    return {
      products: products.length,
      orders: orders.length,
      revenue,
    };
  }, [products, orders]);

  if (!ready) return null;

  if (!user || user.role !== "seller" || !sellerId) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-ink-muted">{t.seller.dashboardTitle}</p>
        <ButtonLink href="/register" className="mt-4">
          {t.auth.registerTitle}
        </ButtonLink>
      </div>
    );
  }

  function saveProduct(e: React.FormEvent) {
    e.preventDefault();
    if (!sellerId) return;
    const product: Product = {
      id: editingId ?? generateId("prod"),
      sellerId,
      category: form.category,
      price: Number(form.price) || 0,
      district: form.district || "Երևան",
      image:
        form.image ||
        `https://picsum.photos/seed/${generateId("img")}/800/600`,
      name: { hy: form.nameHy, ru: form.nameRu },
      description: { hy: form.descHy, ru: form.descRu },
    };
    saveSellerProduct(product);
    setForm(emptyForm);
    setEditingId(null);
    reload();
  }

  function startEdit(p: Product) {
    setEditingId(p.id);
    setForm({
      nameHy: p.name.hy,
      nameRu: p.name.ru,
      descHy: p.description.hy,
      descRu: p.description.ru,
      price: String(p.price),
      category: p.category,
      district: p.district,
      image: p.image,
    });
  }

  function removeProduct(id: string) {
    if (!sellerId) return;
    deleteSellerProduct(id, sellerId);
    reload();
  }

  const customIds = new Set(getCustomBySeller(sellerId).map((p) => p.id));

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-ink">{t.seller.dashboardTitle}</h1>
        <Link
          href={`/seller/${sellerId}`}
          className="text-sm font-semibold text-terracotta hover:underline"
        >
          {t.seller.viewShop} →
        </Link>
      </div>

      <div className="flex gap-2 border-b border-gold/30 pb-2">
        {(["products", "orders", "stats"] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              tab === key
                ? "bg-terracotta text-white"
                : "text-ink-muted hover:bg-cream"
            }`}
          >
            {key === "products"
              ? t.seller.tabProducts
              : key === "orders"
                ? t.seller.tabOrders
                : t.seller.tabStats}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <div className="space-y-6">
          <form
            onSubmit={saveProduct}
            className="space-y-3 rounded-2xl border border-gold/25 bg-white p-6"
          >
            <h2 className="font-semibold">
              {editingId ? t.seller.editProduct : t.seller.addProduct}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                placeholder={t.seller.productNameHy}
                required
                value={form.nameHy}
                onChange={(e) => setForm({ ...form, nameHy: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm"
              />
              <input
                placeholder={t.seller.productNameRu}
                required
                value={form.nameRu}
                onChange={(e) => setForm({ ...form, nameRu: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm"
              />
              <input
                placeholder={t.seller.price}
                type="number"
                required
                min={1}
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm"
              />
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value as Category })
                }
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm"
              >
                {(
                  ["food", "crafts", "clothing", "home"] as Category[]
                ).map((c) => (
                  <option key={c} value={c}>
                    {t.categoryLabels[c]}
                  </option>
                ))}
              </select>
              <input
                placeholder={t.seller.district}
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm"
              />
              <input
                placeholder={t.seller.imageUrl}
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm sm:col-span-2"
              />
              <textarea
                placeholder={t.seller.productDescHy}
                required
                value={form.descHy}
                onChange={(e) => setForm({ ...form, descHy: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm sm:col-span-2"
                rows={2}
              />
              <textarea
                placeholder={t.seller.productDescRu}
                required
                value={form.descRu}
                onChange={(e) => setForm({ ...form, descRu: e.target.value })}
                className="rounded-xl border border-gold/40 px-3 py-2 text-sm sm:col-span-2"
                rows={2}
              />
            </div>
            <Button type="submit">{t.seller.save}</Button>
          </form>

          {products.length === 0 ? (
            <p className="text-ink-muted">{t.seller.noProducts}</p>
          ) : (
            <ul className="space-y-2">
              {products.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-gold/20 bg-white p-4"
                >
                  <div>
                    <p className="font-medium">{p.name[locale]}</p>
                    <p className="text-sm text-terracotta">
                      {formatPrice(p.price, locale)} ֏
                    </p>
                  </div>
                  {customIds.has(p.id) && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-sm text-terracotta hover:underline"
                      >
                        {t.seller.editProduct}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeProduct(p.id)}
                        className="text-sm text-red-600 hover:underline"
                      >
                        {t.seller.delete}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "orders" && (
        <div>
          {orders.length === 0 ? (
            <p className="text-ink-muted">{t.seller.noOrders}</p>
          ) : (
            <ul className="space-y-3">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="rounded-xl border border-gold/20 bg-white p-4 text-sm"
                >
                  <p className="font-medium">
                    #{order.id.slice(-8)} — {order.buyerName}
                  </p>
                  <p className="text-ink-muted">{order.buyerEmail}</p>
                  <p className="mt-1 font-bold text-terracotta">
                    {formatPrice(order.totalAmd, locale)} ֏
                  </p>
                  <select
                    className="mt-2 rounded-lg border border-gold/40 px-2 py-1"
                    value={order.status}
                    onChange={(e) => {
                      updateOrderStatus(
                        order.id,
                        e.target.value as OrderStatus,
                      );
                      reload();
                    }}
                  >
                    {(
                      [
                        "pending",
                        "paid",
                        "processing",
                        "shipped",
                        "completed",
                        "cancelled",
                      ] as OrderStatus[]
                    ).map((s) => (
                      <option key={s} value={s}>
                        {t.orderStatus[s]}
                      </option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "stats" && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-gold/25 bg-white p-6 text-center">
            <p className="text-3xl font-bold text-terracotta">{stats.products}</p>
            <p className="text-sm text-ink-muted">{t.seller.statsProducts}</p>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-white p-6 text-center">
            <p className="text-3xl font-bold text-terracotta">{stats.orders}</p>
            <p className="text-sm text-ink-muted">{t.seller.statsOrders}</p>
          </div>
          <div className="rounded-2xl border border-gold/25 bg-white p-6 text-center">
            <p className="text-3xl font-bold text-terracotta">
              {formatPrice(stats.revenue, locale)}
            </p>
            <p className="text-sm text-ink-muted">{t.seller.statsRevenue}</p>
          </div>
        </div>
      )}
    </div>
  );
}
