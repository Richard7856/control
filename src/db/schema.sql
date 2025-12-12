-- Enable UUID extension
create extension if not exists "pgcrypto";

-- User Settings (Optional, for profile data if needed later)
-- create table public.profiles ...

-- Accounts
create table public.accounts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  currency text not null default 'MXN',
  balance numeric default 0,
  type text check (type in ('cash', 'debit', 'credit', 'investment', 'other')) default 'debit',
  is_active boolean default true,
  created_at timestamptz default now()
);

alter table public.accounts enable row level security;

create policy "Users can view their own accounts"
on public.accounts for select
using (auth.uid() = user_id);

create policy "Users can insert their own accounts"
on public.accounts for insert
with check (auth.uid() = user_id);

create policy "Users can update their own accounts"
on public.accounts for update
using (auth.uid() = user_id);

create policy "Users can delete their own accounts"
on public.accounts for delete
using (auth.uid() = user_id);

-- Categories
create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users, -- null means system default
  name text not null,
  type text check (type in ('income', 'expense', 'transfer')) not null,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;

create policy "Users can view their own categories and system categories"
on public.categories for select
using (auth.uid() = user_id or user_id is null);

create policy "Users can insert their own categories"
on public.categories for insert
with check (auth.uid() = user_id);

create policy "Users can update their own categories"
on public.categories for update
using (auth.uid() = user_id);

create policy "Users can delete their own categories"
on public.categories for delete
using (auth.uid() = user_id);

-- Transactions
create table public.transactions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  account_id uuid references public.accounts not null,
  category_id uuid references public.categories,
  type text check (type in ('income', 'expense', 'transfer')) not null,
  amount numeric not null,
  currency text default 'MXN',
  date date default current_date,
  note text,
  created_at timestamptz default now()
);

alter table public.transactions enable row level security;

create policy "Users can view their own transactions"
on public.transactions for select
using (auth.uid() = user_id);

create policy "Users can insert their own transactions"
on public.transactions for insert
with check (auth.uid() = user_id);

create policy "Users can update their own transactions"
on public.transactions for update
using (auth.uid() = user_id);

create policy "Users can delete their own transactions"
on public.transactions for delete
using (auth.uid() = user_id);

-- Fixed Expenses
create table public.fixed_expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  account_id uuid references public.accounts,
  category_id uuid references public.categories,
  amount numeric not null,
  currency text default 'MXN',
  period text check (period in ('weekly', 'biweekly', 'monthly', 'yearly')),
  next_charge_date date,
  created_at timestamptz default now()
);

alter table public.fixed_expenses enable row level security;

create policy "Users can view their own fixed expenses"
on public.fixed_expenses for select
using (auth.uid() = user_id);

create policy "Users can insert their own fixed expenses"
on public.fixed_expenses for insert
with check (auth.uid() = user_id);

create policy "Users can update their own fixed expenses"
on public.fixed_expenses for update
using (auth.uid() = user_id);

create policy "Users can delete their own fixed expenses"
on public.fixed_expenses for delete
using (auth.uid() = user_id);
