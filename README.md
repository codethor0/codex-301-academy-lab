# CodeThor AGENTS.md Lab

[![CI](https://github.com/codethor0/codex-301-academy-lab/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/codethor0/codex-301-academy-lab/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> **Independent educational project.** This is not an official website of
> OpenAI, OpenAI Academy, the AGENTS.md project, the Linux Foundation, LF
> Projects, or any tool vendor named here, and none of them endorse it.
> Mentions of the [AGENTS.md](https://agents.md) format and of third-party
> products are factual references.

A small Next.js site about the AGENTS.md format, built from a completed OpenAI
Academy Codex 301 lab. It shows how project instructions for coding agents,
a validated content contract, URL-driven filtering, and acceptance tests fit
together in a real repository that you can clone, run, and test locally or in
Docker.

It is meant for developers who want a working reference for writing
`AGENTS.md` files and for structuring a small, well-tested frontend change.

## What the project demonstrates

- **Project instructions for coding agents.** A root `AGENTS.md` and a scoped
  `content/AGENTS.md` that sets editorial ownership rules.
- **A validated content contract.** `lib/guides.ts` checks
  `content/guides.json` at load time. It rejects malformed or duplicate IDs,
  unapproved categories, mismatched destinations, and empty sections.
- **A Guides catalog at `/guides`.** It lists six approved articles, filters
  them by category through shareable, server-rendered URLs, and announces the
  result in a polite `role="status"` region.
- **Article pages at `/guides/<id>`.** They are generated statically from the
  approved content. Unknown IDs return HTTP 404.
- **Acceptance and regression tests.** They use only the Node.js built-in test
  runner and run against a live server.
- **A reusable read-only reviewer role** in
  `.codex/agents/frontend-reviewer.toml` for Codex CLI.
- **A hardened Docker image** with a non-root runtime and a health check.

## Learning path

1. Read [agents.md](https://agents.md) for the format itself.
2. Read the root `AGENTS.md` for project-level instructions: commands,
   guardrails, and the definition of done.
3. Read `content/AGENTS.md` to see how a nested file scopes rules to one
   directory.
4. Run the site and open `/guides`.
5. Open `/guides?category=workflows` directly, then switch filters and use
   Back and Forward. The URL is the filter state.
6. Read `lib/guides.ts` to see how the content contract is enforced.
7. Run `pnpm test` and read `tests/guides.test.mjs`.
8. Read `.codex/agents/frontend-reviewer.toml` and the Frontend review section
   of `AGENTS.md`.
9. Read `docs/guides-brief.md` and `output.txt` for the original brief and the
   release handoff record.
10. Run the site in Docker.

## Requirements

- Node.js 20.9 or later (the Next.js 16 minimum). CI and the Docker image use
  Node.js 22.
- pnpm 9.15.1, as pinned in the `packageManager` field of `package.json`.
  On Node.js 20 to 24, Corepack can provide it: `corepack enable`. Node.js 25
  and later no longer bundle Corepack, so install it first
  (`npm install --global corepack`) or install pnpm 9.15.1 directly.
- For Docker: Docker Engine with Compose v2.

No API keys, accounts, databases, external services, or environment variables
are required.

## Quick start

```bash
git clone https://github.com/codethor0/codex-301-academy-lab.git
cd codex-301-academy-lab
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL that the development server prints (by default
`http://localhost:3000`).

## Run with Docker

```bash
docker compose up --build -d
```

Open `http://127.0.0.1:3011`. The service is bound to `127.0.0.1` only, so
it is not reachable from other machines. `docker compose ps` shows
`(healthy)` once the server answers its health check, usually within a few
seconds.

To use another host port:

```bash
HOST_PORT=3021 docker compose up --build -d
```

To stop and remove the container:

```bash
docker compose down
```

Without Compose, the equivalent hardened run is:

```bash
docker build -t codethor-agents-md-lab:local .
```

```bash
docker run --rm --init -p 127.0.0.1:3011:3000 --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges codethor-agents-md-lab:local
```

How the image is built:

- It is a multi-stage build on the official `node:22-alpine` image, pinned
  by digest.
- Dependencies install with `pnpm install --frozen-lockfile` and the pinned
  pnpm version.
- Next.js standalone output is enabled only inside the image
  (`NEXT_OUTPUT_STANDALONE=1`). Native `pnpm build` and `pnpm start` are
  unchanged.
- The runtime stage contains only the server, static assets, and `public/`.
  It runs as the `node` user, and the application files are owned by root.
  npm, npx, Corepack, and Yarn are deleted from the runtime filesystem (they
  remain in the base image layers), and Alpine security updates are applied
  at build time, so rebuilds can pick up newer Alpine packages.
- Next.js telemetry is disabled.
- Compose drops all Linux capabilities, sets `no-new-privileges`, mounts the
  root filesystem read-only with a `/tmp` tmpfs, and runs an init process.

No image is published to a registry. You build it locally.

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Development server with hot reload (Turbopack) |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm test` | All acceptance and regression tests against a running server |
| `pnpm test:guides` | The original Academy Guides tests only |
| `pnpm build` / `pnpm start` | Production build and server |

`AGENTS.md` asks you not to run `pnpm build` while `pnpm dev` is running. The
build writes to `.next` and can break hot reload. Stop the dev server first,
or build in a separate checkout.

## Testing

Start a server (`pnpm dev`, `pnpm start`, or Docker), then run:

```bash
pnpm lint
pnpm typecheck
pnpm test
```

The tests request `http://localhost:3000` unless `GUIDES_BASE_URL` is set.
To test the Docker container:

```bash
GUIDES_BASE_URL=http://127.0.0.1:3011 pnpm test
```

Expected result: `tests 18`, `pass 18`, `fail 0`.

The suite has 18 tests:

- The 17 Guides tests from the Academy lab
  (`tests/guides.test.mjs`) cover:
  - the article contract and the pinned category mapping
  - the unfiltered catalog and each of the three category URLs
  - the complete title and sections of every article
  - a 404 for an unknown article
  - the primary navigation and its current-page state on each protected
    route
  - the original Guides and Resources links
- One compatibility test (`tests/compatibility.test.mjs`) checks that each
  supported-tool link is exposed to keyboard and assistive technology exactly
  once.

### Continuous integration

`.github/workflows/ci.yml` runs on pushes to `main`, on pull requests, and
on manual dispatch. It has read-only `contents` permission, uses actions
pinned to commit SHAs, and uses no secrets. It has two jobs:

- **validate**: frozen install, lint, typecheck, production build, then
  `pnpm test` against `pnpm start`.
- **docker**: builds the image, starts it with the hardening flags above,
  waits for the health check, confirms a non-root user, then runs
  `pnpm test` against the container.

## How the Guides catalog works

### Article contract

`content/guides.json` is the editorial source of truth. Each article has an
`id`, `title`, `description`, `category`, `destination`, and a nonempty list
of `sections`, each with a `heading` and `content`. `lib/guides.ts`
validates every article when the module loads:

- `id` is a lowercase, hyphen-separated slug and is unique.
- `category` is one of Getting Started, Workflows, or Best Practices.
- `destination` is exactly `/guides/<id>`.
- `title`, `description`, and every section are nonempty.

A violation stops the build or the server with an error that identifies the
article by its ID or its position in the list.

### Category filtering

| URL | Result |
| --- | --- |
| `/guides` | All six guides |
| `/guides?category=getting-started` | Getting Started guides |
| `/guides?category=workflows` | Workflows guides |
| `/guides?category=best-practices` | Best Practices guides |

The filtered list is rendered on the server, so a shared URL opens the same
view without JavaScript. An unknown or repeated `category` value shows all
guides. The selected filter is marked with `aria-current="page"`, and the
results summary (for example "Workflows. 2 guides shown.") updates in place.

### Routes

| Route | Purpose |
| --- | --- |
| `/`, `/about`, `/contact`, `/docs`, `/resources` | Starter pages (protected) |
| `/guides` | Original Guides content plus the catalog |
| `/guides/<id>` | One of the six approved articles |

Approved article IDs: `write-your-first-agents-md`,
`what-to-include-in-agents-md`, `use-nested-agents-md-files`,
`understand-instruction-precedence`,
`define-validation-and-review-expectations`, and `keep-agents-md-useful`.

## Reviewer configuration

`.codex/agents/frontend-reviewer.toml` defines a `frontend_reviewer` role for
Codex CLI. It reviews correctness, keyboard access and focus, semantic
markup, safe rendering, acceptance coverage, and protected-route
regressions, and it is meant to run read-only. Other tools do not load this
file automatically, but its instructions work as a review checklist.

## Project structure

```text
AGENTS.md                      Repository instructions for coding agents
content/AGENTS.md              Scoped rules for approved editorial content
content/guides.json            Six approved articles (editorial source of truth)
docs/guides-brief.md           The lab's release brief and acceptance criteria
lib/guides.ts                  Article contract validation and data access
pages/guides.tsx               Guides page, catalog, and category filters
pages/guides/[slug].tsx        Article route (static paths, 404 for unknown IDs)
components/                    Shared layout, navigation, and home page sections
tests/                         Acceptance and regression tests
.codex/agents/                 Codex CLI read-only reviewer role
.agents/skills/add_new_page/   Starter skill for adding static pages
Dockerfile, compose.yaml       Hardened container build and local service
output.txt                     Historical lab baseline and release handoff record
```

## Security

The site has no backend services, authentication, forms, or stored user data.

- The only user input is the `category` query parameter. It is compared
  against a fixed list and never rendered back to the page.
- All content is rendered as React text nodes. No raw HTML is injected.
- The site makes no requests to other origins. It uses the system font
  stack and serves its own favicon.
- Every response sends `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: DENY`,
  and a restrictive `Permissions-Policy`. `X-Powered-By` is not sent.
- Production responses also send a Content Security Policy. It limits
  scripts, styles, fonts, images, and connections to the site's own origin,
  and it blocks plugins, framing, and base-URI changes. `script-src` and
  `style-src` include `'unsafe-inline'` because the Turbopack production
  build emits a per-page inline chunk-loader script and the compatibility
  marquee sets inline styles. The site has no HTML injection sink, so this
  is an accepted trade-off. A strict nonce-based policy would require
  per-request rendering.
- HSTS is not set because the server speaks plain HTTP. Set it at the TLS
  terminator if you deploy behind HTTPS.

Dependency status on 2026-11-18:

- `pnpm audit --prod` reports no known vulnerabilities.
- `pnpm audit` (including dev dependencies) reports one moderate advisory,
  GHSA-g3hv-75wg-m249 in `minimatch@10.2.6`. It is reached only through
  ESLint's TypeScript parser (`eslint-config-next` →
  `@typescript-eslint/typescript-estree`), whose version range does not
  allow the fixed `minimatch` 11. It runs only while linting, on this
  repository's own glob patterns, and is not part of the built site.

Docker image scan with grype 0.122.1 on 2026-11-18: no findings in the
application's dependencies. 13 matches remain in the Alpine base packages:

- 10 matches from 5 OpenSSL 3.5.9 CVEs (4 high, 1 medium), each reported
  for both `libssl3` and `libcrypto3`. They affect AES-GCM-SIV misuse, CMS
  encryption, and QUIC.
- 3 matches from one medium BusyBox `wget` CVE, reported for `busybox`,
  `busybox-binsh`, and `ssl_client`.

None has an upstream fix yet, and the server does not call those code
paths. It serves plain HTTP and makes no outbound connections. Rebuild the
image after the base image is updated.

To report a vulnerability, see [SECURITY.md](SECURITY.md). This is a
learning reference, not a hardened production service. Review it and run
your own audits before you deploy anything built from it.

## Accessibility

Verified in Chromium (headless Chrome over the DevTools protocol) at
1280×900 and 390×844, against both the production build and the Docker
container:

- `lang="en"`, one `h1` per page, `main` landmarks, and meaningful titles.
- A visible focus indicator on every keyboard stop on `/guides`, in a
  logical order.
- The category filters work from the keyboard and mark the active filter.
- The results summary is one `role="status"` node whose text updates in
  place, for example "All categories. 6 guides shown." becomes
  "Workflows. 2 guides shown."
- The compatibility list exposes each of its 23 tool links once. The
  duplicate copy that makes the scroll loop seamless is `aria-hidden` and
  `inert`, and the scroll pauses while a link has focus. With
  `prefers-reduced-motion: reduce` the list does not move and the duplicate
  is not shown.
- Text meets the WCAG AA 4.5:1 contrast ratio in light and dark color
  schemes on the pages checked (`/`, `/guides`, an article, `/resources`).
- No horizontal scrolling on any route at 390 px width.

Firefox 160 (headless) rendered `/guides?category=workflows` at 1280 px and
an article page at 390 px correctly. That was a visual render check only.

Not verified:

- No screen reader (VoiceOver, NVDA, or JAWS) has been observed announcing
  the status update.
- Keyboard and interaction behavior in Firefox.
- Safari.

## Known limitations

- See the dependency and image scan notes under **Security**.
- The home page has no skip link. Seven navigation links come before the
  main content, and the `main` landmark is available for screen-reader
  navigation.
- The home page keeps the upstream site's descriptive copy about the
  AGENTS.md format. The unverified adoption figure was removed.
- `components/icons/GitHubIcon.tsx` is an unused upstream component.

## Troubleshooting

- **Tests hit the wrong server.** If another process listens on port 3000,
  `localhost` can reach it instead of this project, for example over IPv6.
  Check with `lsof -nP -iTCP:3000 -sTCP:LISTEN`, then set `GUIDES_BASE_URL`
  or start this project on another port: `pnpm dev --port 3001`.
- **"Start the application with pnpm dev" error from the tests.** No server
  is reachable at the test base URL. Start one, or set `GUIDES_BASE_URL`.
- **Hot reload stops working after a build.** Stop the dev server, delete
  `.next`, and start `pnpm dev` again.
- **Docker port already in use.** Set `HOST_PORT`, for example
  `HOST_PORT=3021 docker compose up --build -d`.

## Contributing

Issues and pull requests are welcome. Keep changes small and scoped. Before
you open a pull request:

1. Do not edit approved content in `content/guides.json` unless the change is
   editorial.
2. Do not weaken or remove existing tests. Add tests for new behavior.
3. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test` against a running
   server, and include the results.

## Maintenance

This is a personal learning project maintained on a best-effort basis. There
is no support commitment or release schedule. Maintenance is automated where
it can be:

- Dependabot opens weekly pull requests for npm packages, GitHub Actions
  pins, and the Docker base image digest (major versions are skipped), and
  security update pull requests for vulnerable dependencies
  (`.github/dependabot.yml`).
- CI runs on every push to `main` and on every pull request, so an update
  is merged only after lint, typecheck, build, and all tests pass natively
  and in the container.
- CodeQL code scanning, secret scanning, and secret push protection are
  enabled on the repository.

## License and attribution

The code is released under the MIT License (see `LICENSE`), which carries the
original copyright notice: Copyright (c) 2025 OpenAI.

- The website source derives from the open-source AGENTS.md website. Its
  footer read "Copyright © AGENTS.md a Series of LF Projects, LLC". This
  project replaced that footer with an independence notice so it would not
  suggest an official affiliation. The MIT notice in `LICENSE` is unchanged.
- The lab starter, including the brief, the approved guide content, the
  baseline tests, and the add-new-page skill, comes from the OpenAI Academy
  Codex 301 course.
- codethor0 completed the lab work: the Guides catalog, article route,
  validation module, expanded tests, and reviewer role. codethor0 also did
  the public-release changes listed below.
- Product names belong to their respective owners and appear only as
  factual compatibility references. No vendor logos or brand fonts are
  included.

### Changes from the Academy starter

These changes were made for the public release. They are not part of the
Academy lab's acceptance criteria. The pre-rebrand Academy tree was archived
before they were made.

- Branding:
  - CodeThor AGENTS.md Lab branding replaces the AGENTS.md website branding.
  - The agents.md Open Graph and Twitter metadata, the logos, and the
    favicons are removed. An original text favicon replaces them.
  - The 28 vendor logo files are removed. The compatibility list shows each
    tool's name as a text link.
  - The hotlinked OpenAI Sans font is replaced with the system font stack.
- Accessibility:
  - The compatibility list exposes each link once.
  - The language badges meet contrast requirements.
- Security headers and the Docker image are added.
- Dependencies:
  - `next` and `eslint-config-next` are upgraded to 16.4.6, and `tailwindcss`
    to 4.3.5.
  - Vulnerable transitive dependencies are refreshed.
  - The unused `@svgr/webpack` is removed.
