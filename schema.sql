-- =====================================================================
-- ASTRA E-Commerce — Complete Database Schema (Supabase / PostgreSQL)
-- =====================================================================
-- HOW TO APPLY:
--   1. Open your Supabase project -> SQL Editor -> New query.
--   2. Paste this ENTIRE file and click "Run".
--   3. It is safe to re-run: it drops and recreates everything cleanly.
--
-- WHAT THIS FIXES (important):
--   The previous admin RLS policies queried `profiles` from inside a
--   `profiles` policy, which Postgres rejects with:
--       "infinite recursion detected in policy for relation profiles"
--   That broke the admin Customers / Orders / Products pages.
--   This version uses a SECURITY DEFINER `public.is_admin()` helper that
--   bypasses RLS, eliminating the recursion and wiring the admin pages
--   (products, orders, customers, settings) to the database correctly.
-- =====================================================================

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- Clean slate (cascade removes dependent policies/triggers/objects)
-- ---------------------------------------------------------------------
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.store_settings cascade;
drop table if exists public.profiles cascade;
drop function if exists public.is_admin() cascade;
drop function if exists public.handle_new_user() cascade;
drop function if exists public.update_updated_at_column() cascade;

-- ==========================================
-- 1. PROFILES
-- ==========================================
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    email text,
    role text default 'user' check (role in ('user', 'admin')),
    avatar_url text,
    phone text,
    address text,
    city text,
    country text,
    bio text,
    created_at timestamptz default timezone('utc', now()) not null,
    updated_at timestamptz default timezone('utc', now()) not null
);
comment on table public.profiles is 'User profile metadata + security role, linked 1:1 to auth.users.';

-- ==========================================
-- 2. PRODUCTS
-- ==========================================
create table public.products (
    id bigint generated always as identity primary key,
    name text not null,
    description text,
    price numeric(10, 2) not null check (price >= 0),
    category text not null,
    image_url text,
    images text[] default '{}'::text[],
    stock integer default 0 check (stock >= 0),
    status text default 'active' check (status in ('active', 'draft', 'archived')),
    seller_id uuid references public.profiles(id) on delete set null,
    specs jsonb default '{}'::jsonb,
    created_at timestamptz default timezone('utc', now()) not null,
    updated_at timestamptz default timezone('utc', now()) not null
);
comment on table public.products is 'Product catalog with inventory, specs and seller reference.';

-- ==========================================
-- 3. ORDERS
-- ==========================================
create table public.orders (
    id text primary key, -- e.g. ORD-1717171717171 (generated on the client)
    user_id uuid references public.profiles(id) on delete set null,
    first_name text not null,
    last_name text not null,
    email text not null,
    address text not null,
    city text not null,
    country text default 'Sri Lanka' not null,
    amount numeric(10, 2) not null check (amount >= 0),
    currency text default 'LKR' not null,
    payment_method text default 'card' not null,
    status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'cancelled')),
    created_at timestamptz default timezone('utc', now()) not null,
    updated_at timestamptz default timezone('utc', now()) not null
);
comment on table public.orders is 'Customer orders, payment + shipping details.';

