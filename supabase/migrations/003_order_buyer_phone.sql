alter table public.orders
  add column if not exists buyer_phone text;
