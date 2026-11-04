-- Seleste initial schema: profiles, orders, order events, contact messages,
-- model file storage, and row-level security.

create type public.order_status as enum (
  'pending_review', 'in_production', 'quality_check', 'shipped', 'delivered', 'cancelled'
);

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  company text not null default '',
  plan text not null default 'starter' check (plan in ('starter', 'pro', 'business')),
  role text not null default 'customer' check (role in ('customer', 'admin')),
  address jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

-- Create a profile row for every new auth user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Customers may edit their own profile, but never their role or plan
-- (plan changes go through change_plan / a billing webhook).
create or replace function public.protect_profile_columns()
returns trigger
language plpgsql
as $$
begin
  if (new.role is distinct from old.role or new.plan is distinct from old.plan or new.email is distinct from old.email)
     and auth.uid() is not null -- server-side contexts (SQL editor, service role) may change these
     and current_setting('seleste.allow_privileged', true) is distinct from 'on' then
    raise exception 'role, plan and email cannot be changed directly';
  end if;
  return new;
end;
$$;

create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

alter table public.profiles enable row level security;

create policy "Profiles are readable by their owner and admins"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "Users update their own profile"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---------------------------------------------------------------------------
-- Orders
-- ---------------------------------------------------------------------------
create sequence public.order_number_seq start 10001;

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  number text not null unique default ('SL-' || nextval('public.order_number_seq')),
  user_id uuid not null references public.profiles (id) on delete cascade,
  customer_name text not null default '',
  customer_email text not null default '',
  status public.order_status not null default 'pending_review',
  file_name text not null,
  file_size integer not null check (file_size > 0 and file_size <= 52428800),
  file_path text,
  metrics jsonb not null,
  config jsonb not null,
  pricing jsonb not null,
  shipping_method text not null check (shipping_method in ('standard', 'express')),
  address jsonb not null,
  notes text not null default '' check (char_length(notes) <= 2000),
  tracking_number text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index orders_status_idx on public.orders (status);

create table public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  status public.order_status not null,
  note text not null default '',
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index order_events_order_id_idx on public.order_events (order_id, created_at);

-- Force safe defaults on insert, whatever the client sent.
create or replace function public.prepare_new_order()
returns trigger
language plpgsql
as $$
begin
  new.status := 'pending_review';
  new.customer_email := (select email from public.profiles where id = new.user_id);
  new.tracking_number := null;
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

create trigger prepare_new_order
  before insert on public.orders
  for each row execute function public.prepare_new_order();

create or replace function public.log_order_created()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.order_events (order_id, status, note, created_by)
  values (new.id, new.status, 'Order placed.', auth.uid());
  return new;
end;
$$;

create trigger log_order_created
  after insert on public.orders
  for each row execute function public.log_order_created();

alter table public.orders enable row level security;
alter table public.order_events enable row level security;

create policy "Customers read their orders, admins read all"
  on public.orders for select
  using (user_id = auth.uid() or public.is_admin());

create policy "Customers create their own orders"
  on public.orders for insert
  with check (user_id = auth.uid());

-- No update/delete policies: status changes go through the functions below.

create policy "Events follow order visibility"
  on public.order_events for select
  using (exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
  ));

create or replace function public.cancel_order(order_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status public.order_status;
begin
  select status into current_status from public.orders
  where id = order_id and user_id = auth.uid()
  for update;

  if not found then
    raise exception 'Order not found';
  end if;
  if current_status <> 'pending_review' then
    raise exception 'Only orders still in review can be cancelled';
  end if;

  update public.orders set status = 'cancelled', updated_at = now() where id = order_id;
  insert into public.order_events (order_id, status, note, created_by)
  values (order_id, 'cancelled', 'Cancelled by customer.', auth.uid());
end;
$$;

create or replace function public.admin_update_order(
  order_id uuid,
  new_status public.order_status,
  note text default '',
  tracking text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_status public.order_status;
  allowed public.order_status[];
begin
  if not public.is_admin() then
    raise exception 'Admins only';
  end if;

  select status into current_status from public.orders where id = order_id for update;
  if not found then
    raise exception 'Order not found';
  end if;

  allowed := case current_status
    when 'pending_review' then array['in_production', 'cancelled']::public.order_status[]
    when 'in_production' then array['quality_check']::public.order_status[]
    when 'quality_check' then array['shipped']::public.order_status[]
    when 'shipped' then array['delivered']::public.order_status[]
    else array[]::public.order_status[]
  end;

  if not (new_status = any (allowed)) then
    raise exception 'Cannot move an order from % to %', current_status, new_status;
  end if;
  if new_status = 'shipped' and coalesce(btrim(tracking), '') = '' then
    raise exception 'A tracking number is required to ship';
  end if;

  update public.orders
  set status = new_status,
      tracking_number = case when new_status = 'shipped' then btrim(tracking) else tracking_number end,
      updated_at = now()
  where id = order_id;

  insert into public.order_events (order_id, status, note, created_by)
  values (order_id, new_status, coalesce(note, ''), auth.uid());
end;
$$;

-- Stand-in for a billing provider webhook. Replace with a Stripe webhook
-- handler (Edge Function using the service role) before charging money.
create or replace function public.change_plan(new_plan text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new_plan not in ('starter', 'pro', 'business') then
    raise exception 'Unknown plan';
  end if;
  perform set_config('seleste.allow_privileged', 'on', true);
  update public.profiles set plan = new_plan where id = auth.uid();
end;
$$;

revoke execute on function public.cancel_order(uuid) from anon;
revoke execute on function public.admin_update_order(uuid, public.order_status, text, text) from anon;
revoke execute on function public.change_plan(text) from anon;

-- ---------------------------------------------------------------------------
-- Contact form
-- ---------------------------------------------------------------------------
create table public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  company text not null default '',
  message text not null check (char_length(message) between 1 and 5000),
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);

create policy "Admins read contact messages"
  on public.contact_messages for select
  using (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage: private bucket, one folder per user.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('models', 'models', false, 52428800)
on conflict (id) do nothing;

create policy "Users upload models to their folder"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'models' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users read their models, admins read all"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'models' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

create policy "Users delete their own models"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'models' and (storage.foldername(name))[1] = auth.uid()::text);
