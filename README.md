# CodeThor AGENTS.md Lab

> **Independent educational project.** This is not an official website of
> OpenAI, the AGENTS.md project, the Linux Foundation, LF Projects, or any tool
> vendor named here, and none of them endorse it. Mentions of the
> [AGENTS.md](https://agents.md) format and of third-party products are
> factual references.

A completed OpenAI Academy Codex 301 lab exercise, published as a learning
reference. The Academy starter is a local Next.js (Pages Router) site derived
from the open-source AGENTS.md website. In the exercise, the Guides page grows
into a data-backed article catalog. It gains category filters, shareable
filter URLs, article routes, and acceptance tests. The work follows a written
brief with separate content and frontend owners.

The repository demonstrates the lab workflow: scoped agent instructions,
test-first acceptance checks, content-contract validation, and a reusable
read-only review role.

### Public-release changes

The public release changes some things the Academy lab left alone. These
changes are not part of the lab's acceptance criteria:

- The site shows CodeThor AGENTS.md Lab branding in place of the original
  AGENTS.md website branding.
- The agents.md Open Graph and Twitter image, domain, and URL metadata are
  removed.
- The LF Projects copyright footer is replaced with an independence notice.
- The AGENTS.md logo, the Open Graph image, and the favicons are replaced
  with an original text favicon (`public/favicon.svg`).
- The 28 vendor logo files are removed. The compatibility list now shows each
  tool's name as a text link.

The pre-rebrand Academy tree, including the navigation fix described below,
was archived before these changes. The validation evidence for that tree is
in `output.txt`.

## What the project demonstrates

- **Project instructions for coding agents**: the root `AGENTS.md` and a scoped
  `content/AGENTS.md` that sets editorial ownership rules.
- **A validated content contract**: `lib/guides.ts` checks
  `content/guides.json` at load time. It rejects bad IDs, duplicate IDs,
  unapproved categories, mismatched destinations, and empty sections.
- **Guides catalog** at `/guides`: lists all six approved articles, filters by
  category with server-rendered shareable URLs, and has a polite
  `role="status"` results summary.
- **Article pages** at `/guides/<id>`: generated statically from the approved
  content. Unknown slugs return HTTP 404. Primary navigation marks Guides as
  the current section (`aria-current="true"`).
- **Acceptance and regression tests** in `tests/guides.test.mjs`. They use only
  Node.js's built-in test runner.
- **A reusable reviewer role** in `.codex/agents/frontend-reviewer.toml` for
  Codex CLI.

## Routes

| Route | Purpose |
| --- | --- |
| `/`, `/about`, `/contact`, `/docs`, `/resources` | Existing starter pages (protected) |
| `/guides` | Original Guides content plus the full catalog |
| `/guides?category=getting-started` | Getting Started articles |
| `/guides?category=workflows` | Workflows articles |
| `/guides?category=best-practices` | Best Practices articles |
| `/guides/<id>` | One of the six approved articles |

Approved article IDs: `write-your-first-agents-md`,
`what-to-include-in-agents-md`, `use-nested-agents-md-files`,
`understand-instruction-precedence`,
`define-validation-and-review-expectations`, and `keep-agents-md-useful`.

An unknown or repeated `category` value shows all guides.

## Prerequisites

- Node.js 20 or later (verified with Node.js 26.13.1)
- pnpm 9.15.1, as pinned in `package.json`'s `packageManager` field (Corepack
  can provide it)

No API keys, external services, databases, or environment variables are needed.

## Install and run

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL that the development server prints (by default
`http://localhost:3000`).

## Commands

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server with hot reload (Turbopack) |
| `pnpm lint` | Run ESLint |
| `pnpm typecheck` | Run `tsc --noEmit` |
| `pnpm test:guides` | Run the Guides acceptance tests against a running server |
| `pnpm build` / `pnpm start` | Production build and server (see the note below) |

`AGENTS.md` asks you not to run `pnpm build` while `pnpm dev` is running. The
build writes to `.next` and can break the dev server's hot reload. Stop the dev
server first, or build in a separate checkout. A production build in a
separate copy succeeded, and all 17 Guides tests passed against `pnpm start`.

## Testing and validation

Start the development server, then in a second terminal run:

```bash
pnpm lint
pnpm typecheck
pnpm test:guides
```

The Guides tests send requests to `http://localhost:3000` unless
`GUIDES_BASE_URL` is set:

```bash
GUIDES_BASE_URL=http://127.0.0.1:3000 pnpm test:guides
```

The suite has 17 tests. They cover:

- the article contract and the pinned category mapping
- every catalog view: unfiltered and each of the three category URLs
- the complete title and sections of every article
- a 404 for an unknown article
- the primary navigation and its current-page state on each protected route
- the original Guides and Resources links

## Project structure

