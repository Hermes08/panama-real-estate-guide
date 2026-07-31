-- =============================================================================
-- 0003 — fields the area-page template needs
-- =============================================================================
-- Mirrors 0002's reasoning, one layer up: an area page answers "where should I
-- buy", not "what should I buy". Positioning and title status already exist
-- from 0001 — this adds the rest of what page-types.md calls for: real cost
-- figures, who an area suits, how to get there, and an FAQ.
--
-- Every column is nullable and templates hide empty sections, so this ships
-- before the writing does, same as 0002.
-- =============================================================================

alter table areas
  add column if not exists cost_of_living_note text,   -- rent, utilities, groceries — sourced figures
  add column if not exists getting_around_note  text,   -- airport distance, road quality, car-required
  add column if not exists suits                text,   -- who ends up here
  add column if not exists drawbacks            text,   -- and who it doesn't suit
  add column if not exists faqs                 jsonb not null default '[]'::jsonb,
  add column if not exists sources              jsonb not null default '[]'::jsonb; -- [{label, url, checked_on}]

comment on column areas.faqs is
  'Real buyer questions, [{"q": "...", "a": "..."}]. 3+ before a hub page is worth publishing.';
comment on column areas.sources is
  'Every figure needs one of these. [{"label": "...", "url": "...", "checked_on": "YYYY-MM-DD"}].';
