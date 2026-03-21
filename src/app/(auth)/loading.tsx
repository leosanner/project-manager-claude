export default function AuthLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-canvas px-6">
      {/* Ambient glow — matches sign-in page */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--accent-primary)_0%,transparent_60%)] opacity-[0.06]" />

      <div className="relative w-full max-w-sm animate-in fade-in duration-300">
        {/* Logo skeleton */}
        <div className="mb-10 flex flex-col items-center gap-3">
          <div className="skeleton h-12 w-12 rounded-xl" />
          <div
            className="skeleton-text h-5 w-36"
            style={{ animationDelay: "80ms" }}
          />
        </div>

        {/* Card skeleton */}
        <div className="rounded-2xl border border-border-subtle bg-elevated p-8 shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          {/* Title */}
          <div className="mb-7 flex flex-col items-center gap-2">
            <div
              className="skeleton-text h-6 w-36"
              style={{ animationDelay: "120ms" }}
            />
            <div
              className="skeleton-text h-4 w-52"
              style={{ animationDelay: "180ms" }}
            />
          </div>

          {/* Google button skeleton */}
          <div
            className="skeleton h-12 w-full rounded-xl"
            style={{ animationDelay: "240ms" }}
          />

          {/* Divider */}
          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border-subtle" />
            <div
              className="skeleton-text h-3 w-20"
              style={{ animationDelay: "300ms" }}
            />
            <div className="h-px flex-1 bg-border-subtle" />
          </div>

          {/* Footer text skeleton */}
          <div className="mt-4 flex flex-col items-center gap-1.5">
            <div
              className="skeleton-text h-3 w-48"
              style={{ animationDelay: "360ms" }}
            />
            <div
              className="skeleton-text h-3 w-32"
              style={{ animationDelay: "400ms" }}
            />
          </div>
        </div>

        {/* Back link skeleton */}
        <div className="mt-6 flex justify-center">
          <div
            className="skeleton-text h-4 w-24"
            style={{ animationDelay: "440ms" }}
          />
        </div>
      </div>
    </div>
  );
}
