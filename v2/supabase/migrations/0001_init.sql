-- =============================================================================
-- panamarealestateguide.com v2 — initial schema
-- =============================================================================
-- Replaces data/airtable.json. The templates read lib/content.ts, which reads
-- that artifact, so migrating means rewriting the loader and the sync — not the
-- templates.
--
-- The organising principle is the one the design is built on: a fact is either
-- SUPPLIED (it came from a developer or broker and nobody checked it) or
-- VERIFIED (a named person checked it against a primary source on a date).
-- The UI shows those differently, so the database has to be able to tell them
-- apart. Where a claim carries real risk — title status above all — a CHECK
-- constraint makes it impossible to assert without a source and a date.
--
-- Fields Airtable never had, added here because they were blocking real work:
--   · developers / brokers  — listing attribution on project pages
--   · delivery_on           — "Q3 2027" timing
--   · lat / lng             — the map pane on /projects
--   · title_status + source — the site's central claim
-- =============================================================================

create extension if not exists "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────────────────────

create type project_status as enum (
  'preselling',
  'under_construction',
  'delivered'
);

-- 'unknown' is the default everywhere and is not a failure state — it is the
-- honest answer until someone does the research.
create type title_status as enum ('titled', 'rop', 'mixed', 'unknown');

create type publish_status as enum ('draft', 'published', 'archived');

-- How a given row's figures got here. Drives whether the UI shows the gold
-- verification stamp or a plain "developer listing" note.
create type provenance as enum (
  'developer_listed',
  'broker_listed',
  'staff_verified'
);

-- ── Shared trigger ───────────────────────────────────────────────────────────

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── People who write and review ──────────────────────────────────────────────

create table authors (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  title         text,
  bio           text,
  avatar_url    text,
  -- E-E-A-T. is_reviewer means this person is qualified to sign off legal
  -- content; credential is what makes that claim checkable by a reader.
  is_reviewer   boolean not null default false,
  credential    text,
  licence_no    text,
  linkedin_url  text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  constraint reviewer_needs_credential
    check (not is_reviewer or credential is not null)
);

-- ── Geography ────────────────────────────────────────────────────────────────

create table areas (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  region        text not null,

  -- Editorial. Null until authored; the UI hides null rather than showing
  -- filler, so an unwritten area still renders honestly.
  positioning   text,
  blurb         text,
  elevation_m   integer,
  climate       text,

  -- The central claim of the site. Never inferred from general knowledge.
  title_status        title_status not null default 'unknown',
  title_note          text,
  title_source_url    text,
  title_verified_on   date,
  title_verified_by   uuid references authors(id) on delete set null,

  lat           numeric(9,6),
  lng           numeric(9,6),

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- You may not assert a title status without saying who checked it, when,
  -- and against what. This is the honesty rule made structural: the only way
  -- to skip the evidence is to leave the answer as 'unknown'.
  constraint title_claim_requires_evidence check (
    title_status = 'unknown'
    or (title_source_url is not null
        and title_verified_on is not null
        and title_verified_by is not null)
  )
);

create index areas_region_idx on areas (region);

-- ── Who builds and who sells ─────────────────────────────────────────────────

