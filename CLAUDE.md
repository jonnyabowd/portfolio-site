# CLAUDE.md

Guidance for Claude Code sessions working in this repository.

## Git workflow — READ FIRST (avoids push conflicts)

This repo is worked on from **multiple sessions** (local machine + cloud
sessions). They all publish to the same branch, so a session running on a
stale clone will have its push **rejected** by git. To avoid that:

1. **Sync before you start and before you push.** Always bring your local
   branch up to date with the remote first:
   ```
   git fetch origin
   git rebase origin/master        # rebase your work onto the latest
   ```
   Do this at the start of a task, again right before committing, and again
   right before pushing. Pushing to `master` is NOT what avoids conflicts —
   fetching/rebasing before you push is.

2. **`master` is the live branch.** GitHub Pages serves this repo at
   `www.jonnyabowd.com` (see `CNAME`) straight from `master`. Every push to
   `master` deploys to the public site within a minute or two. There is no
   build step — the committed files are what ships.

3. **If a push is rejected** ("fetch first" / "non-fast-forward"), the remote
   moved under you. Do NOT force-push `master`. Instead:
   ```
   git fetch origin && git rebase origin/master
   ```
   then push again. A rejection is git protecting other sessions' commits —
   nothing is lost.

4. **Don't run two sessions on the same files at once.** Concurrent edits to
   the same files are the one thing rebasing can't auto-resolve. Let one
   session finish and push before starting another on overlapping work.

## Project overview

- **Static site** — plain HTML/CSS, no framework, no build/bundler.
- **Homepage:** `index.html` (uses `css/styles.css`).
- **Case studies:** `projects/*.html` (use `css/projects.css`). These are
  intentionally `<meta name="robots" content="noindex">` — the owner wants
  the site findable but does not want past-employer work in search results.
  Keep the noindex when editing project pages.
- **Dependencies:** Bootstrap 5.3.3 (grid only) + Google Fonts, both via CDN.
- **Analytics:** GA4 tag `G-TLN1LR5XT6` in the `<head>` of every page.

## Images

- Content images (`<img>`) are **WebP**. When adding new ones, convert to
  WebP; use *lossless* for UI screenshots (crisp text/thin lines) and
  high-quality *lossy* (q≈92) for photographs. Cap width around 2400px.
- **Keep these as-is (do not convert to WebP):** the favicons, the cursor
  images, and the social-share `og:image` (`images/ja-image-preview.png`) —
  link-preview scrapers handle WebP poorly.
- Some source screenshots are low-resolution; they look soft when scaled up
  on high-DPI displays. That is a source-resolution limit, not compression —
  it can only be fixed by re-exporting at 2× from the original design files.
