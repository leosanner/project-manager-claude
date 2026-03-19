"use client";

import { useActionState, useEffect, useRef, useState } from "react";
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
} from "../../../actions";
import type { FeatureDetail } from "@/types/feature";

const initialState: ActionState = { success: false };

const statusVariant: Record<
  FeatureDetail["status"],
  "default" | "secondary" | "outline"
> = {
  PLANNED: "outline",
  IN_PROGRESS: "default",
  DONE: "secondary",
  CANCELLED: "outline",
};

const priorityVariant: Record<
  FeatureDetail["priority"],
  "default" | "secondary" | "outline"
> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "default",
  CRITICAL: "default",
};

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

  return (
    <div className="mb-6">
      <div className="flex items-center gap-3">
        {isEditing ? (
          <form action={updateAction} className="flex items-center gap-2">
            <input type="hidden" name="featureId" value={feature.id} />
            <input type="hidden" name="projectId" value={projectId} />
            <Input
              ref={inputRef}
              name="title"
              defaultValue={feature.title}
              required
              className="h-10 text-xl font-bold"
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
            <h1 className="text-2xl font-bold">{feature.title}</h1>
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
          </>
        )}
      </div>

      {updateState.error && (
        <p className="mt-1 text-sm text-danger">{updateState.error}</p>
      )}

      <div className="mt-3 flex items-center gap-3">
        <Badge variant={statusVariant[feature.status]}>
          {feature.status.toLowerCase().replace("_", " ")}
        </Badge>
        <Badge variant={priorityVariant[feature.priority]}>
          {feature.priority.toLowerCase()}
        </Badge>
      </div>
    </div>
  );
}
