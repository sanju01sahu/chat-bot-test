"use client";

import { useCallback, useMemo, useState, type ReactNode } from "react";

type SummaryVariant = "visit" | "call" | null;

export default function SummaryCard({
  content,
  variant,
}: {
  content: string;
  variant?: SummaryVariant;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // noop
    }
  }, [content]);

  const rendered = useMemo(() => parseSummaryToElements(content), [content]);

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950/60 shadow-[0_0_0_1px_rgba(255,255,255,0.02)_inset]">
      <div className="flex items-center justify-between gap-3 border-b border-neutral-800 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
          <span className="text-sm font-medium text-neutral-200">
            Generated Summary
          </span>
          {variant && (
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-xs text-neutral-400">
              {variant === "visit"
                ? "Visit"
                : variant === "call"
                ? "Call"
                : "Summary"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md border border-neutral-800 bg-neutral-900 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-white"
          >
            {copied ? (
              <>
                <CheckIcon /> Copied
              </>
            ) : (
              <>
                <CopyIcon /> Copy
              </>
            )}
          </button>
        </div>
      </div>
      <div className="prose-sm prose-invert max-w-none space-y-4 px-4 py-4">
        {rendered}
      </div>
    </div>
  );
}

function parseSummaryToElements(text: string): ReactNode[] {
  const elements: ReactNode[] = [];
  const lines = text.split(/\r?\n/);

  let listBuffer: string[] | null = null;

  const flushList = () => {
    if (listBuffer && listBuffer.length > 0) {
      elements.push(
        <ul
          key={`list-${elements.length}`}
          className="list-disc space-y-1 pl-6 text-neutral-200"
        >
          {listBuffer.map((item, idx) => (
            <li key={idx}>{renderInline(item)}</li>
          ))}
        </ul>
      );
    }
    listBuffer = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // Empty line → paragraph break
    if (line.trim().length === 0) {
      flushList();
      continue;
    }

    // Heading like **Activity Summary:**
    const headingMatch = line.match(/^\*\*([^*]+)\*\*:?\s*$/);
    if (headingMatch) {
      flushList();
      const title = headingMatch[1];
      elements.push(
        <h3
          key={`h-${elements.length}`}
          className="text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          {title}
        </h3>
      );
      continue;
    }

    // Bullet lines starting with - or *
    const bulletMatch = line.match(/^[-*]\s+(.*)$/);
    if (bulletMatch) {
      if (!listBuffer) listBuffer = [];
      listBuffer.push(bulletMatch[1]);
      continue;
    }

    // Default paragraph
    flushList();
    elements.push(
      <p
        key={`p-${elements.length}`}
        className="leading-relaxed text-neutral-200"
      >
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  return elements;
}

function renderInline(text: string): (string | ReactNode)[] {
  // Bold **text**
  const parts: (string | ReactNode)[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [full, bold] = match;
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={`${match.index}-${full}`} className="text-neutral-100">
        {bold}
      </strong>
    );
    lastIndex = match.index + full.length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

function CopyIcon() {
  return (
    <svg
      className="h-4 w-4 text-neutral-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 text-emerald-400"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
    </svg>
  );
}
