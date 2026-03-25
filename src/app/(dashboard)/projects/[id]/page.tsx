import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getProjectById, getProjectFeatures } from "@/lib/db/features";
import { getProjectHistory } from "@/lib/db/history";
import { CreateFeatureButton } from "./components/create-feature-button";
import { FeatureCard } from "./components/feature-card";
import { ProjectHistoryDialog } from "./components/project-history-dialog";
import type { FeatureSummary } from "@/types/feature";
import {
  ArrowLeftIcon,
  LayoutListIcon,
  PuzzleIcon,
  CircleDotIcon,
  CheckCircle2Icon,
  CircleSlashIcon,
  CircleDashedIcon,
} from "lucide-react";
import { DeleteProjectButton } from "./components/delete-project-button";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { user } = await getSessionOrThrow();

  const project = await getProjectById(id, user.id);
  if (!project) notFound();

  const [features, history] = await Promise.all([
    getProjectFeatures(id, user.id),
    getProjectHistory(id, user.id),
  ]);

  const serializedHistory = history.map((h) => ({
    id: h.id,
    eventType: h.eventType,
    featureTitle: h.featureTitle,
    createdAt: h.createdAt.toISOString(),
  }));

  const serialized: FeatureSummary[] = features.map((f) => ({
    id: f.id,
    title: f.title,
    status: f.status,
    priority: f.priority,
    dueDate: f.endDate?.toISOString() ?? null,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  const planned = serialized.filter((f) => f.status === "PLANNED").length;
  const inProgress = serialized.filter((f) => f.status === "IN_PROGRESS").length;
  const done = serialized.filter((f) => f.status === "DONE").length;
  const cancelled = serialized.filter((f) => f.status === "CANCELLED").length;

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-2 rounded-lg border border-border-subtle bg-subtle/50 px-4 py-2 text-sm font-medium text-fg-secondary transition-all hover:border-border-muted hover:bg-muted hover:text-fg-primary"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">
                {project.name}
              </h1>
              <DeleteProjectButton projectId={id} projectName={project.name} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {serializedHistory.length > 0 && (
              <ProjectHistoryDialog history={serializedHistory} />
            )}
            <CreateFeatureButton projectId={id} />
          </div>
        </div>

        {/* Feature stats */}
        {serialized.length > 0 && (
          <div className="flex flex-wrap gap-8 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info/10">
                <PuzzleIcon className="h-5 w-5 text-info" />
              </div>
              <div>
                <p className="text-2xl font-bold leading-tight">
                  {serialized.length}
                </p>
                <p className="text-sm text-fg-muted">Total Features</p>
              </div>
            </div>
            {planned > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-fg-muted/10">
                  <CircleDashedIcon className="h-5 w-5 text-fg-muted" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-tight">{planned}</p>
                  <p className="text-sm text-fg-muted">Planned</p>
                </div>
              </div>
            )}
            {inProgress > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand/10">
                  <CircleDotIcon className="h-5 w-5 text-brand" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-tight">{inProgress}</p>
                  <p className="text-sm text-fg-muted">In Progress</p>
                </div>
              </div>
            )}
            {done > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
                  <CheckCircle2Icon className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-tight">{done}</p>
                  <p className="text-sm text-fg-muted">Done</p>
                </div>
              </div>
            )}
            {cancelled > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-danger/10">
                  <CircleSlashIcon className="h-5 w-5 text-danger" />
                </div>
                <div>
                  <p className="text-2xl font-bold leading-tight">{cancelled}</p>
                  <p className="text-sm text-fg-muted">Cancelled</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {serialized.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {serialized.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              projectId={id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border-muted bg-subtle/50 py-20 text-center">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <LayoutListIcon className="h-7 w-7 text-fg-muted" />
          </div>
          <h2 className="mb-1.5 text-lg font-semibold">No features yet</h2>
          <p className="mb-6 max-w-xs text-sm text-fg-secondary">
            Features help you break down your project into manageable pieces.
          </p>
        </div>
      )}

    </div>
  );
}
