import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

import ContentPage from "@/components/ContentPage";
import { getGuides, type Guide } from "@/lib/guides";

export const getStaticPaths = (() => ({
  paths: getGuides().map(({ id }) => ({ params: { slug: id } })),
  fallback: false,
})) satisfies GetStaticPaths;

export const getStaticProps = (({ params }) => {
  const guide = getGuides().find(({ id }) => id === params?.slug);
  return guide ? { props: { guide } } : { notFound: true };
}) satisfies GetStaticProps<{ guide: Guide }, { slug: string }>;

export default function GuideArticlePage({ guide }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <ContentPage title={guide.title} description={guide.description}>
      <Link
        href="/guides"
        className="rounded text-base underline decoration-purple-500 underline-offset-4 hover:text-purple-700 focus-visible:ring-2 focus-visible:ring-purple-600 focus-visible:ring-offset-2 dark:hover:text-purple-300 dark:focus-visible:ring-purple-300 dark:focus-visible:ring-offset-gray-950"
      >
        Back to guides
      </Link>
      <article className="space-y-8">
        <p>{guide.description}</p>
        {guide.sections.map(({ heading, content }, index) => (
          <section key={index} className="space-y-3">
            <h2 className="text-2xl font-semibold tracking-tight text-gray-950 dark:text-gray-100">
              {heading}
            </h2>
            <p>{content}</p>
          </section>
        ))}
      </article>
    </ContentPage>
  );
}
