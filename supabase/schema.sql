-- BO2 Camo Tracker — schéma Supabase
-- À exécuter dans Supabase Dashboard > SQL Editor > New query

create table if not exists public.progression (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  arme text not null,
  camouflage text not null,
  defi text not null,
  valeur_actuelle integer not null default 0,
  valeur_cible integer not null,
  mis_a_jour_le timestamptz not null default now(),
  unique (user_id, defi)
);

create index if not exists progression_user_id_idx on public.progression (user_id);

-- Row Level Security : chaque utilisateur ne voit / modifie que ses propres lignes.
alter table public.progression enable row level security;

drop policy if exists "progression_select_own" on public.progression;
create policy "progression_select_own"
  on public.progression for select
  using (auth.uid() = user_id);

drop policy if exists "progression_insert_own" on public.progression;
create policy "progression_insert_own"
  on public.progression for insert
  with check (auth.uid() = user_id);

drop policy if exists "progression_update_own" on public.progression;
create policy "progression_update_own"
  on public.progression for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "progression_delete_own" on public.progression;
create policy "progression_delete_own"
  on public.progression for delete
  using (auth.uid() = user_id);

-- Realtime : permet à l'app de recevoir les changements en direct sur les autres appareils.
alter publication supabase_realtime add table public.progression;

-- Corrections personnelles des défis (description / valeur cible), appliquées par-dessus les
-- valeurs par défaut du fichier weapons.json. Permet d'éditer les défis directement dans l'app.
create table if not exists public.defi_overrides (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  defi_id text not null,
  description text,
  valeur_cible integer,
  mis_a_jour_le timestamptz not null default now(),
  unique (user_id, defi_id)
);

create index if not exists defi_overrides_user_id_idx on public.defi_overrides (user_id);

alter table public.defi_overrides enable row level security;

drop policy if exists "defi_overrides_select_own" on public.defi_overrides;
create policy "defi_overrides_select_own"
  on public.defi_overrides for select
  using (auth.uid() = user_id);

drop policy if exists "defi_overrides_insert_own" on public.defi_overrides;
create policy "defi_overrides_insert_own"
  on public.defi_overrides for insert
  with check (auth.uid() = user_id);

drop policy if exists "defi_overrides_update_own" on public.defi_overrides;
create policy "defi_overrides_update_own"
  on public.defi_overrides for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "defi_overrides_delete_own" on public.defi_overrides;
create policy "defi_overrides_delete_own"
  on public.defi_overrides for delete
  using (auth.uid() = user_id);

alter publication supabase_realtime add table public.defi_overrides;
