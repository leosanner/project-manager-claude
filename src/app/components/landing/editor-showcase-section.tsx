"use client";

import { CheckCircleIcon } from "lucide-react";
import { SectionReveal } from "./section-reveal";
import { MockEditor } from "./mock-editor";

const capabilities = [
  "Full GitHub-flavored Markdown",
  "Live side-by-side preview",
  "Auto-save with dirty tracking",
  "Priority & status metadata",
];

export function EditorShowcaseSection() {
  return (
    <section id="editor" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="overflow-hidden rounded-2xl border border-border-subtle/50 bg-subtle/30 p-8 md:p-14">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-5">
            {/* Left — Copy */}
            <SectionReveal className="lg:col-span-2">
              <div className="space-y-5">
                <h2 className="text-3xl font-bold leading-tight tracking-tight text-fg-primary md:text-4xl">
                  Write with familiarity.
                </h2>
                <p className="leading-relaxed text-fg-secondary">
                  A workspace that feels like your favorite IDE — built for the
                  documentation phase of engineering. Full Markdown support with
                  live rendering.
                </p>
                <ul className="space-y-3 pt-2">
                  {capabilities.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-sm font-medium text-fg-primary"
                    >
                      <CheckCircleIcon className="h-4 w-4 shrink-0 text-brand" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </SectionReveal>

            {/* Right — Editor mock */}
            <SectionReveal delay={0.15} className="lg:col-span-3">
              <div className="h-[340px] overflow-hidden rounded-xl shadow-2xl sm:h-[380px]">
                <MockEditor />
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
