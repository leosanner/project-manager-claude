"use client";

import { motion } from "motion/react";

const BAR_COUNT = 24;

// Precompute bar configurations to avoid impure calls during render
const bars = Array.from({ length: BAR_COUNT }, (_, i) => {
  const center = BAR_COUNT / 2;
  const dist = Math.abs(i - center) / center;
  const base = 12 + (1 - dist) * 36;
  const min = base * 0.3;
  const max = base;
  const opacity = 0.3 + (1 - dist) * 0.7;
  // Deterministic pseudo-random duration variation based on index
  const duration = 1 + ((i * 7 + 3) % 10) * 0.05;
  return { min, max, opacity, duration };
});

export function MockWaveform() {
  return (
    <div className="flex h-16 items-center justify-center gap-[3px]">
      {bars.map((bar, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full bg-brand"
          style={{ opacity: bar.opacity }}
          animate={{ height: [bar.min, bar.max, bar.min] }}
          transition={{
            duration: bar.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.04,
          }}
        />
      ))}
    </div>
  );
}
