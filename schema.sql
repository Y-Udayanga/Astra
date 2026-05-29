-- =====================================================================
-- Astra E-Commerce Database Schema
-- Target Platform: Supabase (PostgreSQL)
-- =====================================================================
-- INSTRUCTIONS:
-- 1. Go to your Supabase Dashboard: https://supabase.com
-- 2. Select your project ("Astra" or similar).
-- 3. Click on the "SQL Editor" in the left sidebar menu.
-- 4. Click "New Query", paste the entirety of this script, and click "Run".
-- =====================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Clean up existing tables if they exist (cascade ensures dependent triggers/policies are also cleaned)
drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;
drop table if exists public.products cascade;
drop table if exists public.profiles cascade;
drop table if exists public.store_settings cascade;

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
-- Extends Supabase's auth.users table for application-specific metadata.
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text,
    email text,
    role text default 'user' check (role in ('user', 'admin')),
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.profiles is 'Stores user profile metadata and security roles linked to Supabase Auth.';

-- ==========================================
-- 2. PRODUCTS TABLE
-- ==========================================
-- Stores products listed on the platform.
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
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.products is 'Stores product items, their specifications, inventory, and seller references.';

-- ==========================================
-- 3. ORDERS TABLE
-- ==========================================
-- Tracks customer purchases.
create table public.orders (
    id text primary key, -- Format: ORD-xxxxxxxxxxxxx (matches the frontend custom order generator)
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
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.orders is 'Tracks client transactions, payment details, and shipping address.';

-- ==========================================
-- 4. ORDER ITEMS TABLE
-- ==========================================
-- Detailed line items associated with each order.
create table public.order_items (
    id bigint generated always as identity primary key,
    order_id text references public.orders(id) on delete cascade not null,
    product_id bigint references public.products(id) on delete set null,
    quantity integer not null check (quantity > 0),
    price numeric(10, 2) not null check (price >= 0),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.order_items is 'Maps purchased products and purchase-time pricing to specific orders.';

-- ==========================================
-- 5. STORE SETTINGS TABLE
-- ==========================================
-- Stores global store settings managed by admins.
create table public.store_settings (
    id bigint generated always as identity primary key,
    store_name text not null default 'ASTRA Store',
    support_email text not null default 'support@astra.com',
    currency text not null default 'USD',
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table public.store_settings is 'Stores global settings for the application.';


-- ==========================================
-- AUTOMATION: TRIGGERS & FUNCTIONS
-- ==========================================

-- Function to auto-update the "updated_at" column on row changes
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Apply updated_at triggers
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute function public.update_updated_at_column();

create trigger update_products_updated_at
    before update on public.products
    for each row execute function public.update_updated_at_column();

create trigger update_orders_updated_at
    before update on public.orders
    for each row execute function public.update_updated_at_column();

create trigger update_store_settings_updated_at
    before update on public.store_settings
    for each row execute function public.update_updated_at_column();


-- Function & Trigger to automatically copy newly registered users from auth.users to public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
declare
    user_role text := 'user';
begin
    -- Assign admin role if the user email matches the system admin email (admin@astra.com)
    if new.email = 'admin@astra.com' then
        user_role := 'admin';
    end if;

    insert into public.profiles (id, name, email, role, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'name', 'User'),
        new.email,
        user_role,
        'https://ui-avatars.com/api/?name=' || replace(coalesce(new.raw_user_meta_data->>'name', 'User'), ' ', '+') || '&background=random'
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger to activate the profile creator function on auth sign-ups
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();


-- ==========================================
-- SECURITY: ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.store_settings enable row level security;

-- --- PROFILES RLS POLICIES ---

-- Allow users to read any profile (so they can see seller details)
create policy "Allow public read access to profiles" 
    on public.profiles for select 
    using (true);

-- Allow users to update their own profile only
create policy "Allow individual profile owners to update their profile" 
    on public.profiles for update 
    using (auth.uid() = id);

-- Allow admins full control over profiles
create policy "Allow admins full control of profiles" 
    on public.profiles for all 
    using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'admin'
        )
    );

-- --- PRODUCTS RLS POLICIES ---

-- Allow public read access to all active products
create policy "Allow public read access to active products" 
    on public.products for select 
    using (status = 'active');

-- Allow authenticated users to insert a new product
create policy "Allow authenticated users to create products" 
    on public.products for insert 
    with check (auth.uid() = seller_id);

-- Allow product sellers to update their own products
create policy "Allow sellers to update their own products" 
    on public.products for update 
    using (auth.uid() = seller_id);

-- Allow product sellers to delete their own products
create policy "Allow sellers to delete their own products" 
    on public.products for delete 
    using (auth.uid() = seller_id);

-- Allow admins full control over all products
create policy "Allow admins full control of products" 
    on public.products for all 
    using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'admin'
        )
    );

