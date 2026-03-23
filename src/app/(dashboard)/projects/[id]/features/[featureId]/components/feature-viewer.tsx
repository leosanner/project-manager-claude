"use client";

import { useState, useMemo, useCallback, type ComponentProps } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { EyeIcon, FileTextIcon } from "lucide-react";
import { toggleCheckboxAction } from "../../../actions";

/**
 * Toggle the Nth checkbox in a markdown string.
 * Skips checkboxes inside fenced code blocks.
 */
function toggleCheckbox(markdown: string, targetIndex: number): string {
  let index = 0;
  let inCodeBlock = false;

  return markdown
    .split("\n")
    .map((line) => {
      if (line.trimStart().startsWith("```")) {
        inCodeBlock = !inCodeBlock;
        return line;
      }
      if (inCodeBlock) return line;

      return line.replace(
        /^(\s*- \[)([ x])(\].*)$/,
        (match, prefix, check, suffix) => {
          if (index === targetIndex) {
            index++;
            return `${prefix}${check === "x" ? " " : "x"}${suffix}`;
          }
          index++;
          return match;
        }
      );
    })
    .join("\n");
}

export function FeatureViewer({
  featureId,
  projectId,
  initialContent,
}: {
  featureId: string;
  projectId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);

  const handleCheckboxToggle = useCallback(
    (index: number) => {
      const updated = toggleCheckbox(content, index);
      setContent(updated);
      toggleCheckboxAction(featureId, projectId, updated);
    },
    [content, featureId, projectId]
  );

  const components: ComponentProps<typeof ReactMarkdown>["components"] =
    useMemo(() => {
      let checkboxIndex = 0;
      return {
        input: (props: React.ComponentProps<"input">) => {
          if (props.type !== "checkbox") {
            return <input {...props} />;
          }
          const index = checkboxIndex++;
          const checked = props.checked ?? false;

          return (
            <input
              type="checkbox"
              checked={checked}
              onChange={() => handleCheckboxToggle(index)}
              className="mr-1.5 h-4 w-4 appearance-none rounded border-2 border-border-default bg-background transition-all duration-150 checked:border-brand checked:bg-brand relative
                before:absolute before:inset-0 before:flex before:items-center before:justify-center
                checked:before:content-['✓'] before:text-[11px] before:font-bold before:text-white before:leading-none before:pt-px before:pl-[1px]
                hover:border-brand/60 hover:shadow-[0_0_0_3px] hover:shadow-brand/10"
            />
          );
        },
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [content, handleCheckboxToggle]);

  if (!content) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle/50 bg-background shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <div className="flex shrink-0 items-center justify-between border-b border-border-subtle/30 bg-subtle/30 px-4 py-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-fg-primary">Document</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-brand/8 px-2 py-0.5 text-[10px] font-medium text-brand">
              <EyeIcon className="h-2.5 w-2.5" />
              View
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-fg-muted">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-subtle">
            <FileTextIcon className="h-6 w-6 text-fg-muted/60" />
          </div>
          <p className="text-sm">No content yet</p>
          <p className="text-xs text-fg-muted/70">
            Switch to Edit mode to start writing
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle/50 bg-background shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
      {/* Toolbar — mirrors the editor toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle/30 bg-subtle/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-fg-primary">Document</h2>
          <span className="inline-flex items-center gap-1 rounded-full bg-brand/8 px-2 py-0.5 text-[10px] font-medium text-brand">
            <EyeIcon className="h-2.5 w-2.5" />
            View
          </span>
        </div>
      </div>

      {/* Markdown content — scrollable */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <article className="prose prose-neutral dark:prose-invert mx-auto max-w-none px-8 py-6 prose-headings:text-fg-primary prose-p:text-fg-secondary prose-strong:text-fg-primary prose-a:text-brand hover:prose-a:text-brand-hover prose-code:text-brand prose-code:bg-brand/8 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-subtle prose-pre:border prose-pre:border-border-subtle/50 prose-blockquote:border-brand/40 prose-hr:border-border-subtle prose-th:text-fg-primary prose-li:text-fg-secondary">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={components}
          >
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}
