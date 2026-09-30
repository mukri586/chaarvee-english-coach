create table if not exists profiles (id uuid primary key references auth.users(id) on delete cascade, role text not null check(role in ('parent','student')), display_name text not null, created_at timestamptz default now());
create table if not exists submissions (id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete cascade, activity_id text not null, mode text not null, prompt text not null, response text not null, is_revision boolean default false, evaluation jsonb, created_at timestamptz default now());
alter table profiles enable row level security; alter table submissions enable row level security;
create policy "profiles own" on profiles for all using(auth.uid()=id) with check(auth.uid()=id);
create policy "submissions own" on submissions for all using(auth.uid()=user_id) with check(auth.uid()=user_id);
