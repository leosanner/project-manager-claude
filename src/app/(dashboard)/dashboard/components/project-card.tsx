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
import {
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  ArrowRightIcon,
  LayersIcon,
} from "lucide-react";
import {
  updateProjectNameAction,
  deleteProjectAction,
  type ActionState,
} from "../actions";
import type { ProjectSummary } from "@/types/project";

const initialState: ActionState = { success: false };

const emptySubscribe = () => () => {};

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const statusConfig: Record<
  ProjectSummary["status"],
  { variant: "default" | "secondary" | "outline"; label: string; accent: string }
> = {
  ACTIVE: { variant: "default", label: "Active", accent: "bg-brand" },
  COMPLETED: { variant: "secondary", label: "Completed", accent: "bg-success" },
  ARCHIVED: { variant: "outline", label: "Archived", accent: "bg-fg-muted" },
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

export function ProjectCard({ project }: { project: ProjectSummary }) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const mounted = useIsMounted();
  const inputRef = useRef<HTMLInputElement>(null);

  const [updateState, updateAction, isUpdating] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await updateProjectNameAction(prevState, formData);
      if (result.success) {
        setIsEditing(false);
      }
      return result;
    },
    initialState,
  );

  const [deleteState, deleteAction, isDeleting] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await deleteProjectAction(prevState, formData);
      if (result.success) {
        setDeleteOpen(false);
      }
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

  const { variant, label, accent } = statusConfig[project.status];

  return (
    <Card className="relative overflow-hidden">
      <div className={`absolute left-0 top-0 h-full w-1 ${accent}`} />
      <CardHeader>
        {isEditing ? (
          <form action={updateAction} className="flex items-center gap-2">
            <input type="hidden" name="projectId" value={project.id} />
            <Input
              ref={inputRef}
              name="name"
              defaultValue={project.name}
              required
              maxLength={30}
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
            <CardTitle className="min-w-0">
              <Link
                href={`/projects/${project.id}`}
                className="inline-flex items-center gap-1.5 truncate transition-colors hover:text-brand"
              >
                {project.name}
                <ArrowRightIcon className="h-3.5 w-3.5 opacity-0 transition-all group-hover/card:translate-x-0.5 group-hover/card:opacity-60" />
              </Link>
            </CardTitle>
            <CardAction className="shrink-0">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setIsEditing(true)}
                aria-label="Edit project name"
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
                      aria-label="Delete project"
                      className="opacity-0 transition-opacity group-hover/card:opacity-100"
                    />
                  }
                >
                  <Trash2Icon />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Project</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete &ldquo;{project.name}
                      &rdquo;? This will remove the project and all its
                      features. This action cannot be undone.
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
                        name="projectId"
                        value={project.id}
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
          <Badge variant={variant}>{label}</Badge>
          <span className="flex items-center gap-1.5 text-sm text-fg-secondary">
            <LayersIcon className="h-3.5 w-3.5" />
            {project._count.features} feature
            {project._count.features !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <span className="text-xs text-fg-muted">
          Updated {mounted ? formatRelativeDate(project.updatedAt) : ""}
        </span>
        {updateState.error && (
          <span className="text-xs text-danger">{updateState.error}</span>
        )}
      </CardFooter>
    </Card>
  );
}
