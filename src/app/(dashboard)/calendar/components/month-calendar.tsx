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

const STATUS_STYLES: Record<CalendarFeature["status"], string> = {
  PLANNED: "bg-muted text-fg-muted",
  IN_PROGRESS: "bg-brand/10 text-brand",
  DONE: "bg-success/10 text-success",
  CANCELLED: "bg-danger/10 text-danger",
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

    // Trailing days to fill 6 rows
    while (days.length < 42) {
      const next = days.length - startOffset - lastDay.getDate() + 1;
      days.push(new Date(year, month + 1, next));
    }

    return days;
  }, [currentMonth]);

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
    <div className="rounded-2xl border border-border-subtle bg-elevated shadow-card">
      {/* Navigation */}
      <div className="flex items-center justify-between border-b border-border-subtle px-5 py-4">
        <h2 className="text-lg font-semibold">{monthLabel}</h2>
        <div className="flex items-center gap-1.5">
          <button
            onClick={goToToday}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
          >
            Today
          </button>
          <button
            onClick={goToPrevMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
            aria-label="Previous month"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={goToNextMonth}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
            aria-label="Next month"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-border-subtle">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="px-2 py-2.5 text-center text-xs font-medium text-fg-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((day, i) => {
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isToday = isSameDay(day, today);
          const key = dateKey(day);
          const dayFeatures = featuresByDate.get(key) ?? [];
          const overflow = dayFeatures.length - MAX_VISIBLE_CHIPS;

          return (
            <div
              key={i}
              className={`min-h-[100px] border-b border-r border-border-subtle p-1.5 ${
                i % 7 === 0 ? "" : ""
              } ${!isCurrentMonth ? "bg-subtle/50" : ""}`}
            >
              {/* Day number */}
              <div className="mb-1 flex items-center justify-end">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    isToday
                      ? "bg-brand text-white"
                      : isCurrentMonth
                        ? "text-fg-primary"
                        : "text-fg-muted"
                  }`}
                >
                  {day.getDate()}
                </span>
              </div>

              {/* Feature chips */}
              <div className="flex flex-col gap-0.5">
                {dayFeatures.slice(0, MAX_VISIBLE_CHIPS).map((f) => (
                  <Link
                    key={f.id}
                    href={`/projects/${f.projectId}/features/${f.id}`}
                    className={`block truncate rounded-md px-1.5 py-0.5 text-[11px] font-medium leading-tight transition-opacity hover:opacity-80 ${STATUS_STYLES[f.status]}`}
                    title={`${f.title} — ${f.projectName}`}
                  >
                    {f.title}
                  </Link>
                ))}
                {overflow > 0 && (
                  <span className="px-1.5 text-[10px] font-medium text-fg-muted">
                    +{overflow} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state legend */}
      {features.length > 0 && (
        <div className="flex flex-wrap items-center gap-4 border-t border-border-subtle px-5 py-3">
          {(
            [
              ["PLANNED", "Planned"],
              ["IN_PROGRESS", "In Progress"],
              ["DONE", "Done"],
              ["CANCELLED", "Cancelled"],
            ] as const
          ).map(([status, label]) => (
            <div key={status} className="flex items-center gap-1.5">
              <span
                className={`inline-block h-2.5 w-2.5 rounded-sm ${STATUS_STYLES[status]}`}
              />
              <span className="text-xs text-fg-muted">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
