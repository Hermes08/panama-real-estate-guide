-- =============================================================================
-- 0002 — fields the project-page template needs
-- =============================================================================
-- Driven by what actually ranks for project names. Competing broker pages carry
-- developer, architect, building structure, delivery phasing, and location
-- context; our pages carried none of it. See docs/project-page-template.md.
--
-- Every column is nullable and every section hides when empty, so this can ship
-- before the writing does.
-- =============================================================================

alter table developers
  add column if not exists architect text;

alter table projects
  -- The paragraph that stops a page reading like a syndicated listing: the one
  -- specific thing that makes this project different. Pino Alto's is that it
  -- holds the only full Tourism Authority short-term-rental approval in Panama.
  add column if not exists hook            text,
  add column if not exists architect       text,
  add column if not exists storeys         smallint,
  add column if not exists total_units     smallint,
  add column if not exists phases          smallint,
  -- Prose, all optional, all rendered only when present.
  add column if not exists location_note   text,   -- what is walkable, how far to the airport
  add column if not exists suits           text,   -- who it is for
  add column if not exists drawbacks       text,   -- and who it is not for
  add column if not exists buying_note     text,   -- deposit structure, financing, payment schedule
  add column if not exists faqs            jsonb not null default '[]'::jsonb,
  -- Where our figures came from, so a price that disagrees with eight broker
  -- sites can be traced rather than argued about.
  add column if not exists price_source_url text,
  add column if not exists price_checked_on date;

-- A published project must clear the minimum bar in the template: a hook, a
-- named drawback, and real FAQs. Enforced only on publish, so drafts can be
-- saved half-written.
alter table projects
  add constraint published_projects_need_content check (
    not published
    or (hook is not null
        and drawbacks is not null
        and jsonb_array_length(faqs) >= 3)
  ) not valid;

-- NOT VALID: the 13 already-published rows predate this rule and would block
-- the migration. New and updated rows are checked from now on. Once the
-- backlog is written, run:
--   alter table projects validate constraint published_projects_need_content;

comment on constraint published_projects_need_content on projects is
  'A published project page needs its hook, a named drawback, and 3+ FAQs. '
  'Below that it is a listing, and competitors already have ten of those.';
