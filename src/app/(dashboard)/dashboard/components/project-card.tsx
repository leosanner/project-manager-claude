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
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  PencilIcon,
  Trash2Icon,
  CheckIcon,
  XIcon,
  EllipsisVerticalIcon,
  FolderIcon,
  CircleCheckIcon,
  ArchiveIcon,
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
  {
    label: string;
    accent: string;
    iconBg: string;
    progressWidth: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  ACTIVE: {
    label: "Active",
    accent: "bg-brand",
    iconBg: "bg-brand/10 text-brand",
    progressWidth: "60%",
    Icon: FolderIcon,
  },
  COMPLETED: {
    label: "Completed",
    accent: "bg-success",
    iconBg: "bg-success/10 text-success",
    progressWidth: "100%",
    Icon: CircleCheckIcon,
  },
  ARCHIVED: {
    label: "Archived",
    accent: "bg-fg-muted",
    iconBg: "bg-muted text-fg-muted",
    progressWidth: "0%",
    Icon: ArchiveIcon,
  },
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

  const { label, accent, iconBg, progressWidth, Icon } =
    statusConfig[project.status];
  const featureCount = project._count.features;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        {isEditing ? (
          <form action={updateAction} className="flex items-center gap-2">
            <input type="hidden" name="projectId" value={project.id} />
            <Input
              ref={inputRef}
              name="name"
              defaultValue={project.name}
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
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle>
                  <Link
                    href={`/projects/${project.id}`}
                    className="transition-colors hover:text-brand"
                  >
                    {project.name}
                  </Link>
                </CardTitle>
                <p className="mt-0.5 text-sm text-fg-secondary">
                  {featureCount} feature{featureCount !== 1 ? "s" : ""} &middot;{" "}
                  {label}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className="text-xs text-fg-muted">
                  {mounted ? formatRelativeDate(project.updatedAt) : ""}
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Project options"
                        className="opacity-0 transition-opacity group-hover/card:opacity-100"
                      />
                    }
                  >
                    <EllipsisVerticalIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setIsEditing(true)}>
                      <PencilIcon className="mr-2 h-4 w-4" />
                      Edit name
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setDeleteOpen(true)}
                      className="text-danger focus:text-danger"
                    >
                      <Trash2Icon className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full ${accent} transition-all`}
            style={{ width: progressWidth }}
          />
        </div>
        {updateState.error && (
          <p className="mt-2 text-xs text-danger">{updateState.error}</p>
        )}
      </CardContent>

      {/* Delete dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{project.name}
              &rdquo;? This will remove the project and all its features. This
              action cannot be undone.
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
              <input type="hidden" name="projectId" value={project.id} />
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
    </Card>
  );
}
