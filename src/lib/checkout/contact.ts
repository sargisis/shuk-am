export interface CheckoutContact {
  name: string;
  email: string;
  phone: string;
}

export function resolveCheckoutContact(
  input: Partial<CheckoutContact>,
  user?: { name: string; email: string; phone?: string } | null,
): { contact: CheckoutContact } | { error: string } {
  const name = (input.name?.trim() || user?.name || "").trim();
  const email = (input.email?.trim() || user?.email || "").trim().toLowerCase();
  const phone = (input.phone?.trim() || user?.phone || "").trim();

  if (!name || name.length < 2) {
    return { error: "invalid_name" };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "invalid_email" };
  }
  if (!phone || phone.length < 6) {
    return { error: "invalid_phone" };
  }

  return { contact: { name, email, phone } };
}
