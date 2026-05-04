#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
#  Apply v2 Interactive Experience to panama-real-estate-guide
#  Branch: feat/v2-interactive-experience
# ─────────────────────────────────────────────────────────────────
#  This script assumes you are running it from the root of your
#  panama-real-estate-guide repo (the one with the project/ folder
#  that publishes to Netlify).
# ─────────────────────────────────────────────────────────────────
set -euo pipefail

REPO_ROOT="${1:-$(pwd)}"
PKG_DIR="${HOME}/Documents/Claude/Projects/Panama Real Estate Guide/v2_branch_package"

if [ ! -d "$REPO_ROOT/project" ]; then
  echo "❌ Could not find $REPO_ROOT/project — pass the repo path as arg 1, e.g.:"
  echo "   bash APPLY.sh ~/code/panama-real-estate-guide"
  exit 1
fi

echo "→ Repo:   $REPO_ROOT"
echo "→ Source: $PKG_DIR"

cd "$REPO_ROOT"

# 1. Ensure clean working tree on main
git fetch origin
git checkout main
git pull --ff-only origin main

# 2. Create the feature branch (or reset if it already exists)
if git show-ref --verify --quiet refs/heads/feat/v2-interactive-experience; then
  echo "→ Branch exists — checking out + resetting to main"
  git checkout feat/v2-interactive-experience
  git reset --hard main
else
  git checkout -b feat/v2-interactive-experience
fi

# 3. Drop the v2 components into project/v2/
mkdir -p project/v2
cp "$PKG_DIR/HeroV2.jsx"            project/v2/HeroV2.jsx
cp "$PKG_DIR/LifestyleQuiz.jsx"     project/v2/LifestyleQuiz.jsx
cp "$PKG_DIR/PanamaMap.jsx"         project/v2/PanamaMap.jsx
cp "$PKG_DIR/JournalReveal.jsx"     project/v2/JournalReveal.jsx
cp "$PKG_DIR/SocialProofTicker.jsx" project/v2/SocialProofTicker.jsx
cp "$PKG_DIR/WhatsAppV2.jsx"        project/v2/WhatsAppV2.jsx
cp "$PKG_DIR/components.v2.jsx"     project/v2/components.v2.jsx
cp "$PKG_DIR/preview.v2.html"       project/v2/preview.v2.html
cp "$PKG_DIR/BRAND_BRIEF.md"        project/v2/BRAND_BRIEF.md

# 4. Stage, commit, push
git add project/v2
git commit -m "feat(v2): interactive experience lab — hero trio, quiz, map, journal reveal, social proof, WhatsApp concierge

- HeroV2: City/Beach/Mountain lifestyle trio + motion strip
- LifestyleQuiz: 3-step self-segmenting quiz funnels to existing #book-consultation
- PanamaMap: stylized 5-region SVG with hover tooltips + filter events
- JournalReveal: #1 article hidden behind reveal interaction
- SocialProofTicker: rotating 'just reserved' ticker (mock data)
- InventoryBadge: 'X units left this week' chip for project cards
- WhatsAppV2: concierge sticky with name + 5-min response promise + 4-lang presets

DOES NOT touch the existing Book a 30-min consultation form (marketing integration preserved).
DOES NOT modify project/components.jsx — additive only, lives in project/v2/.
"

git push -u origin feat/v2-interactive-experience

echo ""
echo "✓ Pushed feat/v2-interactive-experience"
echo "→ Netlify will build a deploy preview automatically."
echo "→ Open project/v2/preview.v2.html locally to see the v2 experience in isolation."
echo ""
echo "When you're ready to wire it into the live page, edit project/components.jsx"
echo "and either swap <Hero /> for <HeroV2 /> behind a feature flag, or compose a new"
echo "<AppV2 /> in project/index.html for a /v2 preview route."
