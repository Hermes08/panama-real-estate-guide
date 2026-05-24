# QA Audit — positive-intel-engine pipeline (2026-05-20)

**Auditor.** Claude (background subagent) reading only the state/*.jsonl artifacts plus the skill spec under `positive-intel-engine/references/`.

**Scope.** Verify that the seven-step pipeline left a complete, reproducible audit trail for the 30 stories surfaced today (5 from the initial run + 25 from ad-hoc subagents). Cross-check every artifact against the schema implied by `references/workflow.md`, the decision tree in `references/publication-decision.md`, and the code in `scripts/cross_validate.py`, `scripts/score_story.py`, and `scripts/originality_engine.py`.

---

## Per-file verdict

| File | Exists | Valid JSONL | Row count | Schema | Ref integrity |
|---|---|---|---|---|---|
| `raw-stories-2026-05-20.jsonl` | YES | YES (30/30 parse) | 30 / 30 expected | YES | n/a (source of truth) |
| `cross-validated-2026-05-20.jsonl` | YES | YES (30/30 parse) | 30 / 30 expected | YES | YES (every row maps to a raw row) |
| `scored-stories-2026-05-20.jsonl` | YES | YES (30/30 parse) | 30 / 30 expected | YES | YES (every row maps to a cross-validated row) |
| `decisions-2026-05-20.jsonl` | YES | YES (30/30 parse) | 30 / 30 expected | YES | YES (every row maps to a scored row) |
| `raw-stories-2026-05-20.jsonl.bak` | YES | YES (5/5 parse) | 5 / 5 expected | YES | YES (strict subset of raw) |
| `rejected-log.jsonl` | **NO** | — | 0 / 6 expected | — | — |

### `raw-stories-2026-05-20.jsonl` — PASS (with caveat)

- 30 JSON objects, all parse.
- Every row has the 8 fields specified in workflow.md step 2 (`source_id`, `url`, `published_at`, `title`, `raw_text`, `tier`, `locality`, `extracted_at`). Two extra fields (`source_name`, `language`, `adapter`) are present on every row — these are additive and not contradictory.
- Field types: `title`/`raw_text`/`tier`/`source_id`/`url` are strings; `locality` is a list; `published_at`/`extracted_at` are ISO-8601 strings.
- **Caveat — URL is not a unique key.** Only 22 of 30 URLs are distinct. 7 URLs appear ≥2 times (different `source_id` values pointing at the same article — e.g. `prensa` vs `prensa-mirror`, `tvn` vs `tvn-2`). One bare-domain entry `tvn-2.com` appears 3 times with `source_id="unknown"` and is clearly a malformed extraction. The pipeline does not appear to dedupe on URL at extraction time (workflow.md §2 says to hash `(source_url + published_at + title_normalized)` into `state/extracted-hashes.txt` — that file does not exist, so this guardrail was skipped on this run).

### `cross-validated-2026-05-20.jsonl` — PASS

- 30 rows, all parse.
- All raw fields preserved. Adds the 4 fields specified in workflow.md step 3: `confirmed_by` (list[str]), `confirmed` (bool), `needs_confirmation` (bool), `fact_signature` (dict with `amounts`, `years`, `localities`, `title_words`).
- `confirmed_by` is sorted unique on every row.
- `confirmed == (len(confirmed_by) >= 1)` holds on every row (matches the implementation in `cross_validate.py:97`).
- Composite-key conservation (`url`, `source_id`, `title`) is exact between raw → cv: same multiset of 30 entries, no rows added or dropped.

### `scored-stories-2026-05-20.jsonl` — PASS

- 30 rows, all parse. All cross-validated fields preserved. Adds the 2 fields specified in workflow.md step 4: `category` (str), `score` (int).
- Category distribution: `positive-regional` 13, `tourism` 8, `transportation` 3, `infrastructure` 3, `real-estate` 1, `community-social` 1, `culture-events` 1. All 7 categories are valid per the 13-cat spec + `positive-regional` catch-all.
- Score range: 16–92. All numeric.
- Composite-key conservation: exact match with cv.
- **Observation —** no rows were dropped at the positive-impact filter on this run. `score_story.py:165` would write any excluded rows to `state/rejected-log.jsonl`; the absence of that file means zero hard rejections at this stage, not a missing artifact.

### `decisions-2026-05-20.jsonl` — PASS (with one logic deviation)

- 30 rows, all parse. All scored fields preserved. Adds `decision` (str) and `decision_reason` (str).
- Decision breakdown: `monitor` 17, `reject` 6, `publish_now` 5, `delay` 2. Hold-rate = 19/30 = 63% (within the 30–70% band publication-decision.md §"Hold rate target" calls healthy).
- Composite-key conservation: exact match with scored.
- **Caveat — this file is not produced by any script in `scripts/`.** `originality_engine.py:_decide_action` returns the action and writes only `publication_action` into rows it routes to briefs/opportunity-bank/rejected-log. The `decision` + `decision_reason` fields and the `decisions-<date>.jsonl` filename appear to have been emitted by an ad-hoc / subagent pass, not by `originality_engine.run`. The schema is sensible but is NOT codified anywhere in the skill spec — workflow.md ends at step 7 (originality engine) and never names this file.
- **Logic deviation — 4 of 30 rows do not match the decision tree in publication-decision.md.**
  1. `laestrella` Tocumen story (score=92, confirmed=True, transportation, national, `confirmed_by=["prensa"]`) → tree says `monitor` (rule 5: confirmed+evergreen+50-69 doesn't fire because score≥70; rule 3/4 need `gap`/`competitor_covered`, both absent; rule 6 needs solo-source, but it has 1 confirm). Actual: `delay` with reason "score=92 but confirmation thin". This is a reasonable human-judgement override but not what the documented tree says.
  2-4. Three tourism stories (score=34, confirmed=False, regional tier) → tree says `monitor` (rule 8 requires score≥65). Actual: `publish_now` with reason "tourism in season". Again a humane override but not what the tree says.

### `raw-stories-2026-05-20.jsonl.bak` — PASS

- 5 rows, all parse. Schema identical to `raw-stories`.
- All 5 URLs are present in `raw-stories-2026-05-20.jsonl` — the backup is a strict subset, confirming the "5 originals appended to with 25 subagent stories" narrative.

### `rejected-log.jsonl` — FAIL (does not exist)

- The task brief expected 6 rejected items in this file. The file is absent in `state/` and nowhere else on disk under the project root.
- The 6 reject decisions DO exist — they live inside `decisions-2026-05-20.jsonl` with `decision=="reject"` (all six are "score < 30 (too thin)" — score 16, 18, 18, 22, 26, 26).
- Per `publication-decision.md` §"The four outcomes", a `reject` should be logged to `state/rejected-log.jsonl` with a reason. `originality_engine.py:147` does this when invoked, but only for `publication-decision-reject` rejections from its own `_decide_action`. Since the ad-hoc pass that wrote `decisions-*.jsonl` apparently never called `originality_engine.run`, no rejected-log was emitted.
- The 6 rejects ARE traceable — through `decisions-*.jsonl` back to `scored-*.jsonl` back to `cross-validated-*.jsonl` back to `raw-stories-*.jsonl` via composite key — but the dedicated reject log the spec requires is missing.

---

## Cross-file referential integrity — PASS

Tested by building composite keys `(url, source_id, title[:50])` because URL alone is non-unique. Result: raw / cross-validated / scored / decisions all carry the **same 30-element multiset** of composite keys. No rows are added, dropped, or silently rekeyed between stages. The 5-row .bak is a strict subset of raw.

## Cross-validate logic — REPRODUCIBLE

`confirmed_by` lists are sorted, deduplicated, and `confirmed` is exactly `len(confirmed_by) >= 1` on every row. A reader implementing `cross_validate.py:_signatures_match` against `fact_signature` (which is persisted on every row) can reconstruct the same `confirmed_by` lists deterministically. The deterministic 3-of-4 fact-signature rule from workflow.md §3 is honored.

## Scoring — PARTIALLY REPRODUCIBLE

`score` and `category` are present on every row, but the four axis sub-scores (impact, geo, seo, durability) are NOT persisted. A reader can re-run `score_story._score` against `cross-validated-*.jsonl` and check the total, but cannot inspect WHY a story scored 34 instead of 50 without re-deriving from raw text. workflow.md §4 implies the axes are an internal detail, so this is spec-compliant but worth noting as a reproducibility ceiling.

## Decision trace — REPRODUCIBLE WITH CAVEAT

Every story carries `score`, `category`, `confirmed`, `confirmed_by`, `tier`, `decision`, `decision_reason`. A reader can apply the publication-decision.md tree to each row and reproduce the decision for 26/30 rows exactly. For the 4 deviations above the `decision_reason` string is the only place the override logic is recorded — so the trace is human-readable but not machine-reproducible. The `gap` and `competitor_covered` fields the decision tree references (step 5 of workflow.md) are NOT present on any row, meaning step 5 was apparently skipped on this run (consistent with `--skip-discovery`-style ad-hoc runs).

## Reject traceability — PARTIAL

The 6 rejected URLs all resolve back to raw-stories rows via composite key. The rejection reasons ("score=X<30 (too thin)") are self-explanatory and re-derivable from the score field. **However,** because there is no `rejected-log.jsonl`, a reader who only looks at the conventional reject log will see nothing — they must know to look inside `decisions-*.jsonl` and filter `decision=="reject"`. That extra knowledge is not in workflow.md or publication-decision.md.

---

## Reproducibility verdict — **CONDITIONAL PASS**

Someone reading only the JSONL files (no code) can:

1. **Identify why each story got its final decision** — YES for 26/30 rows (matches decision tree), QUALIFIED YES for the other 4 (the `decision_reason` string explains the override in plain language).
2. **Re-run the cross-validate logic and get the same `confirmed_by`** — YES. `fact_signature` is persisted in full; `cross_validate._signatures_match` is a 35-line deterministic function. A reader can re-derive `confirmed_by` exactly.
3. **Trace any reject back to its raw-stories source** — YES via composite key `(url, source_id, title)`. But the conventional `state/rejected-log.jsonl` log is missing, so a reader following the spec literally will not find rejections where they expect them.

**Outstanding gaps (in order of severity).**

1. **MISSING — `state/rejected-log.jsonl`.** Spec mandates it; 6 rejects exist; file was never written. Fix: extract the 6 `decision=="reject"` rows from `decisions-2026-05-20.jsonl` (preserving each row plus `rejected_reason` and `rejected_at` fields) and append to `state/rejected-log.jsonl`.
2. **MISSING — `state/extracted-hashes.txt`.** Workflow.md §2 mandates extraction-time deduplication via this hash file. The 7 duplicate URLs in raw (including 3 malformed `tvn-2.com` rows with `source_id=unknown`) indicate this guardrail was skipped. Fix: run a backfill pass that hashes `(source_url + published_at + title_normalized)` for every raw row and writes the file.
3. **UNDOCUMENTED — `decisions-<date>.jsonl` schema.** This file is real and useful, but it is not described in workflow.md or produced by `originality_engine.py`. Fix: either codify the schema in workflow.md §7 (or a new §7.5) and have `originality_engine.run` write it, OR document the ad-hoc subagent that produced it.
4. **LOGIC DEVIATION — 4 decision-tree overrides.** Three "tourism in season" `publish_now` calls (rule 8 says score≥65; actual scores were 34) and one `confirmation thin` `delay` on a confirmed-by-1 national story (rule says `monitor`). Either the tree in publication-decision.md needs revision to capture these overrides explicitly, or the agent's reasoning should be reined back to the documented tree.
5. **MISSING — gap / competitor_covered fields.** Step 5 of workflow.md (competitor gap analysis) is the only step that does not have a dedicated script in `scripts/`. The fields it produces are absent from the artifacts. The pipeline ran without step 5; this is consistent with `--skip-discovery` but should be flagged in the dashboard so it isn't mistaken for a clean run.

Aside from the missing `rejected-log.jsonl`, the audit trail is in good shape — schema-correct, type-correct, conserved across stages, and human-readable.
