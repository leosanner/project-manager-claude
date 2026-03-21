"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import type { CalendarFeature } from "@/types/feature";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MAX_VISIBLE_CHIPS = 3;

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const PRIORITY_STYLES: Record<
  CalendarFeature["priority"],
  { chip: string; border: string; dot: string; text: string; label: string }
> = {
  LOW: {
    chip: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "Low",
  },
  MEDIUM: {
    chip: "bg-amber-400/10",
    border: "border-amber-400/20",
    dot: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    label: "Medium",
  },
  HIGH: {
    chip: "bg-orange-500/10",
    border: "border-orange-500/20",
    dot: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    label: "High",
  },
  CRITICAL: {
    chip: "bg-red-500/10",
    border: "border-red-500/20",
    dot: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    label: "Critical",
  },
};

type Props = {
  features: CalendarFeature[];
};

export function MonthCalendar({ features }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = useMemo(() => new Date(), []);

  const featuresByDate = useMemo(() => {
    const map = new Map<string, CalendarFeature[]>();
    for (const f of features) {
      const d = new Date(f.dueDate);
      const key = dateKey(d);
      const existing = map.get(key);
      if (existing) {
        existing.push(f);
      } else {
        map.set(key, [f]);
      }
    }
    return map;
  }, [features]);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startOffset = firstDay.getDay();
    const days: Date[] = [];

    // Leading days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      days.push(new Date(year, month, -i));
    }

    // Current month days
    for (let d = 1; d <= lastDay.getDate(); d++) {
      days.push(new Date(year, month, d));
    }

    // Trailing days to fill remaining row(s)
    const targetLength = days.length <= 35 ? 35 : 42;
    while (days.length < targetLength) {
      const next = days.length - startOffset - lastDay.getDate() + 1;
      days.push(new Date(year, month + 1, next));
    }

    return days;
  }, [currentMonth]);

  const totalRows = calendarDays.length / 7;

  function goToPrevMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setCurrentMonth(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }

  function goToToday() {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }

  const monthLabel = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Header / Navigation */}
      <div className="mb-3 flex shrink-0 items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{monthLabel}</h2>
        <div className="flex items-center gap-0.5 rounded-lg border border-border-subtle bg-elevated p-1">
          <button
            onClick={goToPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={goToToday}
            className="px-4 py-1 text-[11px] font-bold uppercase tracking-widest text-fg-secondary transition-colors hover:text-brand"
          >
            Today
          </button>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-md text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle/50 bg-background shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        {/* Day headers */}
        <div className="grid shrink-0 grid-cols-7 border-b border-border-subtle/30 bg-subtle/50">
          {DAYS_OF_WEEK.map((day) => (
            <div
              key={day}
              className="px-2 py-2.5 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-fg-muted"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className={`grid min-h-0 flex-1 grid-cols-7 ${totalRows === 5 ? "grid-rows-5" : "grid-rows-6"}`}>
          {calendarDays.map((day, i) => {
            const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
            const isToday = isSameDay(day, today);
            const key = dateKey(day);
            const dayFeatures = featuresByDate.get(key) ?? [];
            const overflow = dayFeatures.length - MAX_VISIBLE_CHIPS;
            const isLastRow = i >= (totalRows - 1) * 7;

            return (
              <div
                key={i}
                className={`group relative overflow-hidden p-1.5 transition-colors ${
                  i % 7 !== 6 ? "border-r border-border-subtle/15" : ""
                } ${!isLastRow ? "border-b border-border-subtle/15" : ""} ${
                  !isCurrentMonth
                    ? "opacity-30"
                    : "hover:bg-subtle/50"
                } ${isToday ? "bg-brand/5" : ""}`}
              >
                {/* Today bottom accent bar */}
                {isToday && (
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-brand" />
                )}

                {/* Day number */}
                <div className="mb-1 text-right text-xs">
                  <span
                    className={`${
                      isToday
                        ? "font-bold text-brand"
                        : isCurrentMonth
                          ? "text-fg-primary"
                          : "text-fg-muted"
                    }`}
                  >
                    {day.getDate()}
                  </span>
                </div>

                {/* Feature chips */}
                <div className="flex flex-col gap-1">
                  {dayFeatures.slice(0, MAX_VISIBLE_CHIPS).map((f) => {
                    const style = PRIORITY_STYLES[f.priority];
                    return (
                      <Link
                        key={f.id}
                        href={`/projects/${f.projectId}/features/${f.id}`}
                        className={`flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-opacity hover:opacity-80 ${style.chip} ${style.border} ${style.text}`}
                        title={`${f.title} — ${f.projectName} (${style.label})`}
                      >
                        <span
                          className={`inline-block h-1 w-1 shrink-0 rounded-full ${style.dot}`}
                        />
                        <span className="truncate">{f.title}</span>
                      </Link>
                    );
                  })}
                  {overflow > 0 && (
                    <span className="px-2 text-[10px] font-medium text-fg-muted">
                      +{overflow} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="mt-3 flex shrink-0 items-center justify-between border-t border-border-subtle/30 pt-3">
        <div className="flex items-center gap-6">
          {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((priority) => (
            <div key={priority} className="flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${PRIORITY_STYLES[priority].dot}`}
              />
              <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">
                {PRIORITY_STYLES[priority].label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
