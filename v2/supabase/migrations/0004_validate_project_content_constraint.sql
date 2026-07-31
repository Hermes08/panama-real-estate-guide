-- =============================================================================
-- 0004 — validate the publish-bar constraint now that the backlog is written
-- =============================================================================
-- 0002 added published_projects_need_content as NOT VALID because the 13
-- already-published rows predated it. All 13 (plus the projects published
-- since) now carry a hook, a drawback, and 3+ FAQs, so this promotes the
-- constraint to fully validated: Postgres checks every existing row once,
-- and the exception for old data goes away.
-- =============================================================================

alter table projects
  validate constraint published_projects_need_content;
