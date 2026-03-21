"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { SparklesIcon, CheckCircle2Icon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MockEditor } from "./mock-editor";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-32">
      {/* Radial gradient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent-primary)_0%,transparent_60%)] opacity-[0.07]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--accent-primary)_0%,transparent_50%)] opacity-[0.04]" />

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 lg:grid-cols-2">
        {/* Left — Copy */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-7"
        >
          <motion.div variants={itemVariants}>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand/20 bg-brand/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
              <SparklesIcon className="h-3 w-3" />
              Built for Engineering Teams
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-fg-primary sm:text-5xl md:text-6xl"
          >
            Turn ideas into structured features with{" "}
            <span className="text-gradient-brand">Markdown & AI</span>.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="max-w-lg text-lg leading-relaxed text-fg-secondary"
          >
            Organize projects, write features in GitHub-style Markdown, and
            generate documentation from voice — all in one workspace.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 pt-2"
          >
            <Link
              href="/signin"
              className={buttonVariants({ size: "lg" })}
            >
              Get Started Free
            </Link>
            <a
              href="#how-it-works"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              See How It Works
            </a>
          </motion.div>
        </motion.div>

        {/* Right — Editor visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          {/* Glow behind */}
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-brand/10 blur-[80px]" />

          {/* Editor card */}
          <div className="relative h-[380px] overflow-hidden rounded-2xl border border-border-subtle/50 shadow-ember sm:h-[420px]">
            {/* Dot grid overlay */}
            <div className="pointer-events-none absolute inset-0 dot-grid opacity-[0.04]" />
            <MockEditor compact />
          </div>

          {/* Floating status card */}
          <div className="absolute -bottom-4 -right-2 z-10 animate-float rounded-xl border border-brand/20 bg-elevated/90 px-4 py-3 shadow-lg backdrop-blur-xl sm:-right-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                <CheckCircle2Icon className="h-4 w-4 text-brand" />
              </div>
              <div>
                <p className="text-xs font-semibold text-fg-primary">
                  3 features shipped
                </p>
                <p className="text-[10px] text-fg-muted">this week</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