-- ==========================================
-- 4. ORDER ITEMS
-- ==========================================
create table public.order_items (
    id bigint generated always as identity primary key,
    order_id text references public.orders(id) on delete cascade not null,
    product_id bigint references public.products(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price numeric(10, 2) not null check (price >= 0),
    created_at timestamptz default timezone('utc', now()) not null
);
comment on table public.order_items is 'Line items per order with purchase-time pricing.';

-- ==========================================
-- 5. STORE SETTINGS
-- ==========================================
create table public.store_settings (
    id bigint generated always as identity primary key,
    store_name text not null default 'ASTRA Store',
    support_email text not null default 'support@astra.com',
    currency text not null default 'USD',
    updated_at timestamptz default timezone('utc', now()) not null
);
comment on table public.store_settings is 'Global store configuration managed from the admin panel.';

-- ==========================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==========================================

-- Auto-touch updated_at
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc', now());
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at       before update on public.profiles       for each row execute function public.update_updated_at_column();
create trigger update_products_updated_at       before update on public.products       for each row execute function public.update_updated_at_column();
create trigger update_orders_updated_at         before update on public.orders         for each row execute function public.update_updated_at_column();
create trigger update_store_settings_updated_at before update on public.store_settings for each row execute function public.update_updated_at_column();

-- ---------------------------------------------------------------------
-- is_admin(): SECURITY DEFINER so it bypasses RLS and CANNOT recurse.
-- This is the key to wiring admin pages to the DB without errors.
-- ---------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
    select exists (
        select 1 from public.profiles
        where id = auth.uid() and role = 'admin'
    );
$$;

-- Mirror new auth users into profiles (handles email + Google sign-ups).
create or replace function public.handle_new_user()
returns trigger as $$
declare
    display_name text;
    avatar text;
    user_role text := 'user';
begin
    display_name := coalesce(
        new.raw_user_meta_data->>'name',
        new.raw_user_meta_data->>'full_name',
        nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
        'User'
    );

    avatar := coalesce(
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'picture',
        'https://ui-avatars.com/api/?name=' || replace(display_name, ' ', '+') || '&background=6366f1&color=fff&bold=true'
    );

    if new.email = 'admin@astra.com' then
        user_role := 'admin';
    end if;

    insert into public.profiles (id, name, email, role, avatar_url)
    values (new.id, display_name, new.email, user_role, avatar)
    on conflict (id) do update
        set name = excluded.name,
            email = excluded.email,
            avatar_url = coalesce(public.profiles.avatar_url, excluded.avatar_url);

    return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ==========================================
-- ROW LEVEL SECURITY
-- ==========================================
alter table public.profiles       enable row level security;
alter table public.products       enable row level security;
alter table public.orders         enable row level security;
alter table public.order_items    enable row level security;
alter table public.store_settings enable row level security;

-- ---------- PROFILES ----------
create policy "profiles_select_all"
    on public.profiles for select using (true);

create policy "profiles_update_own"
    on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create policy "profiles_insert_own"
    on public.profiles for insert with check (auth.uid() = id);

create policy "profiles_admin_all"
    on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ---------- PRODUCTS ----------
create policy "products_select_active_or_owner"
    on public.products for select
    using (status = 'active' or auth.uid() = seller_id or public.is_admin());

create policy "products_insert_owner"
    on public.products for insert with check (auth.uid() = seller_id or public.is_admin());

create policy "products_update_owner"
    on public.products for update using (auth.uid() = seller_id or public.is_admin());

create policy "products_delete_owner"
    on public.products for delete using (auth.uid() = seller_id or public.is_admin());

-- ---------- ORDERS ----------
create policy "orders_select_own_or_admin"
    on public.orders for select using (auth.uid() = user_id or public.is_admin());

create policy "orders_insert_anyone"
    on public.orders for insert with check (true);

create policy "orders_update_admin"
    on public.orders for update using (public.is_admin());

create policy "orders_delete_admin"
    on public.orders for delete using (public.is_admin());

-- ---------- ORDER ITEMS ----------
create policy "order_items_select_own_or_admin"
    on public.order_items for select
    using (
        public.is_admin()
        or exists (
            select 1 from public.orders
            where orders.id = order_items.order_id and orders.user_id = auth.uid()
        )
    );

create policy "order_items_insert_anyone"
    on public.order_items for insert with check (true);

create policy "order_items_modify_admin"
    on public.order_items for all using (public.is_admin()) with check (public.is_admin());

-- ---------- STORE SETTINGS ----------
create policy "store_settings_select_all"
    on public.store_settings for select using (true);

create policy "store_settings_admin_write"
    on public.store_settings for all using (public.is_admin()) with check (public.is_admin());

-- ==========================================
-- SEED DATA
-- ==========================================
insert into public.products (name, description, price, category, image_url, images, stock, status, specs)
values
(
    'Premium Leather Jacket',
    'Experience ultimate luxury with our premium leather jacket. Handcrafted from Italian leather, it features a modern slim fit and durable hardware. Perfect for any occasion.',
    299.00, 'Outerwear',
    'https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&q=80&w=800','https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800'],
    15, 'active',
    '{"material": "100% Full-grain Italian Leather", "lining": "Viscose Rayon", "fit": "Slim Fit", "care": "Professional Leather Clean Only"}'::jsonb
),
(
    'Minimalist Watch',
    'A clean, timeless timepiece designed for everyday sophistication. Featuring a minimalist dial, Japanese quartz movement, and a genuine leather strap.',
    150.00, 'Accessories',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'],
    25, 'active',
    '{"movement": "Japanese Quartz", "casing": "316L Stainless Steel", "strap": "Genuine Leather", "water_resistance": "5 ATM"}'::jsonb
),
(
    'Designer Sunglasses',
    'Make a statement with these bold, retro-inspired sunglasses. Crafted with a premium acetate frame and polarized lenses offering 100% UV protection.',
    120.00, 'Accessories',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'],
    40, 'active',
    '{"frame": "Handcrafted Acetate", "lenses": "Polarized CR-39", "protection": "100% UVA/UVB", "fit": "Medium"}'::jsonb
),
(
    'Classic Denim Jeans',
    'Perfect-fit classic blue denim jeans with a straight-leg cut. Rigid raw denim that softens beautifully with age and wear.',
    89.00, 'Pants',
    'https://images.unsplash.com/photo-1542272617-08f083157f5d?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1542272617-08f083157f5d?auto=format&fit=crop&q=80&w=800'],
    30, 'active',
    '{"material": "100% Organic Cotton Denim", "weight": "13.5 oz", "fit": "Straight Leg", "wash": "Raw Indigo"}'::jsonb
),
(
    'Urban Sneakers',
    'Low-top sneakers constructed from buttery leather and breathable mesh. Features an ergonomic footbed and custom vulcanized rubber sole for lasting support.',
    110.00, 'Footwear',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'],
    18, 'active',
    '{"upper": "Full-grain Calf Leather & Mesh", "lining": "Microfiber", "sole": "Vulcanized Rubber", "cushioning": "OrthoLite Foam"}'::jsonb
),
(
    'Cotton Blend Hoodie',
    'Ultra-soft French terry hoodie. Structured fit, heavyweight cotton blend, and adjustable drawstring hood. Made for layering.',
    65.00, 'Tops',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'],
    50, 'active',
    '{"material": "80% Organic Cotton, 20% Polyester French Terry", "weight": "400 GSM", "fit": "Relaxed", "care": "Machine Wash Cold"}'::jsonb
);

