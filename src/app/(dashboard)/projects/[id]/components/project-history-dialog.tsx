"use client";

import { useState } from "react";
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
} from "lucide-react";

type HistoryEvent = {
  id: string;
  eventType: string;
  featureTitle: string;
  createdAt: string;
};

export function ProjectHistoryDialog({
  history,
}: {
  history: HistoryEvent[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Project History</DialogTitle>
        </DialogHeader>
        {history.length === 0 ? (
          <p className="py-6 text-center text-sm text-fg-muted">
            No history yet.
          </p>
        ) : (
          <div className="relative flex flex-col gap-0 pt-2">
            <div className="absolute left-[18px] top-4 h-[calc(100%-1.5rem)] w-px bg-border-subtle" />
            {history.map((event) => {
              const isCreated = event.eventType === "FEATURE_CREATED";
              const isConcluded = event.eventType === "FEATURE_CONCLUDED";
              const isDeleted = event.eventType === "FEATURE_DELETED";

              const icon = isCreated ? (
                <PlusCircleIcon className="h-3.5 w-3.5 text-fg-muted" />
              ) : isConcluded ? (
                <CheckCircle2Icon className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Trash2Icon className="h-3.5 w-3.5 text-danger" />
              );

              const iconBg = isCreated
                ? "bg-muted"
                : isConcluded
                  ? "bg-emerald-500/10"
                  : "bg-danger/10";

              const label = isCreated
                ? "Feature created"
                : isConcluded
                  ? "Marked as complete"
                  : "Feature deleted";

              const titleColor = isDeleted
                ? "text-fg-muted line-through"
                : "text-fg-primary";

              const date = new Date(event.createdAt).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", year: "numeric" }
              );

              return (
                <div
                  key={event.id}
                  className="relative flex items-start gap-4 py-3"
                >
                  <div
                    className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-subtle ${iconBg}`}
                  >
                    {icon}
                  </div>
                  <div className="flex min-w-0 flex-1 items-center gap-3 pt-1.5">
                    <p className="min-w-0 flex-1 text-sm">
                      <span className="text-fg-secondary">{label}: </span>
                      <span className={`font-medium ${titleColor}`}>
                        &ldquo;{event.featureTitle}&rdquo;
                      </span>
                    </p>
                    <time className="shrink-0 text-xs text-fg-muted">
                      {date}
                    </time>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
