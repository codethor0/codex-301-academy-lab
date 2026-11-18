import React, { useEffect, useMemo, useRef, useState } from "react";
import Section from "@/components/Section";

type AgentEntry = {
  name: string;
  url: string;
  from?: string;
};

const agents: AgentEntry[] = [
  {
    name: "Codex",
    url: "https://openai.com/codex/",
    from: "OpenAI",
  },
  {
    name: "Amp",
    url: "https://ampcode.com",
  },
  {
    name: "Jules",
    url: "https://jules.google",
    from: "Google",
  },
  {
    name: "Cursor",
    url: "https://cursor.com",
  },
  {
    name: "Factory",
    url: "https://factory.ai",
  },
  {
    name: "RooCode",
    url: "https://roocode.com",
  },
  {
    name: "Aider",
    url: "https://aider.chat/docs/usage/conventions.html#always-load-conventions",
  },
  {
    name: "Gemini CLI",
    url: "https://geminicli.com/",
    from: "Google",
  },
  {
    name: "goose",
    url: "https://block.xyz/",
  },
  {
    name: "Kilo Code",
    url: "https://kilocode.ai/",
  },
  {
    name: "opencode",
    url: "https://opencode.ai/docs/rules/",
  },
  {
    name: "Phoenix",
    url: "https://phoenix.new/",
  },
  {
    name: "Zed",
    url: "https://zed.dev/docs/ai/rules",
  },
  {
    name: "Semgrep",
    url: "https://semgrep.dev",
  },
  {
    name: "Warp",
    url: "https://docs.warp.dev/knowledge-and-collaboration/rules#project-scoped-rules-1",
  },
  {
    name: "Coding agent",
    from: "GitHub Copilot",
    url: "https://code.visualstudio.com/docs/copilot",
  },
  {
    name: "VS Code",
    url: "https://code.visualstudio.com/docs/editor/artificial-intelligence",
  },
  {
    name: "Ona",
    url: "https://ona.com",
  },
  {
    name: "Devin",
    from: "Cognition",
    url: "https://devin.ai",
  },
  {
    name: "Windsurf",
    from: "Cognition",
    url: "https://windsurf.com",
  },
  {
    name: "Autopilot & Coded Agents",
    from: "UiPath",
    url: "https://www.uipath.com/",
  },
  {
    name: "Augment Code",
    url: "https://docs.augmentcode.com/cli/overview",
  },
  {
    name: "Junie",
    from: "JetBrains",
    url: "https://jetbrains.com/junie",
  },
];

const shuffleAgents = (items: AgentEntry[]) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

type LogoItemProps = AgentEntry & {
  variant?: "marquee" | "grid";
};

function LogoItem({
  name,
  url,
  from,
  variant = "marquee",
}: LogoItemProps) {
  const baseClasses =
    variant === "grid"
      ? "flex h-full w-full min-w-0 items-center"
      : "flex h-20 min-w-[240px] items-center pr-10";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
    >
      <div className="flex flex-col justify-center text-left">
        <span className="text-xl font-semibold leading-tight text-gray-700 dark:text-gray-300">
          {name}
        </span>
        {from ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <span className="font-light">from</span>{" "}
            <span className="font-semibold">{from}</span>
          </span>
        ) : null}
      </div>
    </a>
  );
}

function LogoMarqueeRow({
  agents,
  isActive,
  duration,
  offset,
}: {
  agents: AgentEntry[];
  isActive: boolean;
  duration: number;
  offset?: number;
}) {
  if (agents.length === 0) {
    return null;
  }

  const trackStyle = {
    animationPlayState: isActive ? "running" : "paused",
    animationDelay: offset ? `${offset}s` : undefined,
    "--marquee-duration": `${duration}s`,
  } as React.CSSProperties;

  return (
    <div className="w-full overflow-hidden">
      <div
        className="logo-marquee-track flex items-center py-3"
        style={trackStyle}
      >
        <div className="flex items-center gap-8 pr-8">
          {agents.map((agent) => (
            <LogoItem key={agent.name} {...agent} />
          ))}
        </div>
        {/* The second copy only makes the scroll loop seamless. It is hidden
            from assistive technology and removed from the tab order. */}
        <div
          className="logo-marquee-copy flex items-center gap-8 pr-8"
          aria-hidden="true"
          inert
        >
          {agents.map((agent) => (
            <LogoItem key={agent.name} {...agent} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CompatibilitySection() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [shuffledAgents, setShuffledAgents] = useState<AgentEntry[]>(agents);
  const [showGrid, setShowGrid] = useState(false);

  useEffect(() => {
    const animationFrame = window.requestAnimationFrame(() => {
      setShuffledAgents(shuffleAgents(agents));
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (showGrid) {
      return;
    }

    const node = containerRef.current;
    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting && entry.intersectionRatio > 0);
      },
      {
        threshold: 0,
      }
    );

    observer.observe(node);

    const animationFrame = window.requestAnimationFrame(() => {
      const rect = node.getBoundingClientRect();
      const isVisible =
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.left <= window.innerWidth &&
        rect.top <= window.innerHeight;
      setIsInView(isVisible);
    });

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [showGrid]);

  const [topRow, bottomRow] = useMemo(() => {
    const first: AgentEntry[] = [];
    const second: AgentEntry[] = [];

    shuffledAgents.forEach((agent, index) => {
      if (index % 2 === 0) {
        first.push(agent);
      } else {
        second.push(agent);
      }
    });

    return [first, second];
  }, [shuffledAgents]);

  return (
    <Section
      id="compatibility"
      title="One AGENTS.md works across many agents"
      className={`py-12 px-0 ${showGrid ? "" : "!px-0"}`}
      center
      maxWidthClass={showGrid ? "max-w-3xl" : "max-w-none"}
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xl font-light text-gray-500 dark:text-gray-400 px-8">
          Your agent definitions are compatible with a growing ecosystem of AI
          coding agents and tools:
        </p>
      </div>
      {showGrid ? (
        <div
          id="supported-agents"
          className="mt-6 grid w-full grid-cols-2 gap-8 md:grid-cols-3"
        >
          {agents.map((agent) => (
            <LogoItem key={agent.name} {...agent} variant="grid" />
          ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="mt-6 flex w-full flex-col gap-6"
          id="supported-agents"
        >
          <LogoMarqueeRow agents={topRow} isActive={isInView} duration={70} />
          <LogoMarqueeRow
            agents={bottomRow}
            isActive={isInView}
            duration={80}
            offset={-35}
          />
        </div>
      )}
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setShowGrid((prev) => !prev)}
          className="mt-4 text-base font-medium underline hover:no-underline cursor-pointer"
          aria-controls="supported-agents"
          aria-expanded={showGrid}
        >
          {showGrid ? "Collapse supported agents" : "View all supported agents"}
        </button>
      </div>
    </Section>
  );
}
