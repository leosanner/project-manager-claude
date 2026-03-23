import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserProjects } from "@/lib/db/projects";
import {
  getTotalFeatureCount,
  getNextUpcomingFeature,
} from "@/lib/db/features";
import Link from "next/link";
import { CreateProjectButton } from "./components/create-project-button";
import { ProjectCard } from "./components/project-card";
import type { ProjectSummary } from "@/types/project";
import {
  FolderOpenIcon,
  LayersIcon,
  PuzzleIcon,
  CalendarClockIcon,
} from "lucide-react";

function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays <= 7) return `in ${diffDays} days`;
  if (diffDays <= 30) {
    const weeks = Math.ceil(diffDays / 7);
    return `in ${weeks} week${weeks !== 1 ? "s" : ""}`;
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const { user } = await getSessionOrThrow();
  const [projects, totalFeatures, nextFeature] = await Promise.all([
    getUserProjects(user.id),
    getTotalFeatureCount(user.id),
    getNextUpcomingFeature(user.id),
  ]);

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
              Welcome back, <span className="text-brand">{firstName}</span>
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
          <div className="flex flex-wrap gap-8 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                <LayersIcon className="h-5 w-5 text-brand" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-tight">
                  {serialized.length}
                </p>
                <p className="text-sm text-fg-muted">Projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10">
                <PuzzleIcon className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-tight">
                  {totalFeatures}
                </p>
                <p className="text-sm text-fg-muted">Features</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-warning/10">
                <CalendarClockIcon className="h-5 w-5 text-warning" />
              </div>
              <div>
                {nextFeature ? (
                  <>
                    <Link
                      href={`/projects/${nextFeature.projectId}/features/${nextFeature.id}`}
                      className="text-base font-bold leading-tight hover:text-brand transition-colors truncate block max-w-[200px]"
                      title={nextFeature.title}
                    >
                      {nextFeature.title}
                    </Link>
                    <p className="text-sm text-fg-muted">
                      Due {formatRelativeDate(nextFeature.endDate!)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-bold leading-tight text-fg-muted">
                      No upcoming
                    </p>
                    <p className="text-sm text-fg-muted">Next deadline</p>
                  </>
                )}
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
