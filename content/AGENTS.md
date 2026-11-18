# Documentation content guidelines

## Ownership

The documentation-platform team owns `guides.json`, approved article copy,
categories, stable identifiers, and article destinations.

Treat the existing article content as approved editorial material. Do not
rewrite titles, descriptions, sections, or destinations to make an unrelated
frontend change easier.

Approved articles teach visitors how to adopt and maintain `AGENTS.md`,
including project instructions, scoped guidance, Codex-specific precedence,
validation expectations, and ongoing maintenance. Do not replace that content
with release notes, lab instructions, or application implementation details.

## Article contract

Every article must include:

- A unique, lowercase, hyphen-separated `id`.
- A nonempty `title` and `description`.
- One approved category: `Getting Started`, `Workflows`, or `Best Practices`.
- A `destination` matching `/guides/<id>`.
- At least one section with a nonempty `heading` and `content`.

Preserve existing identifiers and approved categories. Ask before changing the
article shape, introducing another category, or editing approved editorial copy.

## Validation

Run `pnpm test:guides` against the running development server after changes that
affect article content or its contract.

Do not add dependencies, change shared navigation, or modify unrelated frontend
files as part of a content-only task.
