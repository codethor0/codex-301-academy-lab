import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const baseUrl = process.env.GUIDES_BASE_URL ?? "http://localhost:3000";
const categoryFilters = [
  {
    label: "Getting Started",
    path: "/guides?category=getting-started",
    ids: ["write-your-first-agents-md", "what-to-include-in-agents-md"],
  },
  {
    label: "Workflows",
    path: "/guides?category=workflows",
    ids: ["use-nested-agents-md-files", "understand-instruction-precedence"],
  },
  {
    label: "Best Practices",
    path: "/guides?category=best-practices",
    ids: ["define-validation-and-review-expectations", "keep-agents-md-useful"],
  },
];
const approvedCategories = new Set(categoryFilters.map(({ label }) => label));
const approvedIds = categoryFilters.flatMap(({ ids }) => ids);
const articleUrl = new URL("../content/guides.json", import.meta.url);
const protectedRoutes = [
  "/",
  "/about",
  "/contact",
  "/docs",
  "/resources",
  "/guides",
];

async function requestPage(pathname) {
  let response;

  try {
    response = await fetch(new URL(pathname, baseUrl), { redirect: "manual" });
  } catch (error) {
    throw new Error(
      `Start the application with "pnpm dev" before running "pnpm test:guides" (${baseUrl}).`,
      { cause: error },
    );
  }

  assert.equal(response.status, 200, `${pathname} should remain available`);

  return response.text();
}

async function readApprovedGuides() {
  return JSON.parse(await readFile(articleUrl, "utf8"));
}

test("approved articles contain complete content and stable destinations", async () => {
  const guides = await readApprovedGuides();
  const identifiers = new Set();

  assert.ok(guides.length > 0, "at least one approved article is required");

  for (const guide of guides) {
    for (const field of ["id", "title", "description", "category", "destination"]) {
      assert.equal(typeof guide[field], "string", `${field} must be a string`);
      assert.ok(guide[field].trim(), `${field} must not be empty`);
    }

    assert.ok(!identifiers.has(guide.id), `guide identifier must be unique: ${guide.id}`);
    assert.match(
      guide.id,
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      `article identifier must be a lowercase slug: ${guide.id}`,
    );
    assert.ok(approvedCategories.has(guide.category), `category must be approved: ${guide.category}`);
    assert.equal(
      guide.destination,
      `/guides/${guide.id}`,
      `article destination must match its identifier: ${guide.destination}`,
    );
    assert.ok(Array.isArray(guide.sections), `${guide.id} must contain article sections`);
    assert.ok(guide.sections.length > 0, `${guide.id} must contain at least one article section`);

    for (const section of guide.sections) {
      for (const field of ["heading", "content"]) {
        assert.equal(typeof section[field], "string", `section ${field} must be a string`);
        assert.ok(section[field].trim(), `section ${field} must not be empty`);
      }
    }

    identifiers.add(guide.id);
  }

  assert.deepEqual([...identifiers].sort(), [...approvedIds].sort());

  for (const { label, ids } of categoryFilters) {
    const categoryIds = guides.filter((guide) => guide.category === label).map((guide) => guide.id);
    assert.deepEqual(categoryIds.sort(), [...ids].sort(), `${label} should keep its approved articles`);
  }
});

test("existing Guides content and shared navigation remain available", async () => {
  const html = await requestPage("/guides");

  assert.match(html, /Guides \| AGENTS\.md/, "the Guides page title should remain available");
  assert.match(html, /How to write a good AGENTS\.md/, "the existing Guides introduction should remain");
  assert.match(html, /What to include in AGENTS\.md/, "the existing AGENTS.md guidance should remain");
  assert.match(html, /aria-label="Primary navigation"/, "shared navigation should remain available");

  for (const route of protectedRoutes) {
    assert.match(html, new RegExp(`href="${route}"`), `${route} should remain in shared navigation`);
  }
});

test("existing public routes remain available", async () => {
  await Promise.all(protectedRoutes.map(async (route) => {
    assertPrimaryNavigation(await requestPage(route), route);
  }));
});

test("the existing Resources page remains available", async () => {
  const html = await requestPage("/resources");

  assert.match(html, /Resources \| AGENTS\.md/, "the Resources page title should remain available");
  assert.match(html, /Explore practical resources/, "the existing Resources description should remain");
});

function elements(html, tag) {
  const pattern = new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)</${tag}>`, "g");
  return Array.from(html.matchAll(pattern), ([, attributes, body]) => ({ attributes, body }));
}

function attribute(element, name) {
  return element.attributes.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`))?.[1];
}

