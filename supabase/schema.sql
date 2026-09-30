-- Chaarvee English Coach v3
-- Run this entire script in Supabase SQL Editor.
-- Uses Supabase Auth. RLS ensures a signed-in user can only access their own records.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'parent' check (role in ('parent','student')),
  display_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  activity_id text not null,
  mode text not null check (mode in ('reading','writing')),
  level text,
  focus text,
  prompt text not null,
  response text not null,
  is_revision boolean not null default false,
  evaluation jsonb,
  created_at timestamptz not null default now()
);

create index if not exists submissions_user_created_idx on public.submissions(user_id, created_at desc);

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "profiles own" on public.profiles;
create policy "profiles own" on public.profiles
  for all to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "submissions own" on public.submissions;
create policy "submissions own" on public.submissions
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Optional trigger: automatically create a parent profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, role, display_name)
  values (new.id, 'parent', coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email,''),'@',1), 'Parent'))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
