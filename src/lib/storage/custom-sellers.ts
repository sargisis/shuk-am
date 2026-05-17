import type { Seller } from "@/types";
import { readJson, writeJson } from "./client";
import { STORAGE_KEYS } from "./keys";

const KEY = "shuk-custom-sellers";

export function getCustomSellers(): Seller[] {
  return readJson<Seller[]>(KEY, []);
}

export function saveCustomSeller(seller: Seller) {
  const all = getCustomSellers();
  const idx = all.findIndex((s) => s.id === seller.id);
  if (idx >= 0) all[idx] = seller;
  else all.push(seller);
  writeJson(KEY, all);
}
