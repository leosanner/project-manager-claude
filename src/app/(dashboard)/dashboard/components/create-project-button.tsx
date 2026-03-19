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
import { createProjectAction, type ActionState } from "../actions";

const initialState: ActionState = { success: false };

export function CreateProjectButton({
  variant = "default",
}: {
  variant?: "default" | "inline";
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await createProjectAction(prevState, formData);
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
      <DialogTrigger
        render={
          variant === "inline" ? (
            <Button variant="outline" size="sm" />
          ) : (
            <Button />
          )
        }
      >
        <PlusIcon />
        {variant === "inline" ? "Create a project" : "New Project"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction}>
          <div className="grid gap-4">
            <Input name="name" placeholder="Project name" required autoFocus />
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
