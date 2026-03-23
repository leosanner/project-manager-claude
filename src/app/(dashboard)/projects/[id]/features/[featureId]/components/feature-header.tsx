"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
  CalendarIcon,
  CircleDotIcon,
  FlagIcon,
} from "lucide-react";
import {
  updateFeatureTitleAction,
  deleteFeatureAction,
  type ActionState,
} from "../../../actions";
import type { FeatureDetail } from "@/types/feature";

const initialState: ActionState = { success: false };

const statusConfig: Record<
  FeatureDetail["status"],
  { color: string; bg: string; label: string }
> = {
  PLANNED: {
    color: "text-fg-muted",
    bg: "bg-fg-muted/10",
    label: "Planned",
  },
  IN_PROGRESS: {
    color: "text-brand",
    bg: "bg-brand/10",
    label: "In Progress",
  },
  DONE: {
    color: "text-success",
    bg: "bg-success/10",
    label: "Done",
  },
  CANCELLED: {
    color: "text-danger",
    bg: "bg-danger/10",
    label: "Cancelled",
  },
};

const priorityConfig: Record<
  FeatureDetail["priority"],
  { color: string; bg: string; dot: string; label: string }
> = {
  LOW: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    dot: "bg-emerald-500",
    label: "Low",
  },
  MEDIUM: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-400/10",
    dot: "bg-amber-400",
    label: "Medium",
  },
  HIGH: {
    color: "text-orange-600 dark:text-orange-400",
    bg: "bg-orange-500/10",
    dot: "bg-orange-500",
    label: "High",
  },
  CRITICAL: {
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    dot: "bg-red-500",
    label: "Critical",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FeatureHeader({
  feature,
  projectId,
}: {
  feature: FeatureDetail;
  projectId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [updateState, updateAction, isUpdating] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await updateFeatureTitleAction(prevState, formData);
      if (result.success) {
        setIsEditing(false);
      }
      return result;
    },
    initialState
  );

  const [deleteState, deleteAction, isDeleting] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      return deleteFeatureAction(prevState, formData);
    },
    initialState
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const status = statusConfig[feature.status];
  const priority = priorityConfig[feature.priority];

  return (
    <div className="mb-4 shrink-0">
      {/* Title row */}
      <div className="flex items-center gap-2">
        {isEditing ? (
          <form
            action={updateAction}
            className="flex flex-1 items-center gap-2"
          >
            <input type="hidden" name="featureId" value={feature.id} />
            <input type="hidden" name="projectId" value={projectId} />
            <Input
              ref={inputRef}
              name="title"
              defaultValue={feature.title}
              required
              maxLength={30}
              className="h-10 flex-1 text-xl font-bold"
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
            <h1 className="min-w-0 truncate text-2xl font-bold tracking-tight">
              {feature.title}
            </h1>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setIsEditing(true)}
              aria-label="Edit feature title"
              className="opacity-0 transition-opacity hover:opacity-100 group-hover:opacity-100 [div:hover>&]:opacity-70"
            >
              <PencilIcon />
            </Button>

            <div className="ml-auto flex shrink-0 items-center gap-1">
              <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete feature"
                      className="text-fg-muted hover:text-danger"
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
            </div>
          </>
        )}
      </div>

      {updateState.error && (
        <p className="mt-1 text-sm text-danger">{updateState.error}</p>
      )}

      {/* Metadata pills row */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {/* Status pill */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${status.bg} ${status.color}`}
        >
          <CircleDotIcon className="h-3 w-3" />
          {status.label}
        </div>

        {/* Priority pill */}
        <div
          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium ${priority.bg} ${priority.color}`}
        >
          <FlagIcon className="h-3 w-3" />
          {priority.label}
        </div>

        {/* Separator */}
        <div className="h-4 w-px bg-border-subtle" />

        {/* Due date */}
        {feature.dueDate && (
          <div className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
            <CalendarIcon className="h-3 w-3" />
            Due {formatDate(feature.dueDate)}
          </div>
        )}

        {/* Updated at */}
        <div className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
          Updated {formatDate(feature.updatedAt)}
        </div>
      </div>
    </div>
  );
}
