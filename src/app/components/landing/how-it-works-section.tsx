"use client";

import { SectionReveal } from "./section-reveal";

const steps = [
  {
    number: "01",
    title: "Create your project",
    description:
      "Define the high-level mission, set a status, and establish the architectural foundation in seconds.",
  },
  {
    number: "02",
    title: "Add features & write docs",
    description:
      "Break your project into features. Use the Markdown editor to write specs, or record your thoughts with AI voice.",
  },
  {
    number: "03",
    title: "Track, schedule & ship",
    description:
      "Set priorities and deadlines, visualize everything on the calendar, and ship features with confidence.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <SectionReveal>
          <div className="mb-16 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Workflow
            </p>
            <h2 className="mb-3 text-3xl font-bold tracking-tight text-fg-primary md:text-4xl">
              Simple process. Structured results.
            </h2>
            <p className="text-fg-secondary">
              Three steps from idea to shipped feature.
            </p>
          </div>
        </SectionReveal>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-border-subtle md:block" />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <SectionReveal key={step.number} delay={i * 0.12}>
                <div className="relative md:pl-16">
                  {/* Dot on line */}
                  <div className="absolute left-3 top-3 hidden h-[14px] w-[14px] rounded-full border-[3px] border-canvas bg-brand md:block" />

                  <div className="rounded-xl border border-border-subtle bg-elevated p-7 transition-colors hover:bg-subtle/50">
                    <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
                      Step {step.number}
                    </span>
                    <h3 className="mb-2 text-xl font-bold text-fg-primary">
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-fg-secondary">
                      {step.description}
                    </p>
                  </div>
                </div>
              </SectionReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
