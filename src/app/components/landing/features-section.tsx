"use client";

import { motion } from "motion/react";
import {
  FolderKanbanIcon,
  LayersIcon,
  FileTextIcon,
  CalendarDaysIcon,
} from "lucide-react";
import { SectionReveal } from "./section-reveal";

const features = [
  {
    icon: FolderKanbanIcon,
    title: "Create Projects",
    description:
      "Establish a clear structure for your initiatives with hierarchical project organization and status tracking.",
  },
  {
    icon: LayersIcon,
    title: "Organize Features",
    description:
      "Break down complex projects into trackable features with priorities, deadlines, and progress indicators.",
  },
  {
    icon: FileTextIcon,
    title: "Markdown Editor",
    description:
      "A familiar, high-performance editor with live preview — designed for technical requirements and documentation.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Calendar View",
    description:
      "Visualize deadlines on an interactive monthly calendar with priority-colored chips and smart navigation.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="mb-14 text-center">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-brand">
              Core Capabilities
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-fg-primary md:text-4xl">
              Everything you need to ship
            </h2>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <SectionReveal key={feature.title} delay={i * 0.08}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group rounded-xl border border-border-subtle bg-elevated p-7 transition-colors hover:border-brand/40"
              >
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-subtle transition-colors group-hover:bg-brand/10">
                  <feature.icon className="h-5 w-5 text-fg-muted transition-colors group-hover:text-brand" />
                </div>
                <h3 className="mb-2 text-base font-bold text-fg-primary">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-fg-secondary">
                  {feature.description}
                </p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
