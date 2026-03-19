import Link from "next/link";

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <h2 className="mb-2 text-2xl font-bold">Project not found</h2>
      <p className="mb-4 text-muted-foreground">
        The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.
      </p>
      <Link href="/dashboard" className="text-sm underline hover:text-foreground">
        Back to Dashboard
      </Link>
    </div>
  );
}
