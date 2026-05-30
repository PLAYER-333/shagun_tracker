-- ================================================
-- Shagun App — Supabase / Postgres Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ================================================

-- Users profile (extends Supabase Auth)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  family_name text,
  plan text default 'free',        -- 'free' | 'pro' | 'lifetime'
  plan_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Events (wedding, mundan, griha pravesh, etc.)
create table events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  event_type text,                 -- 'wedding' | 'mundan' | 'griha_pravesh' | 'funeral' | 'other'
  event_date date,
  notes text,
  created_at timestamptz default now()
);

-- People (contacts — relatives, neighbours, friends)
create table people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  relationship text,               -- 'mama', 'chacha', 'neighbour', etc.
  phone text,
  created_at timestamptz default now()
);

-- Gifts (core table)
create table gifts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  person_id uuid references people(id) on delete cascade,
  amount numeric not null,
  direction text not null,         -- 'received' (they gave us) | 'given' (we gave them)
  gift_type text default 'cash',   -- 'cash' | 'upi' | 'gift_item'
  notes text,
  gift_date date,
  created_at timestamptz default now()
);

-- ================================================
-- Row Level Security — users only see their own rows
-- ================================================
alter table profiles enable row level security;
alter table events enable row level security;
alter table people enable row level security;
alter table gifts enable row level security;

create policy "own rows only" on profiles for all using (auth.uid() = id);
create policy "own rows only" on events for all using (auth.uid() = user_id);
create policy "own rows only" on people for all using (auth.uid() = user_id);
create policy "own rows only" on gifts for all using (auth.uid() = user_id);

-- ================================================
-- Auto-create profile on signup trigger
-- ================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
