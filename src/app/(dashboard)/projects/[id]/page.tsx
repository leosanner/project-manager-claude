import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getProjectById, getProjectFeatures } from "@/lib/db/features";
import { CreateFeatureButton } from "./components/create-feature-button";
import { FeatureCard } from "./components/feature-card";
import type { FeatureSummary } from "@/types/feature";
import { ArrowLeftIcon, LayoutListIcon } from "lucide-react";
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

  const features = await getProjectFeatures(id, user.id);

  const serialized: FeatureSummary[] = features.map((f) => ({
    id: f.id,
    title: f.title,
    status: f.status,
    priority: f.priority,
    dueDate: f.endDate?.toISOString() ?? null,
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-fg-secondary transition-colors hover:text-fg-primary"
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
            <p className="mt-2 text-base text-fg-secondary">
              {serialized.length > 0
                ? `${serialized.length} feature${serialized.length !== 1 ? "s" : ""}`
                : "No features yet"}
            </p>
          </div>
          <CreateFeatureButton projectId={id} />
        </div>
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