```text
AGENTS.md                      Repository instructions for coding agents
content/AGENTS.md              Scoped rules for approved editorial content
content/guides.json            Six approved articles (editorial source of truth)
docs/guides-brief.md           The lab's release brief and acceptance criteria
lib/guides.ts                  Article contract validation and data access
pages/guides.tsx               Guides page, catalog, and category filters
pages/guides/[slug].tsx        Article route (static paths, 404 for unknown IDs)
components/                    Shared layout (ContentPage), Navbar, and sections
tests/guides.test.mjs          Acceptance and regression tests
.codex/agents/frontend-reviewer.toml  Codex CLI read-only reviewer role
.agents/skills/add_new_page/   Starter skill for adding static pages
output.txt                     Historical lab baseline and completion report
```

## Content ownership

`content/guides.json` is approved editorial material. Changes to article copy,
IDs, categories, or destinations belong to the content owner. They must still
pass the contract in `lib/guides.ts` and the tests. See `content/AGENTS.md` and
`docs/guides-brief.md`.

## Reviewer configuration

`.codex/agents/frontend-reviewer.toml` defines a `frontend_reviewer` role for
Codex CLI. It reviews correctness, keyboard access and focus, semantic markup,
safe rendering, acceptance coverage, and protected-route regressions. The
review is meant to run read-only. Other tools do not load this file
automatically. Its instructions can be reused as a review checklist.

## Security considerations

- The site has no backend services, authentication, or user-supplied
  persistent data.
- The only untrusted input is the `category` query parameter. It is compared
  against a fixed list of category slugs and never rendered back to the page.
- All content is rendered as React text nodes. No raw HTML is injected.
- Dependency advisories: see **Known limitations**.

## Known limitations

- **Dependency advisories.** `next` and `eslint-config-next` were upgraded
  from 16.1.0 to 16.4.6. That upgrade cleared every advisory against `next`.
  As of 2026-11-18, `pnpm audit --prod` still reports 23 advisories: 1
  critical, 16 high, 5 moderate, and 1 low.
  - 20 of them reach the project through `@tailwindcss/postcss@4.1.11`, via
    `tar`, `postcss`, `nanoid`, and `source-map-js`.
  - The other 3 (one in `@babel/core` and two in `browserslist`) reach it
    through `next` → `styled-jsx` → `@babel/core`.
  - All of these packages run only at build time, on the project's own
    files. The site does not unpack archives or process CSS or source maps
    supplied by visitors.
  - Upgrading Tailwind CSS is a pending follow-up.
  - The project is a local learning reference and is not hardened for
    production. Run `pnpm audit` before you deploy anything built from it.
- Screen-reader announcements of the results status were checked in markup
  only. No screen reader has spoken them in a test.
- Manual browser checks of the Academy lab were done in one Chromium-based
  browser. The public-release rebranding was checked through server-rendered
  markup, the automated tests, lint, and typecheck. It has not been checked
  visually in a browser.
- The home page keeps the upstream site's descriptive copy, including its
  adoption figure ("over 60k open-source projects"). This project has not
  checked that figure independently.
- `components/icons/GitHubIcon.tsx` is an unused upstream component.

## Troubleshooting

- **Tests hit the wrong server.** If another process already listens on port
  3000, `localhost` can reach that process instead of this project. For
  example, it can listen on IPv6 while this project listens on `127.0.0.1`.
  Check with `lsof -nP -iTCP:3000 -sTCP:LISTEN`. Then set `GUIDES_BASE_URL` to
  this project's address, or start it on another port:
  `pnpm dev --port 3001`.
- **"Start the application with pnpm dev" error from the tests.** The server
  is not reachable at the test base URL. Start it, or set `GUIDES_BASE_URL`.
- **Hot reload stops working after a build.** Stop the dev server, delete
  `.next`, and start `pnpm dev` again.

## Contributing

Issues and pull requests are welcome. Keep changes small and scoped. Before you
open a pull request:

1. Do not edit approved content in `content/guides.json` unless the change is
   an editorial change.
2. Do not weaken or remove the existing acceptance tests. Add tests for new
   behavior.
3. Run `pnpm lint`, `pnpm typecheck`, and `pnpm test:guides` with the dev
   server running, and include the results.

## License and attribution

The code is released under the MIT License (see `LICENSE`). That license
carries the original copyright notice: Copyright (c) 2025 OpenAI.

- The website source is derived from the open-source AGENTS.md website. On
  that website, the footer reads "Copyright © AGENTS.md a Series of LF
  Projects, LLC". This project removed that footer so it would not suggest an
  official affiliation. The MIT copyright notice in `LICENSE` is unchanged.
- The lab starter comes from the OpenAI Academy Codex 301 course. This
  includes the brief, the approved guide content, the baseline tests, and the
  add-new-page skill.
- Product names belong to their respective owners. They appear only as
  factual compatibility references. No vendor logos are included.
- codethor0 completed the lab work: the Guides catalog, article route,
  validation module, expanded tests, reviewer role, and public-release
  rebranding.
