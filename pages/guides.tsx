import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

import ContentPage from "@/components/ContentPage";
import { getGuides, guideCategories, type Guide } from "@/lib/guides";

type GuidesPageProps = {
  guides: Omit<Guide, "sections">[];
  selectedCategory: (typeof guideCategories)[number] | null;
};

const filters = [{ slug: null, label: "All guides" }, ...guideCategories];

export const getServerSideProps = (async ({ query }) => {
  const category = guideCategories.find(({ slug }) => slug === query.category);
  const guides = getGuides()
    .filter((guide) => !category || guide.category === category.label)
    .map(({ id, title, description, category, destination }) => ({ id, title, description, category, destination }));

  return { props: { guides, selectedCategory: category ?? null } };
}) satisfies GetServerSideProps<GuidesPageProps>;

export default function GuidesPage({
  guides,
  selectedCategory,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <ContentPage
      title="Guides"
      description="Learn how to create clear, practical AGENTS.md instructions for coding agents."
    >
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
          How to write a good AGENTS.md
        </h2>
        <ul className="list-disc space-y-2 pl-6">
          <li>Describe the project structure and point to the main entrypoints.</li>
          <li>Provide exact setup, development, and validation commands.</li>
          <li>State repository-specific conventions and protected behavior.</li>
          <li>Keep instructions focused, current, and easy to verify.</li>
        </ul>
        <p>
          Read the <Link href="/docs" className="underline hover:no-underline">Docs</Link>{" "}
          for the core format and conventions, then visit the{" "}
          <Link href="/resources" className="underline hover:no-underline">Resources</Link>{" "}
          for practical references.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
          What to include in AGENTS.md
        </h2>
        <p>
          Start with a concise project overview and identify the files or
          directories that matter for the work. Explain architecture decisions
          and coding conventions when they help an agent make compatible
          changes.
        </p>
        <p>
          Document supported setup, development, and validation commands.
          Include relevant testing expectations, protected behavior, and
          situations that require clarification or approval.
        </p>
        <p>
          Keep instructions focused, place specialized guidance close to the
          code it governs, and update the file as the project evolves.
        </p>
        <p>
          Return to the <Link href="/" className="underline hover:no-underline">home page</Link>{" "}
          to explore the project examples and FAQ.
        </p>
      </section>

      <section aria-labelledby="guide-catalog-heading" className="mt-12 space-y-6">
        <h2 id="guide-catalog-heading" className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
          AGENTS.md guide catalog
        </h2>
        <nav aria-label="Guide categories">
          <ul className="flex flex-wrap gap-2">
            {filters.map(({ slug, label }) => {
              const isSelected = slug === (selectedCategory?.slug ?? null);

              return (
                <li key={slug ?? "all"}>
                  <Link
                    href={slug ? `/guides?category=${slug}` : "/guides"}
                    scroll={false}
                    aria-current={isSelected ? "page" : undefined}
                    className={`inline-block rounded-full border px-4 py-2 text-sm font-medium focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:focus-visible:ring-purple-300 dark:focus-visible:ring-offset-gray-950 ${
                      isSelected
                        ? "border-purple-700 bg-purple-700 text-white underline underline-offset-4 dark:border-purple-300 dark:bg-purple-300 dark:text-purple-950"
                        : "border-gray-300 hover:bg-purple-50 dark:border-gray-700 dark:hover:bg-purple-950"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <p role="status" className="sr-only">
          {selectedCategory?.label ?? "All categories"}. {guides.length} {guides.length === 1 ? "guide" : "guides"} shown.
        </p>

        <ul role="list" className="grid gap-4 sm:grid-cols-2">
          {guides.map(({ id, title, description, category, destination }) => (
            <li key={id} className="space-y-2 rounded-lg border border-gray-200 p-5 dark:border-gray-800">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{category}</p>
              <h3 className="text-lg font-semibold text-gray-950 dark:text-gray-100">
                <Link
                  href={destination}
                  className="rounded underline decoration-purple-500 underline-offset-4 hover:text-purple-700 focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:hover:text-purple-300 dark:focus-visible:ring-purple-300 dark:focus-visible:ring-offset-gray-950"
                >
                  {title}
                </Link>
              </h3>
              <p className="text-base">{description}</p>
            </li>
          ))}
        </ul>
      </section>
    </ContentPage>
  );
}
