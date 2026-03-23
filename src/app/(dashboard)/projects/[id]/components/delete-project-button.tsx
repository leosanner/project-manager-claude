"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Trash2Icon } from "lucide-react";
import { deleteProjectFromPageAction, type ActionState } from "../actions";

const initialState: ActionState = { success: false };

export function DeleteProjectButton({
  projectId,
  projectName,
}: {
  projectId: string;
  projectName: string;
}) {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    deleteProjectFromPageAction,
    initialState
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Delete project"
            className="text-fg-muted hover:text-danger"
          />
        }
      >
        <Trash2Icon />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &ldquo;{projectName}&rdquo;? This
            will remove the project and all its features. This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        {state.error && (
          <p className="text-sm text-danger">{state.error}</p>
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Cancel
          </DialogClose>
          <form action={formAction}>
            <input type="hidden" name="projectId" value={projectId} />
            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
