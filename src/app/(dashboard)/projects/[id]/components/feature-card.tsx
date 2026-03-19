"use client";

import { useActionState, useEffect, useRef, useState, useSyncExternalStore } from "react";
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
import { Badge } from "@/components/ui/badge";
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
import { PencilIcon, Trash2Icon, CheckIcon, XIcon } from "lucide-react";
import {
  updateFeatureTitleAction,
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
    () => false
  );
}

const statusVariant: Record<
  FeatureSummary["status"],
  "default" | "secondary" | "outline"
> = {
  PLANNED: "outline",
  IN_PROGRESS: "default",
  DONE: "secondary",
  CANCELLED: "outline",
};

const priorityVariant: Record<
  FeatureSummary["priority"],
  "default" | "secondary" | "outline"
> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "default",
  CRITICAL: "default",
};

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

export function FeatureCard({
  feature,
  projectId,
}: {
  feature: FeatureSummary;
  projectId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const mounted = useIsMounted();
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
      const result = await deleteFeatureAction(prevState, formData);
      if (result.success) {
        setDeleteOpen(false);
      }
      return result;
    },
    initialState
  );

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  return (
    <Card>
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
                className="hover:underline"
              >
                {feature.title}
              </Link>
            </CardTitle>
            <CardAction>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
                aria-label="Edit feature title"
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
        <div className="flex items-center gap-3">
          <Badge variant={statusVariant[feature.status]}>
            {feature.status.toLowerCase().replace("_", " ")}
          </Badge>
          <Badge variant={priorityVariant[feature.priority]}>
            {feature.priority.toLowerCase()}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-muted-foreground">
          Updated {mounted ? formatRelativeDate(feature.updatedAt) : ""}
        </span>
        {updateState.error && (
          <span className="text-xs text-danger">{updateState.error}</span>
        )}
      </CardFooter>
    </Card>
  );
}
