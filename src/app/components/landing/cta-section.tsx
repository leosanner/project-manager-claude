"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { SectionReveal } from "./section-reveal";

export function CtaSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl border border-border-subtle bg-elevated p-12 text-center md:p-20">
            {/* Glow corners */}
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/15 blur-[100px]" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-brand/10 blur-[100px]" />

            <div className="relative z-10 mx-auto max-w-xl space-y-8">
              <h2 className="text-3xl font-bold tracking-tight text-fg-primary md:text-5xl">
                Ready to ship faster?
              </h2>
              <p className="text-lg text-fg-secondary">
                Start organizing your projects, writing features, and generating
                documentation — all in one place.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/signin"
                  className={buttonVariants({ size: "lg" })}
                >
                  Get Started Free
                </Link>
                <a
                  href="#features"
                  className={buttonVariants({ variant: "outline", size: "lg" })}
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
