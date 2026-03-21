"use client";

import {
  MicIcon,
  SparklesIcon,
  ZapIcon,
  FileOutputIcon,
  BrainCircuitIcon,
  MousePointerClickIcon,
} from "lucide-react";
import { SectionReveal } from "./section-reveal";
import { MockWaveform } from "./mock-waveform";

const stats = [
  { icon: BrainCircuitIcon, label: "AI Structured", detail: "Whisper + LangGraph" },
  { icon: ZapIcon, label: "Instant Mapping", detail: "Speech to Markdown" },
  { icon: FileOutputIcon, label: "Clean Output", detail: "Production-ready docs" },
  { icon: MousePointerClickIcon, label: "One Click", detail: "Record & generate" },
];

export function VoiceShowcaseSection() {
  return (
    <section id="voice" className="scroll-mt-20 py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Left — Recording mock */}
          <SectionReveal className="order-2 flex justify-center lg:order-1">
            <div className="relative w-full max-w-sm">
              {/* Recording card */}
              <div className="rounded-2xl border border-border-subtle bg-elevated p-7 shadow-2xl">
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-brand">
                    Recording Session
                  </span>
                  <span className="font-mono text-[10px] text-fg-muted">
                    00:14 / 01:00
                  </span>
                </div>

                <div className="mb-8">
                  <MockWaveform />
                </div>

                <div className="flex flex-col items-center gap-5">
                  <button
                    type="button"
                    className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-brand/20 bg-brand/10 text-brand ring-4 ring-brand/5 transition-transform hover:scale-105"
                    aria-label="Stop recording (decorative)"
                  >
                    <MicIcon className="h-6 w-6" />
                  </button>
                  <p className="max-w-[240px] text-center text-[11px] italic text-fg-muted">
                    &ldquo;...we need to implement the new billing gateway by
                    Friday for the beta release.&rdquo;
                  </p>
                </div>
              </div>

              {/* Floating AI card */}
              <div className="absolute -bottom-5 -right-3 z-10 animate-float rounded-lg border border-brand/30 bg-elevated/90 px-4 py-3 shadow-lg backdrop-blur-xl sm:-right-10">
                <div className="mb-2 flex items-center gap-2">
                  <SparklesIcon className="h-3.5 w-3.5 text-brand" />
                  <span className="text-[10px] font-bold text-fg-primary">
                    AI Processing...
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded bg-brand/20" />
                  <div className="h-1.5 w-5/6 rounded bg-brand/20" />
                  <div className="h-1.5 w-4/5 rounded bg-brand/20" />
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Right — Copy */}
          <SectionReveal delay={0.1} className="order-1 lg:order-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold leading-tight tracking-tight text-fg-primary md:text-4xl lg:text-5xl">
                Documentation at the speed of speech.
              </h2>
              <p className="text-lg leading-relaxed text-fg-secondary">
                Capture voice meetings or solo brainstorms and automatically
                parse them into structured project features, specs, and
                Markdown documentation.
              </p>

              <div className="grid grid-cols-2 gap-5 pt-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <stat.icon className="h-4 w-4 text-brand" />
                      <span className="text-sm font-bold text-fg-primary">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-xs text-fg-muted">{stat.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
