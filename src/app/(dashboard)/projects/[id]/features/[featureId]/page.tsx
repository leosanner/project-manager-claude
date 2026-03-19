import { notFound } from "next/navigation";
import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getFeature, getProjectById } from "@/lib/db/features";
import { FeatureHeader } from "./components/feature-header";
import { FeatureEditor } from "./components/feature-editor";
import type { FeatureDetail } from "@/types/feature";
import { ArrowLeftIcon } from "lucide-react";

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
    <div>
      <nav className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/projects/${id}`} className="hover:text-foreground">
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-foreground">{feature.title}</span>
      </nav>

      <Link
        href={`/projects/${id}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Project
      </Link>

      <FeatureHeader feature={serialized} projectId={id} />

      <FeatureEditor
        featureId={featureId}
        projectId={id}
        initialContent={serialized.document?.markdownContent ?? ""}
      />
    </div>
  );
}