create table developers (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  website_url   text,
  founded_year  integer,
  -- Track record is the thing a buyer most wants and least often gets.
  projects_delivered integer,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table brokers (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  firm          text,
  licence_no    text,
  phone         text,
  whatsapp      text,
  email         text,
  photo_url     text,
  -- Every lead currently routes to one broker; this flag is how we pick, and
  -- it leaves room for per-area routing later without a schema change.
  is_default    boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- At most one default broker. Partial unique index on the flag itself: every
-- row in the filtered set has is_default = true, so a second one collides.
create unique index brokers_single_default_idx
  on brokers (is_default) where is_default;

-- ── Projects ─────────────────────────────────────────────────────────────────

create table projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  area_id       uuid not null references areas(id) on delete restrict,
  developer_id  uuid references developers(id) on delete set null,
  broker_id     uuid references brokers(id) on delete set null,

  status              project_status,
  published           boolean not null default false,

  price_from_usd      integer,
  price_to_usd        integer,
  delivery_on         date,          -- render as quarter; store as a real date
  delivery_estimated  boolean not null default true,

  -- Written by us. The Airtable descriptions are v1 SEO spam and must not be
  -- carried over — hence the deliberate absence of a "description_imported"
  -- column to hide them in.
  summary       text,
  body          text,

  amenities     text[] not null default '{}',
  website_url   text,

  lat           numeric(9,6),
  lng           numeric(9,6),

  -- Per-project title status, independent of the area's. A titled area can
  -- still contain a project on unresolved land.
  title_status        title_status not null default 'unknown',
  title_note          text,
  title_source_url    text,
  title_verified_on   date,
  title_verified_by   uuid references authors(id) on delete set null,

  source        provenance not null default 'developer_listed',
  source_synced_on date,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint price_range_sane
    check (price_to_usd is null or price_from_usd is null
           or price_to_usd >= price_from_usd),

  constraint title_claim_requires_evidence check (
    title_status = 'unknown'
    or (title_source_url is not null
        and title_verified_on is not null
        and title_verified_by is not null)
  )
);

create index projects_area_idx      on projects (area_id);
create index projects_published_idx on projects (published) where published;
create index projects_price_idx     on projects (price_from_usd);

-- ── Unit models ──────────────────────────────────────────────────────────────
-- 115 rows today. This table is the site's most defensible content: no
-- competitor publishes a per-unit price and size breakdown.

create table unit_models (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  name          text,
  beds          smallint,
  baths         numeric(3,1),      -- 2.5 baths is a real thing
  size_m2       numeric(8,2),
  price_from_usd integer,
  features      text,
  position      smallint not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index unit_models_project_idx on unit_models (project_id, position);

-- ── Photos ───────────────────────────────────────────────────────────────────
-- Files live in object storage (Supabase Storage or R2), never in git — v1
-- carries 91MB of binaries in its history.

create table project_photos (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id) on delete cascade,
  storage_path  text not null,
  -- Required in practice: an alt that describes the actual photograph is the
  -- difference between accessible and decorative.
  alt           text,
  width         integer,
  height        integer,
  position      smallint not null default 0,
  created_at    timestamptz not null default now()
);

create index project_photos_project_idx on project_photos (project_id, position);

create table area_photos (
  id            uuid primary key default gen_random_uuid(),
  area_id       uuid not null references areas(id) on delete cascade,
  storage_path  text not null,
  alt           text,
  position      smallint not null default 0,
  created_at    timestamptz not null default now()
);

-- ── Editorial ────────────────────────────────────────────────────────────────

create table categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  name          text not null,
  blurb         text,
  position      smallint not null default 0,
  -- Hub-page FAQ. LeyConsulta ships no FAQPage schema; this is where we beat
  -- them on hub pages.
  faqs          jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table articles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null,
  category_id   uuid not null references categories(id) on delete restrict,
  title         text not null,
  dek           text,
  body          text,
  status        publish_status not null default 'draft',

  author_id     uuid references authors(id) on delete set null,
  reviewer_id   uuid references authors(id) on delete set null,
  reviewed_on   date,

  -- Optional topical link so a guide can strengthen an area hub.
  area_id       uuid references areas(id) on delete set null,

  read_minutes  smallint,
  faqs          jsonb not null default '[]'::jsonb,
  sources       jsonb not null default '[]'::jsonb,   -- [{label, url}]

  og_image_path text,      -- per-article; v1 shared ONE across all 84
  published_at  timestamptz,
  updated_on    date,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- URLs are /{category}/{slug}, so slugs need only be unique within a category.
  constraint articles_slug_unique_per_category unique (category_id, slug),

  -- A reviewer badge without a review date is a badge that means nothing.
  constraint review_needs_date
    check (reviewer_id is null or reviewed_on is not null)
);

create index articles_status_idx on articles (status) where status = 'published';
create index articles_area_idx   on articles (area_id);

