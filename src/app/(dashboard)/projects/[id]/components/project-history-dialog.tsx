"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  HistoryIcon,
  PlusCircleIcon,
  CheckCircle2Icon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { deleteHistoryEventAction } from "../actions";

type HistoryEvent = {
  id: string;
  eventType: string;
  featureTitle: string;
  createdAt: string;
};

const PAGE_SIZE = 10;

const EVENT_CONFIG = {
  FEATURE_CREATED: {
    icon: PlusCircleIcon,
    iconColor: "text-sky-500",
    iconBg: "bg-sky-500/10",
    iconBorder: "border-sky-500/30",
    pillBg: "bg-sky-500/10",
    pillText: "text-sky-600 dark:text-sky-400",
    leftBorder: "border-l-sky-500/50",
    rowHover: "hover:bg-sky-500/[0.03]",
    label: "Created",
    titleColor: "text-fg-primary",
    strikethrough: false,
  },
  FEATURE_CONCLUDED: {
    icon: CheckCircle2Icon,
    iconColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    iconBorder: "border-emerald-500/30",
    pillBg: "bg-emerald-500/10",
    pillText: "text-emerald-600 dark:text-emerald-400",
    leftBorder: "border-l-emerald-500/50",
    rowHover: "hover:bg-emerald-500/[0.03]",
    label: "Completed",
    titleColor: "text-fg-primary",
    strikethrough: false,
  },
  FEATURE_DELETED: {
    icon: Trash2Icon,
    iconColor: "text-danger",
    iconBg: "bg-danger/10",
    iconBorder: "border-danger/30",
    pillBg: "bg-danger/10",
    pillText: "text-danger",
    leftBorder: "border-l-danger/50",
    rowHover: "hover:bg-danger/[0.03]",
    label: "Deleted",
    titleColor: "text-fg-muted",
    strikethrough: true,
  },
} as const;

type EventType = keyof typeof EVENT_CONFIG;

export function ProjectHistoryDialog({
  history,
  projectId,
}: {
  history: HistoryEvent[];
  projectId: string;
}) {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isPending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (!next) setVisibleCount(PAGE_SIZE);
    setOpen(next);
  }

  const visible = history.slice(0, visibleCount);
  const hasMore = visibleCount < history.length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            aria-label="View project history"
          />
        }
      >
        <HistoryIcon className="h-4 w-4" />
        History
        {history.length > 0 && (
          <span className="ml-0.5 rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-fg-secondary">
            {history.length}
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Project History</DialogTitle>
        </DialogHeader>
        {history.length === 0 ? (
          <p className="py-8 text-center text-sm text-fg-muted">
            No history yet.
          </p>
        ) : (
          <div className="flex min-h-0 flex-col overflow-y-auto">
            <div className="flex flex-col gap-1.5 pt-1 pb-2">
              {visible.map((event) => {
                const type = (event.eventType in EVENT_CONFIG
                  ? event.eventType
                  : "FEATURE_CREATED") as EventType;
                const cfg = EVENT_CONFIG[type];
                const Icon = cfg.icon;

                const date = new Date(event.createdAt).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                return (
                  <div
                    key={event.id}
                    className={`group flex items-center gap-4 rounded-lg border border-transparent border-l-2 ${cfg.leftBorder} px-4 py-3.5 transition-colors ${cfg.rowHover}`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${cfg.iconBorder} ${cfg.iconBg}`}
                    >
                      <Icon className={`h-3.5 w-3.5 ${cfg.iconColor}`} />
                    </div>

                    {/* Content */}
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cfg.pillBg} ${cfg.pillText}`}
                        >
                          {cfg.label}
                        </span>
                        <time className="text-[11px] text-fg-muted">{date}</time>
                      </div>
                      <p
                        className={`truncate text-sm font-medium ${cfg.titleColor} ${cfg.strikethrough ? "line-through opacity-60" : ""}`}
                      >
                        {event.featureTitle}
                      </p>
                    </div>

                    {/* Delete button */}
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await deleteHistoryEventAction(event.id, projectId);
                        });
                      }}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-fg-muted opacity-0 transition-all hover:bg-danger/10 hover:text-danger group-hover:opacity-100 disabled:opacity-50"
                      aria-label={`Remove history event: ${event.featureTitle}`}
                    >
                      <XIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="mx-1 mb-1 rounded-lg border border-border-subtle py-2.5 text-xs font-medium text-fg-secondary transition-colors hover:border-border-muted hover:bg-muted hover:text-fg-primary"
              >
                Show more ({history.length - visibleCount} remaining)
              </button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
