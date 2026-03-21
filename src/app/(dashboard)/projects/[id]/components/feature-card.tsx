"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  CalendarIcon,
} from "lucide-react";
import {
  updateFeatureTitleAction,
  updateFeaturePriorityAction,
  deleteFeatureAction,
  type ActionState,
} from "../actions";
import type { FeatureSummary } from "@/types/feature";

const initialState: ActionState = { success: false };

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const statusAccent: Record<FeatureSummary["status"], string> = {
  PLANNED: "bg-fg-muted",
  IN_PROGRESS: "bg-brand",
  DONE: "bg-success",
  CANCELLED: "bg-danger",
};

const priorityConfig: {
  key: FeatureSummary["priority"];
  bg: string;
  text: string;
  label: string;
}[] = [
  {
    key: "LOW",
    bg: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    label: "Low",
  },
  {
    key: "MEDIUM",
    bg: "bg-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    label: "Medium",
  },
  {
    key: "HIGH",
    bg: "bg-orange-500",
    text: "text-orange-600 dark:text-orange-400",
    label: "High",
  },
  {
    key: "CRITICAL",
    bg: "bg-red-500",
    text: "text-red-600 dark:text-red-400",
    label: "Critical",
  },
];

const priorityByKey = Object.fromEntries(
  priorityConfig.map((p) => [p.key, p])
) as Record<FeatureSummary["priority"], (typeof priorityConfig)[number]>;

function formatRelativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatDueDate(iso: string) {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  if (diffDays < 0) return { text: `${formatted} (overdue)`, overdue: true };
  if (diffDays === 0) return { text: `${formatted} (today)`, overdue: false };
  if (diffDays <= 3) return { text: `${formatted} (${diffDays}d left)`, overdue: false };
  return { text: formatted, overdue: false };
}

export function FeatureCard({
  feature,
  projectId,
}: {
  feature: FeatureSummary;
  projectId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const mounted = useIsMounted();
  const inputRef = useRef<HTMLInputElement>(null);
  const priorityRef = useRef<HTMLDivElement>(null);

  const [updateState, updateAction, isUpdating] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await updateFeatureTitleAction(prevState, formData);
      if (result.success) {
        setIsEditing(false);
      }
      return result;
    },
    initialState,
  );

  const [deleteState, deleteAction, isDeleting] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await deleteFeatureAction(prevState, formData);
      if (result.success) {
        setDeleteOpen(false);
      }
      return result;
    },
    initialState,
  );

  const [, priorityAction, isPriorityUpdating] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await updateFeaturePriorityAction(prevState, formData);
      if (result.success) setPriorityOpen(false);
      return result;
    },
    initialState,
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (!priorityOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (priorityRef.current && !priorityRef.current.contains(e.target as Node)) {
        setPriorityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [priorityOpen]);

  const accent = statusAccent[feature.status];
  const due = feature.dueDate && mounted ? formatDueDate(feature.dueDate) : null;

  return (
    <Card className="relative">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <CardHeader>
        {isEditing ? (
          <form action={updateAction} className="flex items-center gap-2">
            <input type="hidden" name="featureId" value={feature.id} />
            <input type="hidden" name="projectId" value={projectId} />
            <Input
              ref={inputRef}
              name="title"
              defaultValue={feature.title}
              required
              className="h-8"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon-sm"
              disabled={isUpdating}
            >
              <CheckIcon />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsEditing(false)}
            >
              <XIcon />
            </Button>
          </form>
        ) : (
          <>
            <CardTitle>
              <Link
                href={`/projects/${projectId}/features/${feature.id}`}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
              >
                {feature.title}
                <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 transition-all group-hover/card:translate-x-0.5 group-hover/card:opacity-60" />
              </Link>
            </CardTitle>
            <CardAction>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
                aria-label="Edit feature title"
                className="opacity-0 transition-opacity group-hover/card:opacity-100"
              >
                <PencilIcon />
              </Button>
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete feature"
                      className="opacity-0 transition-opacity group-hover/card:opacity-100"
                    />
                  }
                >
                  <Trash2Icon />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Feature</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &ldquo;{feature.title}
                      &rdquo;? This will remove the feature and its document.
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  {deleteState.error && (
                    <p className="text-sm text-danger">{deleteState.error}</p>
                  )}
                  <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                      Cancel
                    </DialogClose>
                    <form action={deleteAction}>
                      <input
                        type="hidden"
                        name="featureId"
                        value={feature.id}
                      />
                      <input
                        type="hidden"
                        name="projectId"
                        value={projectId}
                      />
                      <Button
                        type="submit"
                        variant="destructive"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    </form>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardAction>
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2">
          <div ref={priorityRef} className="relative">
            <button
              type="button"
              onClick={() => setPriorityOpen(!priorityOpen)}
              className="inline-flex items-center gap-1.5 rounded-md border border-transparent px-2 py-0.5 text-xs font-medium text-fg-secondary transition-all hover:border-border-muted hover:bg-muted"
              aria-label={`Importance: ${priorityByKey[feature.priority].label}`}
            >
              <span className={`inline-block h-2 w-2 rounded-full ${priorityByKey[feature.priority].bg}`} />
              {priorityByKey[feature.priority].label}
              <svg width="10" height="10" viewBox="0 0 10 10" className={`transition-transform ${priorityOpen ? "rotate-180" : ""}`}>
                <path d="M2.5 4L5 6.5L7.5 4" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {priorityOpen && (
              <div className="absolute left-0 top-full z-20 mt-1.5 w-52 rounded-lg border border-border-default bg-background shadow-lg">
                <div className="border-b border-border-subtle px-3 py-2">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                    Importance
                  </p>
                </div>
                <div className="p-1">
                  {priorityConfig.map((p) => {
                    const isActive = feature.priority === p.key;
                    return (
                      <form key={p.key} action={priorityAction}>
                        <input type="hidden" name="featureId" value={feature.id} />
                        <input type="hidden" name="projectId" value={projectId} />
                        <input type="hidden" name="priority" value={p.key} />
                        <button
                          type="submit"
                          disabled={isPriorityUpdating}
                          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-left transition-colors ${isActive ? "bg-muted" : "hover:bg-muted/60"}`}
                        >
                          <span className={`flex h-3 w-3 shrink-0 items-center justify-center rounded-full ${p.bg}`}>
                            {isActive && (
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1.5 4L3.2 5.7L6.5 2.3" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            )}
                          </span>
                          <span className={`text-xs font-medium ${isActive ? p.text : "text-fg-primary"}`}>
                            {p.label}
                          </span>
                        </button>
                      </form>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          {due && (
            <span
              className={`inline-flex items-center gap-1 text-xs ${due.overdue ? "font-medium text-danger" : "text-fg-muted"}`}
            >
              <CalendarIcon className="h-3 w-3" />
              {due.text}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-fg-muted">
          Updated {mounted ? formatRelativeDate(feature.updatedAt) : ""}
        </span>
        {updateState.error && (
          <span className="text-xs text-danger">{updateState.error}</span>
        )}
      </CardFooter>
    </Card>
  );
}