insert into public.store_settings (store_name, support_email, currency)
values ('ASTRA Store', 'support@astra.com', 'USD');

-- =====================================================================
-- PROFILE EXTRA COLUMNS (idempotent — safe to run on an existing database
-- without dropping anything). Adds optional phone/address/city/country/bio.
-- =====================================================================
alter table public.profiles
    add column if not exists phone text,
    add column if not exists address text,
    add column if not exists city text,
    add column if not exists country text,
    add column if not exists bio text;

-- =====================================================================
-- AVATAR STORAGE (for profile picture uploads from the app)
-- Creates a public "avatars" bucket and per-user upload policies.
-- Uploaded files live under <user_id>/<filename> so users can only write
-- to their own folder, while everyone can read (public avatars).
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = true;

drop policy if exists "avatars_public_read" on storage.objects;
create policy "avatars_public_read"
    on storage.objects for select
    using (bucket_id = 'avatars');

drop policy if exists "avatars_owner_insert" on storage.objects;
create policy "avatars_owner_insert"
    on storage.objects for insert
    with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "avatars_owner_update" on storage.objects;
create policy "avatars_owner_update"
    on storage.objects for update
    using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

drop policy if exists "avatars_owner_delete" on storage.objects;
create policy "avatars_owner_delete"
    on storage.objects for delete
    using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- =====================================================================
-- OPTIONAL: promote an existing user to admin (run AFTER they sign up)
--   update public.profiles set role = 'admin' where email = 'you@example.com';
-- The user with email admin@astra.com is promoted automatically on signup.
-- =====================================================================
