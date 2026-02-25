#!/bin/bash
set -eo pipefail

echo "==> Running local dry-run of GitHub Actions dist deployment"

# 1. Build the project
echo "==> Building project..."
npm run build:fast

# 2. Setup a temporary directory to act as the "artifact download"
TMP_DIST=$(mktemp -d)
cp -r dist/* "$TMP_DIST/"
echo "==> Saved dist/ output to $TMP_DIST"

# 3. Save initial state
CURRENT_BRANCH=$(git branch --show-current || echo "")
if [ -z "$CURRENT_BRANCH" ]; then
  CURRENT_BRANCH="main"
fi
SOURCE_SHA=$(git rev-parse --short HEAD)
SOURCE_MSG=$(git log -1 --pretty=%s)

echo "==> Creating/switching to dist branch..."
# Fetch dist branch if it exists, don't fail if it doesn't
git fetch origin dist:dist 2>/dev/null || true

# Switch to dist branch (create orphan if new)
if git show-ref --verify --quiet refs/heads/dist; then
  git checkout dist
else
  git checkout --orphan dist
  git rm -rf .
fi

echo "==> Applying build output..."
# Clean working tree and copy build output
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +
cp -r "$TMP_DIST"/* .

# Commit (skip push for dry run)
git add -A
if git diff --cached --quiet; then
  echo "==> No changes to dist — skipping commit"
else
  echo "==> Committing to dist branch..."
  git commit -m "dist: ${SOURCE_MSG} (${SOURCE_SHA})"
  
  echo "==> DRY RUN: Skipping push to origin"
fi

# Cleanup and return
echo "==> Restoring original branch ($CURRENT_BRANCH)..."
git checkout "$CURRENT_BRANCH" --force
rm -rf "$TMP_DIST"

echo "==> Dry run complete. You can inspect the local 'dist' branch using 'git log dist' or 'git checkout dist'."