function textContent(html) {
  const entities = { "&amp;": "&", "&quot;": '"', "&#x27;": "'", "&lt;": "<", "&gt;": ">" };
  // Strip tags until none remain, so nested fragments cannot leave a tag behind.
  let text = html;
  for (let previous; previous !== text; ) {
    previous = text;
    text = text.replace(/<[^>]+>/g, "");
  }
  return text.replace(/&(?:amp|quot|#x27|lt|gt);/g, (entity) => entities[entity]).trim();
}

function pageMain(html) {
  const main = elements(html, "main");
  assert.equal(main.length, 1, "use the shared main landmark");
  return main[0].body;
}

function assertPrimaryNavigation(html, activeRoute) {
  const nav = elements(html, "nav").find((item) => attribute(item, "aria-label") === "Primary navigation");
  assert.ok(nav, `${activeRoute} should have primary navigation`);
  const links = elements(nav.body, "a");
  for (const route of protectedRoutes) {
    assert.ok(links.some((link) => attribute(link, "href") === route), `${route} should be in primary navigation on ${activeRoute}`);
  }
  const current = links.filter((link) => attribute(link, "aria-current") === "page");
  assert.deepEqual(current.map((link) => attribute(link, "href")), [activeRoute]);
}

function assertKeyboardLink(link, path) {
  assert.ok(link, `${path} should be a native link`);
  assert.doesNotMatch(attribute(link, "tabindex") ?? "", /^-/);
  assert.notEqual(attribute(link, "aria-disabled"), "true");
  assert.ok(textContent(link.body), `${path} should have a readable name`);
}

function assertCatalog(html, guides, ids, selectedPath) {
  const main = pageMain(html);
  const guideLinks = elements(main, "a").filter((link) => attribute(link, "href")?.startsWith("/guides/"));
  assert.deepEqual(
    guideLinks.map((link) => attribute(link, "href")).sort(),
    ids.map((id) => `/guides/${id}`).sort(),
    "show exactly the expected article links, once each",
  );

  for (const guide of guides.filter(({ id }) => ids.includes(id))) {
    const link = guideLinks.find((item) => attribute(item, "href") === guide.destination);
    assertKeyboardLink(link, guide.destination);
    assert.equal(textContent(link.body), guide.title);

    const card = elements(main, "li").find(({ body }) => body.includes(`href="${guide.destination}"`));
    assert.ok(card, `${guide.id} should appear in the catalog list`);
    assert.ok(textContent(card.body).includes(guide.description), `${guide.id} should show its description`);
    assert.ok(textContent(card.body).includes(guide.category), `${guide.id} should show its category`);
  }

  const filterNav = elements(main, "nav").find((nav) => attribute(nav, "aria-label"));
  assert.ok(filterNav, "category links should have a named navigation landmark");
  const filterLinks = elements(filterNav.body, "a");
  const filters = [{ path: "/guides" }, ...categoryFilters];
  assert.deepEqual(filterLinks.map((link) => attribute(link, "href")).sort(), filters.map(({ path }) => path).sort());

  for (const { label, path } of filters) {
    const link = filterLinks.find((item) => attribute(item, "href") === path);
    assertKeyboardLink(link, path);
    if (label) assert.equal(textContent(link.body), label);
    assert.equal(attribute(link, "aria-current") === "page", path === selectedPath);
  }

  const status = elements(main, "p").filter((item) => attribute(item, "role") === "status");
  const categoryLabel = categoryFilters.find(({ path }) => path === selectedPath)?.label ?? "All categories";
  assert.deepEqual(status.map(({ body }) => textContent(body)), [`${categoryLabel}. ${ids.length} guides shown.`]);
}

test("the unfiltered catalog shows all six approved articles", async () => {
  assertCatalog(await requestPage("/guides"), await readApprovedGuides(), approvedIds, "/guides");
});

for (const { label, path, ids } of categoryFilters) {
  test(`${label} has a shareable URL and shows only its approved articles`, async () => {
    assertCatalog(await requestPage(path), await readApprovedGuides(), ids, path);
  });
}

for (const id of approvedIds) {
  test(`/guides/${id} renders the complete approved article`, async () => {
    const guide = (await readApprovedGuides()).find((item) => item.id === id);
    assert.ok(guide, `${id} should exist in the approved content`);

    const html = await requestPage(guide.destination);
    const nav = elements(html, "nav").find((item) => attribute(item, "aria-label") === "Primary navigation");
    assert.ok(nav, `${id} should have primary navigation`);
    const currentLinks = elements(nav.body, "a").filter((link) => attribute(link, "aria-current"));
    assert.deepEqual(
      currentLinks.map((link) => [attribute(link, "href"), attribute(link, "aria-current")]),
      [["/guides", "true"]],
      "article pages should mark Guides as the current section",
    );

    const main = pageMain(html);
    assert.deepEqual(elements(main, "h1").map(({ body }) => textContent(body)), [guide.title]);

    const [article] = elements(main, "article");
    assert.ok(article, "provide a semantic article element");
    const sections = elements(article.body, "section").map(({ body }) => {
      const [heading] = elements(body, "h2");
      const [paragraph] = elements(body, "p");
      return { heading: textContent(heading?.body ?? ""), content: textContent(paragraph?.body ?? "") };
    });
    assert.deepEqual(sections, guide.sections);
  });
}

test("an unknown article destination returns 404", async () => {
  const response = await fetch(new URL("/guides/not-an-approved-guide", baseUrl), { redirect: "manual" });
  assert.equal(response.status, 404);
  await response.body?.cancel();
});

test("filtered Guides retains its existing links, footer, and active primary navigation", async () => {
  const html = await requestPage(categoryFilters[0].path);
  assertPrimaryNavigation(html, "/guides");

  const main = pageMain(html);
  assert.match(main, /How to write a good AGENTS\.md/);
  assert.match(main, /What to include in AGENTS\.md/);
  const mainLinks = elements(main, "a");
  for (const [path, name] of [["/docs", "Docs"], ["/resources", "Resources"], ["/", "home page"]]) {
    assert.ok(mainLinks.some((link) => attribute(link, "href") === path && textContent(link.body) === name));
  }
  assert.equal(elements(html, "footer").length, 1);
});

test("Resources retains its existing references", async () => {
  const links = elements(pageMain(await requestPage("/resources")), "a");
  assert.deepEqual(links.map((link) => attribute(link, "href")), ["/docs", "/#examples", "/#faq"]);
});