-- --- ORDERS RLS POLICIES ---

-- Allow users to read their own orders
create policy "Allow users to read their own orders" 
    on public.orders for select 
    using (auth.uid() = user_id);

-- Allow anyone (including guest users) to insert/place orders
create policy "Allow anyone to place orders" 
    on public.orders for insert 
    with check (true);

-- Allow admins to read/write all orders
create policy "Allow admins full control of orders" 
    on public.orders for all 
    using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'admin'
        )
    );

-- --- ORDER ITEMS RLS POLICIES ---

-- Allow users to read order items belonging to their own orders
create policy "Allow users to read their own order items" 
    on public.order_items for select 
    using (
        exists (
            select 1 from public.orders 
            where orders.id = order_items.order_id and orders.user_id = auth.uid()
        )
    );

-- Allow anyone to insert order items (part of checkout)
create policy "Allow anyone to insert order items" 
    on public.order_items for insert 
    with check (true);

-- Allow admins full control of order items
create policy "Allow admins full control of order items" 
    on public.order_items for all 
    using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'admin'
        )
    );

-- --- STORE SETTINGS RLS POLICIES ---

-- Allow public read access to store settings
create policy "Allow public read access to store settings" 
    on public.store_settings for select 
    using (true);

-- Allow admins full control of store settings
create policy "Allow admins full control of store settings" 
    on public.store_settings for all 
    using (
        exists (
            select 1 from public.profiles 
            where profiles.id = auth.uid() and profiles.role = 'admin'
        )
    );


-- ==========================================
-- SEED DATA (INITIAL PRODUCTS)
-- ==========================================

insert into public.products (name, description, price, category, image_url, images, stock, status, specs)
values 
(
    'Premium Leather Jacket',
    'Experience ultimate luxury with our premium leather jacket. Handcrafted from Italian leather, it features a modern slim fit and durable hardware. Perfect for any occasion.',
    299.00,
    'Outerwear',
    'https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1551028919-6a014909a909?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&q=80&w=800', 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?auto=format&fit=crop&q=80&w=800'],
    15,
    'active',
    '{"material": "100% Full-grain Italian Leather", "lining": "Viscose Rayon", "fit": "Slim Fit", "care": "Professional Leather Clean Only"}'::jsonb
),
(
    'Minimalist Watch',
    'A clean, timeless timepiece designed for everyday sophistication. Featuring a minimalist dial, Japanese quartz movement, and a genuine leather strap.',
    150.00,
    'Accessories',
    'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=800'],
    25,
    'active',
    '{"movement": "Japanese Quartz", "casing": "316L Stainless Steel", "strap": "Genuine Leather", "water_resistance": "5 ATM"}'::jsonb
),
(
    'Designer Sunglasses',
    'Make a statement with these bold, retro-inspired sunglasses. Crafted with a premium acetate frame and polarized lenses offering 100% UV protection.',
    120.00,
    'Accessories',
    'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800'],
    40,
    'active',
    '{"frame": "Handcrafted Acetate", "lenses": "Polarized CR-39", "protection": "100% UVA/UVB", "fit": "Medium"}'::jsonb
),
(
    'Classic Denim Jeans',
    'Perfect-fit classic blue denim jeans with a straight-leg cut. Rigid raw denim that softens beautifully with age and wear.',
    89.00,
    'Pants',
    'https://images.unsplash.com/photo-1542272617-08f083157f5d?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1542272617-08f083157f5d?auto=format&fit=crop&q=80&w=800'],
    30,
    'active',
    '{"material": "100% Organic Cotton Denim", "weight": "13.5 oz", "fit": "Straight Leg", "wash": "Raw Indigo"}'::jsonb
),
(
    'Urban Sneakers',
    'Low-top sneakers constructed from buttery leather and breathable mesh. Features an ergonomic footbed and custom vulcanized rubber sole for lasting support.',
    110.00,
    'Footwear',
    'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800'],
    18,
    'active',
    '{"upper": "Full-grain Calf Leather & Mesh", "lining": "Microfiber", "sole": "Vulcanized Rubber", "cushioning": "OrthoLite Foam"}'::jsonb
),
(
    'Cotton Blend Hoodie',
    'Ultra-soft French terry hoodie. Structured fit, heavyweight cotton blend, and adjustable drawstring hood. Made for layering.',
    65.00,
    'Tops',
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800',
    array['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'],
    50,
    'active',
    '{"material": "80% Organic Cotton, 20% Polyester French Terry", "weight": "400 GSM", "fit": "Relaxed", "care": "Machine Wash Cold"}'::jsonb
);

-- Insert initial store settings
insert into public.store_settings (store_name, support_email, currency)
values ('ASTRA Store', 'support@astra.com', 'USD');
