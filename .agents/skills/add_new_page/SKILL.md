---
name: add-new-page
description: Add a static informational page to this Next.js Pages Router site by following repository instructions, reusing the shared ContentPage layout, updating shared navigation, and validating the result. Use for focused requests like adding Resources, Guides, or a similar first-party content page without new dependencies or unrelated changes.
---

# Add a New Page

## Purpose

Add one static informational route while preserving the site's existing routes,
shared layout, navigation behavior, and styling. Follow the completed Resources
page and navbar entry as the reference implementation.

## Suitable requests

Use this workflow when a request:

- Adds one static page under `pages/`.
- Uses the existing `components/ContentPage.tsx` layout.
- Adds one corresponding entry to the shared navigation.
- Supplies content that can be rendered with existing React, Next.js, and
  Tailwind CSS patterns.

## Exclusions

Do not use this workflow for dynamic routes, API routes, authentication,
data-backed pages, layout redesigns, dependency changes, or work spanning
separately owned systems.

## Required page inputs

Confirm these inputs before editing:

- Route path and matching `pages/<route>.tsx` filename.
- Page title and meta description.
- Final body copy, sections, and link destinations.
- Navigation label and intended position.

If a material input is missing and cannot be derived from the request or
repository conventions, ask the user before editing.

## Workflow

1. Read the applicable `AGENTS.md` files completely. Follow their development,
   validation, and scope rules.
2. Inspect `components/ContentPage.tsx`, `components/Navbar.tsx`,
   `pages/resources.tsx`, and other existing informational pages. Preserve their
   component, metadata, link, formatting, and import conventions.
3. Check `package.json` for the current scripts. Do not add or update packages.
4. Create `pages/<route>.tsx` in TypeScript. Reuse `ContentPage`, provide the
   requested title and description, and compose the supplied static content with
   existing elements and utility classes.
5. Add the route and label to the `navLinks` array in
   `components/Navbar.tsx`. Preserve all existing entries, order unless the user
   specifies otherwise, exact-path active state, responsive wrapping, focus
   styles, and dark-mode styles.
6. Review the changed-file set and remove any unrelated changes introduced by
   this workflow.
7. Run `pnpm lint` and `pnpm typecheck`. Do not fix pre-existing or out-of-scope
   failures without user direction.
8. When a development server is available, smoke-test the new route and existing
   routes. Verify the heading, document title, navigation link, active state,
   internal links, and HTTP response. Record visual or interaction checks that
   remain unverified.

## Stop conditions

Stop before making or expanding changes and ask for direction when:

- The request would remove, rename, redirect, or otherwise change an existing
  route or its established behavior.
- The page requires a new dependency or a dependency-version change.
- Completion requires unrelated cleanup, shared-layout redesign, or changes
  outside the page and navigation scope.
- The work crosses multiple owners, repositories, services, or independently
  coordinated areas.

If validation exposes existing failures outside the changed files, report them
without fixing them.

## Required output

Report:

- Every changed file and its purpose.
- The result of `pnpm lint` and `pnpm typecheck`, including existing errors.
- Smoke-test results for the new and protected routes when performed.
- Remaining regression risks.
- Anything not verified, including responsive, keyboard, dark-mode, or browser
  behavior.
