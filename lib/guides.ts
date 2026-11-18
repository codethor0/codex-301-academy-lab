import approvedGuides from "@/content/guides.json";

export const guideCategories = [
  { slug: "getting-started", label: "Getting Started" },
  { slug: "workflows", label: "Workflows" },
  { slug: "best-practices", label: "Best Practices" },
] as const;

type Category = (typeof guideCategories)[number];

type GuideSection = {
  heading: string;
  content: string;
};

export type Guide = {
  id: string;
  title: string;
  description: string;
  category: Category["label"];
  destination: string;
  sections: GuideSection[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isGuideSection(value: unknown): value is GuideSection {
  return isRecord(value) && isNonEmptyString(value.heading) && isNonEmptyString(value.content);
}

function validateGuides(guides: unknown): asserts guides is Guide[] {
  if (!Array.isArray(guides) || guides.length === 0) {
    throw new Error("Expected a nonempty list of approved guides.");
  }

  const ids = new Set<string>();

  for (const [index, guide] of guides.entries()) {
    if (!isRecord(guide) || typeof guide.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(guide.id)) {
      throw new Error(`Guide at index ${index} must have a lowercase, hyphen-separated ID.`);
    }

    const { id, title, description, category, destination, sections } = guide;
    if (ids.has(id)) {
      throw new Error(`Duplicate guide ID ${id}.`);
    }
    if (!isNonEmptyString(title) || !isNonEmptyString(description)) {
      throw new Error(`Guide ${id} must have a title and description.`);
    }
    if (!guideCategories.some(({ label }) => label === category)) {
      throw new Error(`Guide ${id} must use an approved category.`);
    }
    if (destination !== `/guides/${id}`) {
      throw new Error(`Guide ${id} must use the destination /guides/${id}.`);
    }
    if (!Array.isArray(sections) || sections.length === 0 || !sections.every(isGuideSection)) {
      throw new Error(`Guide ${id} must have sections with headings and content.`);
    }

    ids.add(id);
  }
}

export function getGuides(): Guide[] {
  const guides: unknown = approvedGuides;
  validateGuides(guides);
  return guides;
}
