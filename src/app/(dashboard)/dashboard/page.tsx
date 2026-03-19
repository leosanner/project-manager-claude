import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserProjects } from "@/lib/db/projects";
import { CreateProjectButton } from "./components/create-project-button";
import { ProjectCard } from "./components/project-card";
import type { ProjectSummary } from "@/types/project";
import { FolderOpenIcon, CalendarDaysIcon } from "lucide-react";

export default async function DashboardPage() {
  const { user } = await getSessionOrThrow();
  const projects = await getUserProjects(user.id);

  const serialized: ProjectSummary[] = projects.map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    _count: p._count,
  }));

  const activeCount = serialized.filter((p) => p.status === "ACTIVE").length;

  return (
    <div>
      {/* Page header */}
      <div className="mb-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Project Dashboard
            </h1>
            <p className="mt-2 text-base text-fg-secondary">
              {serialized.length > 0
                ? `You are currently managing ${activeCount} active project${activeCount !== 1 ? "s" : ""}.`
                : "Start by creating your first project"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/calendar"
              className="inline-flex items-center gap-2 rounded-lg border border-border-muted px-4 py-2 text-sm font-medium text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
            >
              <CalendarDaysIcon className="h-4 w-4" />
              View Calendar
            </Link>
            <CreateProjectButton />
          </div>
        </div>
      </div>

      {/* Project grid */}
      {serialized.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serialized.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-muted bg-subtle/50 py-20 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <FolderOpenIcon className="h-7 w-7 text-fg-muted" />
          </div>
          <h2 className="mb-1.5 text-lg font-semibold">No projects yet</h2>
          <p className="mb-6 max-w-xs text-sm text-fg-secondary">
            Projects help you organize features, documents, and track progress
            all in one place.
          </p>
          <CreateProjectButton variant="inline" />
        </div>
      )}
    </div>
  );
}
