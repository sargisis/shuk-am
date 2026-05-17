import type { Category, SellerApplication } from "@/types";
import { generateId, readJson, writeJson } from "./client";
import { STORAGE_KEYS } from "./keys";

export function getApplications(): SellerApplication[] {
  return readJson<SellerApplication[]>(STORAGE_KEYS.applications, []);
}

export function submitApplication(input: {
  name: string;
  email: string;
  phone: string;
  category: Category;
  message: string;
}) {
  const app: SellerApplication = {
    id: generateId("app"),
    ...input,
    createdAt: new Date().toISOString(),
  };
  const all = getApplications();
  all.unshift(app);
  writeJson(STORAGE_KEYS.applications, all);
  return app;
}
