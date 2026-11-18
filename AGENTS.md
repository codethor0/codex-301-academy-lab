# AGENTS Guidelines for This Repository

## Project summary

This repository is a Next.js Pages Router site used for Codex collaboration
exercises. Prefer small, reviewable diffs and fast iteration through the development
server so changes are easy to inspect and verify.

## Key entrypoints

- `pages/index.tsx` composes the home page and supplies its static props.
- `pages/_app.tsx` applies global application setup, metadata, and navigation.
- `components/` contains the reusable sections and UI elements used by the pages.
- `styles/globals.css` contains global styles, theme variables, fonts, and shared
  animations.

Prefer TypeScript (`.tsx` and `.ts`) for new components and utilities. Co-locate
component-specific styles with their component when practical.

## Development workflow

1. If the existing dependencies are missing, install them from the lockfile:

   ```bash
   pnpm install --frozen-lockfile
   ```

2. Start the Next.js development server with hot reload:

   ```bash
   pnpm dev
   ```

Use the development server for iterative changes and restart it when dependencies
change.

## Validation workflow

Run both repository checks before considering a change complete:

```bash
pnpm lint
pnpm typecheck
```

When changing the Guides experience or shared components, start the development
server and run the feature and regression checks (`pnpm test:guides` runs only
the original Guides checks):

```bash
pnpm test
```

## Frontend review

- Run `frontend_reviewer` from a read-only Codex session. The agent inherits
  the session's sandbox and approval settings.
- Check correctness, keyboard access and focus, semantic markup, safe content
  rendering, acceptance coverage, and regressions in shared navigation and
  protected routes. Report actionable findings with file and line references.

## Guardrails

- Use `pnpm dev` for iterative work and preserve hot module replacement.
- Do not run `pnpm build` during interactive work; production assets in `.next` can
  disrupt the active development server and hot reload.
- Keep diffs scoped to the requested task and avoid unrelated cleanup.
- If dependencies change, update `pnpm-lock.yaml` alongside `package.json` and restart
  the development server.

## Definition of done

- `pnpm lint` passes.
- `pnpm typecheck` passes.
- `pnpm test` passes when the Guides experience or shared components change.
- Manual smoke checks are completed and documented, including the pages or flows
  checked and their results.
- A concise PR summary and test plan are ready for review.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
