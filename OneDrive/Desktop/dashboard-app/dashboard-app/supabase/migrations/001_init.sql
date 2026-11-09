-- Run in Supabase > SQL Editor (or keep as a migration file)
create table if not exists public.orders (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  customer text not null,
  product text not null,
  amount numeric(10,2) not null check (amount >= 0),
  created_at timestamptz not null default now()
);

create index if not exists orders_user_created_idx
  on public.orders (user_id, created_at desc);

-- Defense in depth: even if someone queries Supabase directly with the
-- anon key, they can only touch their own rows. The Express server uses
-- the service key (bypasses RLS) and filters by user_id itself.
alter table public.orders enable row level security;

drop policy if exists "users manage own orders" on public.orders;
create policy "users manage own orders" on public.orders
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
