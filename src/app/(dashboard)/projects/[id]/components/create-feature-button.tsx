"use client";

import { useActionState, useRef, useState } from "react";
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
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import { createFeatureAction, type ActionState } from "../actions";

const initialState: ActionState = { success: false };

export function CreateFeatureButton({ projectId }: { projectId: string }) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await createFeatureAction(prevState, formData);
      if (result.success) {
        setOpen(false);
        formRef.current?.reset();
      }
      return result;
    },
    initialState
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon />
        New Feature
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Feature</DialogTitle>
          <DialogDescription>
            Give your feature a title and optionally set a due date.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <input type="hidden" name="projectId" value={projectId} />
          <div className="grid gap-4">
            <div>
              <label
                htmlFor="feature-title"
                className="mb-1.5 block text-sm font-medium"
              >
                Title
              </label>
              <Input
                id="feature-title"
                name="title"
                placeholder="Feature title"
                required
                autoFocus
              />
            </div>
            <div>
              <label
                htmlFor="feature-due-date"
                className="mb-1.5 block text-sm font-medium"
              >
                Due date{" "}
                <span className="font-normal text-fg-muted">(optional)</span>
              </label>
              <Input id="feature-due-date" name="dueDate" type="date" />
            </div>
            {state.error && (
              <p className="text-sm text-danger">{state.error}</p>
            )}
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