-- ── Verified figures ─────────────────────────────────────────────────────────
-- The homepage strip of invented numbers was deleted rather than shipped. If
-- figures like transfer tax return, they come from here, where a source and a
-- date are not optional.

create table figures (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  label         text not null,
  value         text not null,
  note          text,
  source_name   text not null,
  source_url    text not null,
  verified_on   date not null,
  verified_by   uuid not null references authors(id) on delete restrict,
  explained_by  uuid references articles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ── Leads ────────────────────────────────────────────────────────────────────
-- The commercial point of the site. Qualifiers are what make a lead worth a
-- broker's call; attribution is what makes Meta CAPI and Google Ads able to
-- close the loop.

create table leads (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null,     -- PRG-2026-XXXXXX, shown to the user

  full_name     text not null,
  email         text,
  phone         text,
  country       text,

  budget_band   text,
  timeline      text,
  financing     text,
  residency_interest text,
  notes         text,

  -- What they were looking at when they asked.
  project_id    uuid references projects(id) on delete set null,
  area_id       uuid references areas(id) on delete set null,
  page_path     text,

  -- Attribution. Without gclid/fbclid the ad platforms cannot attribute a
  -- conversion, and you never learn which guides actually produce buyers.
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_content   text,
  utm_term      text,
  gclid         text,
  fbclid        text,
  referrer      text,

  consented_at  timestamptz not null,
  assigned_broker_id uuid references brokers(id) on delete set null,
  crm_synced_at timestamptz,
  crm_error     text,

  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  constraint lead_needs_a_contact_method
    check (email is not null or phone is not null)
);

create index leads_created_idx  on leads (created_at desc);
create index leads_project_idx  on leads (project_id);
create index leads_unsynced_idx on leads (created_at) where crm_synced_at is null;

create table subscribers (
  id            uuid primary key default gen_random_uuid(),
  email         text unique not null,
  consented_at  timestamptz not null,
  unsubscribed_at timestamptz,
  created_at    timestamptz not null default now()
);

-- ── updated_at triggers ──────────────────────────────────────────────────────

do $$
declare t text;
begin
  foreach t in array array[
    'authors','areas','developers','brokers','projects','unit_models',
    'categories','articles','figures','leads'
  ]
  loop
    execute format(
      'create trigger %I_set_updated_at before update on %I
         for each row execute function set_updated_at()', t, t);
  end loop;
end $$;

-- ── Row level security ───────────────────────────────────────────────────────
-- Public reads published content only. Leads are never publicly readable —
-- v1 exposed a lead listing behind nothing but a query-string token.

alter table areas          enable row level security;
alter table projects       enable row level security;
alter table unit_models    enable row level security;
alter table project_photos enable row level security;
alter table area_photos    enable row level security;
alter table developers     enable row level security;
alter table brokers        enable row level security;
alter table authors        enable row level security;
alter table categories     enable row level security;
alter table articles       enable row level security;
alter table figures        enable row level security;
alter table leads          enable row level security;
alter table subscribers    enable row level security;

create policy public_read_areas       on areas          for select using (true);
create policy public_read_categories  on categories     for select using (true);
create policy public_read_authors     on authors        for select using (true);
create policy public_read_developers  on developers     for select using (true);
create policy public_read_figures     on figures        for select using (true);

create policy public_read_projects on projects
  for select using (published);

create policy public_read_unit_models on unit_models
  for select using (exists (
    select 1 from projects p where p.id = project_id and p.published));

create policy public_read_project_photos on project_photos
  for select using (exists (
    select 1 from projects p where p.id = project_id and p.published));

create policy public_read_area_photos on area_photos
  for select using (true);

create policy public_read_articles on articles
  for select using (status = 'published');

-- brokers, leads, subscribers: RLS is enabled with NO policy, which denies by
-- default. Brokers carry personal contact details, so a project page should
-- read them through a view exposing only name/firm/photo. Lead writes go
-- through a service-role endpoint; lead reads through the admin surface only.
-- v1 exposed a lead listing behind nothing but a query-string token.
