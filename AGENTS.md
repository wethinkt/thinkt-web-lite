# Agents Guide

Instructions for AI coding agents working in this codebase.

## Project Overview

This is the web frontend for [go-thinkt](https://github.com/wethinkt/go-thinkt). It is a static webapp (vanilla HTML/CSS/JS) with no build step, no package manager, and no framework. The output is embedded directly into the Go binary via `//go:embed`.

## Architecture

- **`index.html`** — Single-page app. All JavaScript is inline in a `<script>` tag. This is the entry point and contains all application logic (API calls, DOM rendering, state management).
- **`static/style.css`** — Complete styling including dark mode, light mode, responsive layout, and source-specific colors (Claude=orange, Kimi=purple, Gemini=blue, Copilot=green).
- **`static/i18n.js`** — Internationalization module. Loaded before `index.html`'s inline script. Exposes a global `i18n` object and a `t()` helper. Supports `en`, `es`, `zh`.

## Key Conventions

- **No build tools.** Do not introduce npm, webpack, vite, or any bundler. Files are served as-is.
- **No external dependencies.** No CDN links, no npm packages. Everything is self-contained.
- **Inline JS in index.html.** The application logic lives in `<script>` inside `index.html`, not in separate JS files. `i18n.js` is the exception because it must load before the main script.
- **Same-origin API calls.** All fetch calls use `/api/v1/...` paths (same origin). There is no configurable API base URL — the webapp is always served by go-thinkt.
- **`data-i18n` attributes** on HTML elements mark them for automatic translation by `i18n.js`.
- **State is minimal.** `visibleSources` (Set) and `availableApps` (array) are the only state. No state management library.

## Submodule Relationship

This repo is a git submodule of go-thinkt, mounted at `internal/server/web-lite/`. The Go project embeds only the webapp files:

```go
//go:embed web-lite/index.html
//go:embed web-lite/static/*
var webappFS embed.FS
```

### Setup

If the submodule directory is empty after cloning go-thinkt, initialize it:

```sh
git submodule update --init --recursive
```

### Updating the submodule ref in go-thinkt

After committing and pushing changes in this repo, update the ref in go-thinkt:

```sh
cd /path/to/go-thinkt
git add internal/server/web-lite
git commit -m "update web-lite submodule"
```

### What go-thinkt references

The following files in go-thinkt depend on this submodule:

- **`internal/server/static.go`** — Embeds files and serves them. SPA routing sends all non-file paths to `index.html`.
- **`internal/server/server.go`** — Mounts `staticHandler()` as the catch-all route.
- **`Taskfile.yml`** — Lists `internal/server/web-lite/**/*` as build sources.
- **`.github/workflows/ci.yml`**, **`release.yml`** — Checkout with `submodules: true` so the embed works in CI.

### Notes

- The Go server serves the webapp on the same origin. All API calls are same-origin.
- Only `index.html` and `static/*` are embedded. Other files (README, AGENTS.md, LICENSE, .gitignore) are excluded from the binary.

## Adding a New Language

1. Add a new key to `i18n.languageNames` in `static/i18n.js`.
2. Add a corresponding translations block under `i18n.translations`.
3. Update the `lang:` auto-detect ternary at the top of the `i18n` object.

## Adding a New Source Color

1. Add `.source-item.source-<name>` and `.source-badge.source-<name>` rules in `static/style.css`.
2. Source names are lowercased from the API response to form CSS class names (`source-${s.name.toLowerCase()}`).

## Testing

No automated tests. To verify changes, run the go-thinkt server and open the dashboard in a browser. Check:
- Dark and light modes
- All three languages
- Source visibility toggles
- Project list rendering
- Modal (click any API button in the nav bar)
- Mobile layout (resize below 700px)
