-- Extra policies for Shuk.am (safe to re-run)

drop policy if exists "orders_update_buyer" on public.orders;
create policy "orders_update_buyer" on public.orders for update
  using (auth.uid() = buyer_id);

-- Allow authenticated users to read their own profile after signup
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert
  with check (auth.uid() = id);
