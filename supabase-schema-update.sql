-- Run this in Supabase SQL Editor to enable new account features

-- Saved addresses
create table if not exists public.user_addresses (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  label      text not null default 'Home',
  full_name  text not null,
  phone      text,
  line1      text not null,
  line2      text,
  city       text not null,
  state      text not null,
  pincode    text not null,
  country    text not null default 'India',
  is_default boolean not null default false,
  created_at timestamptz default now() not null
);
alter table public.user_addresses enable row level security;
create policy "addresses: own all" on public.user_addresses
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Saved blog posts
create table if not exists public.saved_posts (
  user_id  uuid not null references auth.users(id) on delete cascade,
  post_slug text not null,
  saved_at  timestamptz default now() not null,
  primary key (user_id, post_slug)
);
alter table public.saved_posts enable row level security;
create policy "saved_posts: own all" on public.saved_posts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Favorite products
create table if not exists public.favorite_products (
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_slug text not null,
  saved_at     timestamptz default now() not null,
  primary key (user_id, product_slug)
);
alter table public.favorite_products enable row level security;
create policy "favorite_products: own all" on public.favorite_products
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Storage bucket for avatars (run once, or create via Supabase dashboard)
-- insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true)
-- on conflict do nothing;
