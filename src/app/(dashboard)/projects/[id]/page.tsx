import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getProjectById, getProjectFeatures } from "@/lib/db/features";
import { CreateFeatureButton } from "./components/create-feature-button";
import { FeatureCard } from "./components/feature-card";
import type { FeatureSummary } from "@/types/feature";
import { ArrowLeftIcon, LayoutListIcon } from "lucide-react";

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
    createdAt: f.createdAt.toISOString(),
    updatedAt: f.updatedAt.toISOString(),
  }));

  return (
    <div>
      <Link
        href="/dashboard"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{project.name}</h1>
        <CreateFeatureButton projectId={id} />
      </div>

      {serialized.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {serialized.map((feature) => (
            <FeatureCard
              key={feature.id}
              feature={feature}
              projectId={id}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
          <LayoutListIcon className="mb-4 h-12 w-12 text-muted-foreground" />
          <h2 className="mb-1 text-lg font-medium">No features yet</h2>
          <p className="text-sm text-muted-foreground">
            Create your first feature to get started.
          </p>
        </div>
      )}
    </div>
  );
}
