import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserProjects } from "@/lib/db/projects";
import { CreateProjectButton } from "./components/create-project-button";
import { ProjectCard } from "./components/project-card";
import type { ProjectSummary } from "@/types/project";
import { FolderOpenIcon, LayersIcon } from "lucide-react";

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
  const firstName = user.name?.split(" ")[0] ?? "there";

  return (
    <div>
      {/* Page header */}
      <div className="mb-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 text-base text-fg-secondary">
              {serialized.length > 0
                ? `You have ${serialized.length} project${serialized.length !== 1 ? "s" : ""}${activeCount > 0 ? ` — ${activeCount} active` : ""}`
                : "Start by creating your first project"}
            </p>
          </div>
          <CreateProjectButton />
        </div>

        {/* Stats bar */}
        {serialized.length > 0 && (
          <div className="flex gap-6 border-b border-border-subtle pb-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10">
                <LayersIcon className="h-4 w-4 text-brand" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight">
                  {serialized.length}
                </p>
                <p className="text-xs text-fg-muted">Projects</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/10">
                <div className="h-2 w-2 rounded-full bg-success" />
              </div>
              <div>
                <p className="text-lg font-semibold leading-tight">
                  {activeCount}
                </p>
                <p className="text-xs text-fg-muted">Active</p>
              </div>
            </div>
          </div>
        )}
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
