import {
  BoldIcon,
  ItalicIcon,
  HeadingIcon,
  ListIcon,
  CodeIcon,
  LinkIcon,
} from "lucide-react";

const toolbarIcons = [BoldIcon, ItalicIcon, HeadingIcon, ListIcon, CodeIcon, LinkIcon];

const markdownLines = [
  { text: "# Feature: User Auth", className: "text-brand font-bold" },
  { text: "", className: "" },
  { text: "## Acceptance Criteria", className: "text-brand/70 font-semibold" },
  { text: "", className: "" },
  { text: "- [x] JWT token implementation", className: "text-fg-secondary" },
  { text: "- [x] OAuth2 social login flow", className: "text-fg-secondary" },
  { text: "- [ ] MFA via TOTP", className: "text-fg-secondary" },
  { text: "", className: "" },
  { text: "## Overview", className: "text-brand/70 font-semibold" },
  { text: "", className: "" },
  {
    text: "This feature implements secure user",
    className: "text-fg-secondary",
  },
  {
    text: "authentication with multiple providers.",
    className: "text-fg-secondary",
  },
];

type Props = {
  compact?: boolean;
};

export function MockEditor({ compact = false }: Props) {
  const lines = compact ? markdownLines.slice(0, 7) : markdownLines;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-elevated">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border-subtle/50 bg-subtle/50 px-3 py-2">
        <div className="flex items-center gap-1">
          {toolbarIcons.map((Icon, i) => (
            <div
              key={i}
              className="flex h-7 w-7 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-muted hover:text-fg-secondary"
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-semibold text-brand">Edit</span>
          <span className="text-[10px] font-medium text-fg-muted">
            Preview
          </span>
        </div>
      </div>

      {/* Split pane */}
      <div className="flex min-h-0 flex-1 divide-x divide-border-subtle/30">
        {/* Markdown side */}
        <div className="w-1/2 overflow-hidden p-4">
          <div className="space-y-0.5 font-mono text-[11px] leading-relaxed">
            {lines.map((line, i) => (
              <p key={i} className={line.className || "text-fg-muted"}>
                {line.text || "\u00A0"}
              </p>
            ))}
          </div>
        </div>

        {/* Preview side */}
        <div className="w-1/2 overflow-hidden bg-canvas/50 p-4">
          <h3 className="mb-3 border-b border-border-subtle/30 pb-2 text-base font-bold text-fg-primary">
            Feature: User Auth
          </h3>
          <h4 className="mb-2 text-sm font-semibold text-fg-primary">
            Acceptance Criteria
          </h4>
          <ul className="mb-4 space-y-1.5 text-[11px] text-fg-secondary">
            <li className="flex items-center gap-2">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-brand bg-brand/20 text-[8px] text-brand">
                &#10003;
              </span>
              JWT token implementation
            </li>
            <li className="flex items-center gap-2">
              <span className="flex h-3.5 w-3.5 items-center justify-center rounded border border-brand bg-brand/20 text-[8px] text-brand">
                &#10003;
              </span>
              OAuth2 social login flow
            </li>
            <li className="flex items-center gap-2">
              <span className="h-3.5 w-3.5 rounded border border-border-default" />
              MFA via TOTP
            </li>
          </ul>
          {!compact && (
            <>
              <h4 className="mb-2 text-sm font-semibold text-fg-primary">
                Overview
              </h4>
              <p className="text-[11px] leading-relaxed text-fg-secondary">
                This feature implements secure user authentication with multiple
                providers.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
