import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserProjects } from "@/lib/db/projects";
import { CreateProjectButton } from "./components/create-project-button";
import { ProjectCard } from "./components/project-card";
import type { ProjectSummary } from "@/types/project";
import { FolderOpenIcon } from "lucide-react";

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

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <CreateProjectButton />
      </div>

      {serialized.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serialized.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <FolderOpenIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-1 text-lg font-medium">No projects yet</h2>
          <p className="text-sm text-muted-foreground">
            Create your first project to get started.
          </p>
        </div>
      )}
    </div>
  );
}
