import React from "react";

interface MarkdownContentProps {
  content: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const tokenRegex =
    /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**") && token.endsWith("**")) {
      parts.push(
        <strong key={match.index} className="font-medium text-black">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      parts.push(
        <code
          key={match.index}
          className="rounded bg-[#f7f6f2] border border-[#e4e4e4] px-1.5 py-0.5 font-mono text-xs text-black"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith("[") && token.includes("](")) {
      const closeBracket = token.indexOf("](");
      const label = token.slice(1, closeBracket);
      const href = token.slice(closeBracket + 2, -1);
      parts.push(
        <a
          key={match.index}
          href={href}
          className="font-medium text-[#c04900] underline decoration-[#fcb488] underline-offset-4 hover:text-black"
        >
          {label}
        </a>
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      parts.push(
        <em key={match.index} className="italic">
          {token.slice(1, -1)}
        </em>
      );
    } else {
      parts.push(token);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = content.replace(/\r\n/g, "\n").split(/\n\n+/);

  return (
    <div className="space-y-6 text-base leading-relaxed text-zinc-800">
      {blocks.map((rawBlock, index) => {
        const block = rawBlock.trim();
        if (!block) return null;

        if (block.startsWith("## ")) {
          const headingText = block.slice(3).trim();
          return (
            <h2
              key={index}
              id={slugifyHeading(headingText)}
              className="font-heading pt-4 text-xl font-medium text-black sm:text-2xl"
            >
              {headingText}
            </h2>
          );
        }

        if (block.startsWith("### ")) {
          const headingText = block.slice(4).trim();
          return (
            <h3
              key={index}
              id={slugifyHeading(headingText)}
              className="font-heading pt-2 text-lg font-medium text-black"
            >
              {headingText}
            </h3>
          );
        }

        if (block.startsWith("> ")) {
          const quoteLines = block
            .split("\n")
            .map((line) => line.replace(/^>\s?/, "").trim())
            .join(" ");
          return (
            <blockquote
              key={index}
              className="rounded-r-xl border-l-4 border-[#ff6e14] bg-[#f7f6f2] px-5 py-4 text-sm sm:text-base text-zinc-900"
            >
              {renderInline(quoteLines)}
            </blockquote>
          );
        }

        const lines = block.split("\n").map((l) => l.trim());
        if (lines.every((l) => l.startsWith("- ") || l.startsWith("* "))) {
          return (
            <ul
              key={index}
              className="list-disc space-y-2.5 pl-6 text-zinc-800 marker:text-[#ff6e14]"
            >
              {lines.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInline(item.slice(2).trim())}
                </li>
              ))}
            </ul>
          );
        }

        if (lines.every((l) => /^\d+\.\s/.test(l))) {
          return (
            <ol
              key={index}
              className="list-decimal space-y-2.5 pl-6 text-zinc-800 marker:font-mono marker:font-medium marker:text-[#c04900]"
            >
              {lines.map((item, i) => (
                <li key={i} className="leading-relaxed">
                  {renderInline(item.replace(/^\d+\.\s/, "").trim())}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={index} className="leading-relaxed text-zinc-800">
            {renderInline(block.replace(/\n/g, " "))}
          </p>
        );
      })}
    </div>
  );
}
