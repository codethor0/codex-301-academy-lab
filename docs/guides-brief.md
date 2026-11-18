# Guides publishing release brief

## Requested outcome

Publish the complete `AGENTS.md` guides prepared by the documentation team.
The approved articles explain how to create project instructions, choose useful
content, apply scoped guidance, understand Codex-specific precedence, define
review expectations, and maintain instructions over time. Expand the existing
`/guides` page with a browsable catalog, let visitors filter articles by
category, and open each guide as a complete article at its approved destination.

Visitors should be able to share a category URL that opens the same filtered
view. Keep the existing Guides introduction, practical `AGENTS.md` guidance,
internal references, shared navigation, and existing public pages intact.

## Team ownership

| Workstream | Owns | Must preserve | Verification |
| --- | --- | --- | --- |
| Documentation platform | Approved articles, categories, identifiers, destinations, and content validation | Approved article copy, stable identifiers, and the article contract | Article-content checks |
| Web experience | Catalog, article pages, category filters, and accessibility | Existing Guides content, shared navigation, and protected public routes | Feature and regression checks |
| Release owner | Integration, review, and the readiness decision | Both ownership boundaries and the approved request | Combined project checks and specialist review |

The documentation-platform team maintains the approved article source in
`content/guides.json` and scoped instructions in `content/AGENTS.md`. The web
experience team owns `pages/guides.tsx`, the future article route, shared page
layout, navigation, category filtering, semantic markup, and keyboard access.

The frontend depends on the approved article structure. Coordinate between
these owners before changing article copy, the meaning of a field, an approved
category, or a destination.

## Approved article contract

Every approved article must include:

- `id`: a unique, stable, lowercase, hyphen-separated identifier.
- `title`: a nonempty, customer-facing article title.
- `description`: a nonempty summary of the article.
- `category`: one of the approved category labels below.
- `destination`: the approved internal article path `/guides/<id>`.
- `sections`: at least one article section with a nonempty `heading` and
  `content`.

Treat `content/guides.json` as approved editorial material. Validate the
article contract without rewriting approved titles, descriptions, sections,
identifiers, categories, or destinations.

## Approved categories and shareable URLs

| Category | Shareable URL |
| --- | --- |
| Getting Started | `/guides?category=getting-started` |
| Workflows | `/guides?category=workflows` |
| Best Practices | `/guides?category=best-practices` |

The unfiltered `/guides` view should show every approved article. Opening a
category URL directly should show only the corresponding approved articles.

## Approved article destinations

- `/guides/write-your-first-agents-md`
- `/guides/what-to-include-in-agents-md`
- `/guides/use-nested-agents-md-files`
- `/guides/understand-instruction-precedence`
- `/guides/define-validation-and-review-expectations`
- `/guides/keep-agents-md-useful`

Every destination must match its article identifier. Create these article pages
through the shared `pages/guides/[slug].tsx` route; do not redirect article
cards to unrelated existing pages or external URLs.

## Protected application behavior

Preserve these existing routes and their shared navigation entries:

- `/`
- `/about`
- `/contact`
- `/docs`
- `/resources`
- `/guides`

The existing Guides headings, explanatory content, internal references,
`ContentPage` layout, page title, footer, and active navigation state must
remain available.

## Release acceptance criteria

- Every approved article appears once with its title, description, category,
  and approved destination.
- Every catalog link opens a real article page that displays its approved title
  and every approved article section.
- Article identifiers remain unique and destinations match `/guides/<id>`.
- Category controls show the correct approved articles and produce the approved
  shareable URLs.
- Guide links and category controls use semantic, keyboard-accessible elements.
- Existing Guides content, Resources content, navigation, and protected routes
  remain available.
- `pnpm lint`, `pnpm typecheck`, and `pnpm test:guides` pass.
- No new application dependencies are required.

## Prepared baseline

The existing Guides page and protected routes are working. Complete approved
articles, scoped content instructions, and baseline regression tests are
present. The article-validation module, guide cards, article pages, category
filters, expanded acceptance checks, and reusable frontend reviewer have not
yet been implemented.
