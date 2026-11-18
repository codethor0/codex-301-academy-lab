import assert from "node:assert/strict";
import test from "node:test";

const baseUrl = process.env.GUIDES_BASE_URL ?? "http://localhost:3000";
const voidElements = new Set(["area", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

async function requestHome() {
  let response;

  try {
    response = await fetch(new URL("/", baseUrl), { redirect: "manual" });
  } catch (error) {
    throw new Error(
      `Start the application with "pnpm dev" before running the tests (${baseUrl}).`,
      { cause: error },
    );
  }

  assert.equal(response.status, 200, "/ should remain available");

  return response.text();
}

// Returns each link inside the element with the given id, with whether an
// ancestor hides it from assistive technology and whether an ancestor is inert.
function linksInside(html, id) {
  const tagPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  const stack = [];
  const links = [];
  let depthOfTarget = -1;

  for (const [, closing, rawName, attributes, selfClosing] of html.matchAll(tagPattern)) {
    const name = rawName.toLowerCase();

    if (closing) {
      while (stack.length > 0) {
        const element = stack.pop();
        if (element.name === name) {
          break;
        }
      }
      if (depthOfTarget >= 0 && stack.length <= depthOfTarget) {
        break;
      }
      continue;
    }

    const parent = stack.at(-1);
    const element = {
      name,
      hidden: Boolean(parent?.hidden) || /\saria-hidden="true"/.test(attributes),
      inert: Boolean(parent?.inert) || /\sinert(?:=""|\s|$)/.test(attributes),
    };

    if (depthOfTarget < 0 && new RegExp(`\\sid="${id}"`).test(attributes)) {
      depthOfTarget = stack.length;
    }

    if (depthOfTarget >= 0 && name === "a") {
      links.push({
        href: attributes.match(/\shref="([^"]*)"/)?.[1],
        hidden: element.hidden,
        inert: element.inert,
      });
    }

    if (!selfClosing && !voidElements.has(name)) {
      stack.push(element);
    }
  }

  assert.ok(depthOfTarget >= 0, `the page should contain #${id}`);

  return links;
}

test("the collapsed compatibility list exposes each tool link once", async () => {
  const links = linksInside(await requestHome(), "supported-agents");
  const exposed = links.filter((link) => !link.hidden);
  const hidden = links.filter((link) => link.hidden);
  const uniqueTools = new Set(links.map((link) => link.href));

  assert.ok(uniqueTools.size > 0, "the compatibility list should name supported tools");
  assert.equal(
    exposed.length,
    uniqueTools.size,
    "keyboard and screen-reader users should reach each tool link exactly once",
  );
  assert.deepEqual(
    new Set(exposed.map((link) => link.href)),
    uniqueTools,
    "every supported tool should remain available to assistive technology",
  );

  for (const link of hidden) {
    assert.ok(link.inert, `the decorative duplicate of ${link.href} should not be focusable`);
  }
});
