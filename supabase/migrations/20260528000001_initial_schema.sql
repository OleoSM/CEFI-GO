-- =====================================================================
-- CEFIGO - Migracion inicial
-- Fecha: 2026-05-28
-- Tablas: profiles, subscriptions
-- =====================================================================

-- -----------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------

create type public.exam_type as enum (
  'ECOEMS',
  'UNAM_Examen',
  'IPN',
  'UAM'
);

create type public.subscription_status as enum (
  'active',
  'canceled',
  'past_due',
  'expired'
);

-- -----------------------------------------------------------------------
-- 2. TABLA: profiles
-- Extiende auth.users con datos del alumno.
-- Se crea automaticamente al registrarse (ver trigger al final).
-- -----------------------------------------------------------------------

create table public.profiles (
  id               uuid        primary key references auth.users(id) on delete cascade,

  -- Datos personales
  full_name        text        not null,
  phone            text,

  -- Examen objetivo
  target_exam      public.exam_type,
  target_major     text,
  exam_date        date,

  -- Acceso
  role             text        not null default 'student'
                               check (role in ('student', 'admin')),
  is_pro           boolean     not null default false,

  -- Progreso (cache - se actualiza tras cada simulacro)
  current_score    integer     default 0 check (current_score between 0 and 100),
  weekly_goal      integer     default 70 check (weekly_goal between 0 and 100),

  -- Gamificacion
  streak_days      integer     not null default 0,
  last_active      date,

  -- Timestamps
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- 3. TABLA: subscriptions
-- Historial completo de pagos con Stripe.
-- El webhook de Stripe escribe aqui y actualiza profiles.is_pro.
-- -----------------------------------------------------------------------

create table public.subscriptions (
  id                      uuid        primary key default gen_random_uuid(),
  user_id                 uuid        not null references public.profiles(id) on delete cascade,

  -- IDs de Stripe
  stripe_customer_id      text        not null,
  stripe_subscription_id  text        unique,
  stripe_price_id         text        not null,

  -- Estado
  status                  public.subscription_status not null default 'active',

  -- Periodo
  current_period_start    timestamptz,
  current_period_end      timestamptz,
  canceled_at             timestamptz,

  -- Timestamps
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- -----------------------------------------------------------------------
-- 4. INDICES
-- -----------------------------------------------------------------------

-- Buscar suscripciones por usuario (dashboard, admin)
create index idx_subscriptions_user_id
  on public.subscriptions(user_id);

-- Buscar por stripe_customer_id (webhook de Stripe)
create index idx_subscriptions_stripe_customer
  on public.subscriptions(stripe_customer_id);

-- Buscar perfiles por examen (analytics, admin)
create index idx_profiles_target_exam
  on public.profiles(target_exam);

-- Buscar perfiles por rol (admin panel)
create index idx_profiles_role
  on public.profiles(role);

-- -----------------------------------------------------------------------
-- 5. FUNCION: updated_at automatico
-- -----------------------------------------------------------------------

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger set_subscriptions_updated_at
  before update on public.subscriptions
  for each row execute procedure public.handle_updated_at();

-- -----------------------------------------------------------------------
-- 6. FUNCION + TRIGGER: crear perfil automaticamente al registrarse
-- Funciona con email/password y con Google OAuth
-- -----------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'Usuario'),
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- -----------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------

alter table public.profiles      enable row level security;
alter table public.subscriptions enable row level security;

-- profiles: usuario lee su propio perfil
create policy "perfil: usuario lee el suyo"
  on public.profiles for select
  using (auth.uid() = id);

-- profiles: usuario edita su perfil (NO puede cambiar role ni is_pro)
create policy "perfil: usuario edita el suyo"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select role from public.profiles where id = auth.uid())
    and is_pro = (select is_pro from public.profiles where id = auth.uid())
  );

-- profiles: admin lee todos los perfiles
create policy "perfil: admin lee todos"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- profiles: admin edita todos los perfiles
create policy "perfil: admin edita todos"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- profiles: el trigger de auth puede insertar
create policy "perfil: insertar via trigger"
  on public.profiles for insert
  with check (true);

-- subscriptions: usuario lee las suyas
create policy "sub: usuario lee las suyas"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- subscriptions: solo el servidor inserta (webhook Stripe con service_role)
create policy "sub: solo servidor inserta"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

-- subscriptions: solo el servidor actualiza
create policy "sub: solo servidor actualiza"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- subscriptions: admin lee todas
create policy "sub: admin lee todas"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'admin'
    )
  );

-- -----------------------------------------------------------------------
-- 8. SEED: 4 admins iniciales
-- Paso 1: Crear los 4 usuarios en Supabase Dashboard
--         Authentication -> Users -> Add user
-- Paso 2: Copiar sus UUIDs y descomentar lo siguiente:
-- -----------------------------------------------------------------------

-- update public.profiles
-- set role = 'admin'
-- where id in (
--   '<uuid-admin-1>',
--   '<uuid-admin-2>',
--   '<uuid-admin-3>',
--   '<uuid-admin-4>'
-- );

-- =====================================================================
-- FIN DE LA MIGRACION
-- =====================================================================
