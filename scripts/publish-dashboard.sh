#!/usr/bin/env bash
# Publish the Four Systems dashboard to https://panamarealestateguide.com/dashboard/.
#
# What it does:
#   1. Re-renders the dashboard from current state/ JSONs
#   2. Pushes project/dashboard/index.html to main of Hermes08/panama-real-estate-guide
#      via the GitHub API (single commit, no PR — auto-generated artifact)
#   3. Netlify auto-deploys on the push
#
# Why direct-to-main (vs. the project's usual PR rule): this file is a generated
# artifact, not reviewable code. PRs per skill run would be noise. Each push
# triggers a Netlify build (~2-3 min) so call this intentionally, not on every
# /discovery or /producer run. Recommendation: run after a meaningful batch of
# work (a discovery + 1-2 producer runs, or an audit + refresh).
#
# Usage:
#   bash scripts/publish-dashboard.sh
#   bash scripts/publish-dashboard.sh --skip-render    # use whatever's already in output/

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
SECRETS="$HOME/.config/claude/secrets.env"

if [[ ! -f "$SECRETS" ]]; then
  echo "ERROR: $SECRETS not found. Run the project-secrets skill setup first." >&2
  exit 1
fi
# shellcheck disable=SC1090
source "$SECRETS"

REPO="Hermes08/panama-real-estate-guide"
REMOTE_PATH="project/dashboard/index.html"
LOCAL_HTML="$ROOT/output/dashboard.html"
BRANCH="main"
TIMESTAMP="$(date '+%Y-%m-%d %H:%M %Z')"

if [[ "${1:-}" != "--skip-render" ]]; then
  echo "==> Rendering dashboard from state/"
  python3 "$ROOT/scripts/render-dashboard.py"
fi

if [[ ! -f "$LOCAL_HTML" ]]; then
  echo "ERROR: $LOCAL_HTML missing. Run render-dashboard.py first." >&2
  exit 1
fi

echo "==> Encoding payload"
B64=$(base64 -i "$LOCAL_HTML" | tr -d '\n')

echo "==> Fetching current remote SHA (if file exists)"
REMOTE_SHA=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  "https://api.github.com/repos/$REPO/contents/$REMOTE_PATH?ref=$BRANCH" \
  | jq -r '.sha // empty')

if [[ -n "$REMOTE_SHA" ]]; then
  PAYLOAD=$(jq -nc \
    --arg msg "chore(dashboard): publish $TIMESTAMP" \
    --arg content "$B64" \
    --arg sha "$REMOTE_SHA" \
    --arg branch "$BRANCH" \
    '{message:$msg, content:$content, sha:$sha, branch:$branch}')
else
  PAYLOAD=$(jq -nc \
    --arg msg "chore(dashboard): publish $TIMESTAMP" \
    --arg content "$B64" \
    --arg branch "$BRANCH" \
    '{message:$msg, content:$content, branch:$branch}')
fi

echo "==> Pushing to $REPO:$BRANCH/$REMOTE_PATH"
RESP=$(curl -s -X PUT -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github+json" \
  "https://api.github.com/repos/$REPO/contents/$REMOTE_PATH" \
  -d "$PAYLOAD")

COMMIT_SHA=$(echo "$RESP" | jq -r '.commit.sha // empty')
ERR=$(echo "$RESP" | jq -r '.message // empty')

if [[ -z "$COMMIT_SHA" ]]; then
  echo "ERROR: push failed: $ERR" >&2
  echo "$RESP" | jq .
  exit 1
fi

echo "==> Pushed commit $COMMIT_SHA"
echo ""
echo "Netlify will deploy in ~2-3 min. Watch:"
echo "  https://app.netlify.com/sites/panamarealestateguide/deploys"
echo ""
echo "Live URL (after deploy completes):"
echo "  https://panamarealestateguide.com/dashboard/"
echo ""
echo "Credentials are set in Netlify env vars DASHBOARD_USER + DASHBOARD_PASS."
