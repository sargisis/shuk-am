-- Shuk.am schema — run in Supabase SQL Editor (or via CLI)

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  role text not null default 'buyer' check (role in ('buyer', 'seller')),
  created_at timestamptz not null default now()
);

-- Sellers (shop)
create table if not exists public.sellers (
  id text primary key,
  slug text not null unique,
  owner_id uuid references public.profiles (id) on delete set null,
  name_hy text not null,
  name_ru text not null,
  bio_hy text not null default '',
  bio_ru text not null default '',
  district text not null default 'Երևան',
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  seller_id text not null references public.sellers (id) on delete cascade,
  category text not null check (category in ('food', 'crafts', 'clothing', 'home')),
  price_amd integer not null check (price_amd > 0),
  district text not null,
  image_url text not null,
  featured boolean not null default false,
  name_hy text not null,
  name_ru text not null,
  description_hy text not null default '',
  description_ru text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  buyer_id uuid references public.profiles (id) on delete set null,
  buyer_email text not null,
  buyer_name text not null,
  total_amd integer not null,
  status text not null default 'pending' check (
    status in ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled')
  ),
  payment_method text not null default 'telegram' check (
    payment_method in ('telegram', 'stripe', 'manual')
  ),
  seller_ids text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null references public.products (id),
  quantity integer not null check (quantity > 0 and quantity < 100),
  price_amd integer not null,
  name_hy text not null,
  name_ru text not null
);

create table if not exists public.seller_applications (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text not null,
  category text not null,
  message text not null default '',
  created_at timestamptz not null default now()
);

-- Auto profile + seller on signup (reads user_metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_role text;
  shop_name text;
  seller_slug text;
begin
  user_role := coalesce(new.raw_user_meta_data->>'role', 'buyer');
  shop_name := coalesce(new.raw_user_meta_data->>'shop_name', new.raw_user_meta_data->>'full_name', 'Shop');
  seller_slug := coalesce(
    new.raw_user_meta_data->>'seller_slug',
    lower(regexp_replace(shop_name, '[^a-z0-9]+', '-', 'g')) || '-' || substr(new.id::text, 1, 6)
  );

  insert into public.profiles (id, email, full_name, phone, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    user_role
  );

  if user_role = 'seller' then
    insert into public.sellers (id, slug, owner_id, name_hy, name_ru, bio_hy, bio_ru, district, image_url)
    values (
      seller_slug,
      seller_slug,
      new.id,
      shop_name,
      shop_name,
      'Տեղական արտադրող Shuk.am-ում',
      'Местный продавец на Shuk.am',
      'Երևան',
      'https://picsum.photos/seed/' || seller_slug || '/400/400'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.sellers enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.seller_applications enable row level security;

-- Profiles: own row
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

-- Sellers & products: public read
create policy "sellers_public_read" on public.sellers for select using (true);
create policy "products_public_read" on public.products for select using (true);

-- Sellers: owner update own shop
create policy "sellers_update_own" on public.sellers for update using (auth.uid() = owner_id);

-- Products: seller manages own products
create policy "products_insert_seller" on public.products for insert
  with check (
    exists (
      select 1 from public.sellers s
      where s.id = seller_id and s.owner_id = auth.uid()
    )
  );

create policy "products_update_seller" on public.products for update
  using (
    exists (
      select 1 from public.sellers s
      where s.id = seller_id and s.owner_id = auth.uid()
    )
  );

create policy "products_delete_seller" on public.products for delete
  using (
    exists (
      select 1 from public.sellers s
      where s.id = seller_id and s.owner_id = auth.uid()
    )
  );

-- Orders: buyer sees own; seller sees orders with their seller_id in array
create policy "orders_select_buyer" on public.orders for select
  using (auth.uid() = buyer_id);

create policy "orders_select_seller" on public.orders for select
  using (
    exists (
      select 1 from public.sellers s
      where s.owner_id = auth.uid() and s.id = any (seller_ids)
    )
  );

create policy "orders_insert_any" on public.orders for insert with check (true);

create policy "orders_update_seller" on public.orders for update
  using (
    exists (
      select 1 from public.sellers s
      where s.owner_id = auth.uid() and s.id = any (seller_ids)
    )
  );

-- Order items: readable if order is readable
create policy "order_items_select" on public.order_items for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id
        and (
          o.buyer_id = auth.uid()
          or exists (
            select 1 from public.sellers s
            where s.owner_id = auth.uid() and s.id = any (o.seller_ids)
          )
        )
    )
  );

create policy "order_items_insert" on public.order_items for insert with check (true);

-- Applications: anyone can submit
create policy "applications_insert" on public.seller_applications for insert with check (true);
create policy "applications_select" on public.seller_applications for select using (auth.role() = 'service_role');
