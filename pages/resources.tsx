import Link from "next/link";

import ContentPage from "@/components/ContentPage";

export default function ResourcesPage() {
  return (
    <ContentPage
      title="Resources"
      description="Explore practical resources for adopting and maintaining AGENTS.md."
    >
      <p>
        Start with the <Link href="/docs" className="underline hover:no-underline">Docs</Link>{" "}
        for the core format, placement guidance, and conventions for writing
        useful project instructions.
      </p>
      <p>
        Review the <Link href="/#examples" className="underline hover:no-underline">examples</Link>{" "}
        to see how open-source projects document setup commands, validation
        steps, code conventions, and repository-specific guardrails.
      </p>
      <p>
        Use the <Link href="/#faq" className="underline hover:no-underline">FAQ</Link>{" "}
        for common questions, and keep each AGENTS.md file current, concrete,
        and close to the code it governs.
      </p>
    </ContentPage>
  );
}
