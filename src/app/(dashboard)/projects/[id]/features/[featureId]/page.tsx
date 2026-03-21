import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getFeature, getProjectById } from "@/lib/db/features";
import { FeatureHeader } from "./components/feature-header";
import { FeatureEditor } from "./components/feature-editor";
import type { FeatureDetail } from "@/types/feature";
import { ChevronRightIcon } from "lucide-react";

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ id: string; featureId: string }>;
}) {
  const { id, featureId } = await params;
  const { user } = await getSessionOrThrow();

  const project = await getProjectById(id, user.id);
  if (!project) notFound();

  const feature = await getFeature(featureId, user.id);
  if (!feature) notFound();

  const serialized: FeatureDetail = {
    id: feature.id,
    title: feature.title,
    status: feature.status,
    priority: feature.priority,
    dueDate: feature.endDate?.toISOString() ?? null,
    createdAt: feature.createdAt.toISOString(),
    updatedAt: feature.updatedAt.toISOString(),
    document: feature.document
      ? {
          id: feature.document.id,
          markdownContent: feature.document.markdownContent,
        }
      : null,
  };

  return (
    <div className="flex h-[calc(100dvh-6.5rem)] flex-col">
      {/* Breadcrumb */}
      <nav className="mb-4 flex shrink-0 items-center gap-1.5 text-sm">
        <Link
          href="/dashboard"
          className="text-fg-muted transition-colors hover:text-fg-primary"
        >
          Dashboard
        </Link>
        <ChevronRightIcon className="h-3 w-3 text-fg-muted/50" />
        <Link
          href={`/projects/${id}`}
          className="text-fg-muted transition-colors hover:text-fg-primary"
        >
          {project.name}
        </Link>
        <ChevronRightIcon className="h-3 w-3 text-fg-muted/50" />
        <span className="truncate font-medium text-fg-primary">
          {feature.title}
        </span>
      </nav>

      <FeatureHeader feature={serialized} projectId={id} />

      <FeatureEditor
        featureId={featureId}
        projectId={id}
        initialContent={serialized.document?.markdownContent ?? ""}
      />
    </div>
  );
}
