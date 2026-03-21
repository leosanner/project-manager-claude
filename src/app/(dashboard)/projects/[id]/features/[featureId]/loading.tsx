export default function FeatureLoading() {
  return (
    <div className="flex h-[calc(100dvh-6.5rem)] animate-in fade-in flex-col duration-300">
      {/* Breadcrumb skeleton */}
      <nav className="mb-4 flex shrink-0 items-center gap-1.5">
        <div className="skeleton-text h-4 w-20" />
        <div className="skeleton-text h-3 w-3 rounded-full" />
        <div
          className="skeleton-text h-4 w-28"
          style={{ animationDelay: "60ms" }}
        />
        <div className="skeleton-text h-3 w-3 rounded-full" />
        <div
          className="skeleton-text h-4 w-36"
          style={{ animationDelay: "120ms" }}
        />
      </nav>

      {/* Feature header skeleton */}
      <div className="mb-4 flex shrink-0 items-start justify-between">
        <div className="flex-1">
          <div
            className="skeleton h-8 w-64"
            style={{ animationDelay: "150ms" }}
          />
          <div className="mt-3 flex items-center gap-3">
            <div
              className="skeleton h-6 w-24 rounded-full"
              style={{ animationDelay: "200ms" }}
            />
            <div
              className="skeleton-text h-5 w-16"
              style={{ animationDelay: "250ms" }}
            />
            <div
              className="skeleton-text h-5 w-28"
              style={{ animationDelay: "300ms" }}
            />
          </div>
        </div>
      </div>

      {/* Editor skeleton */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-default">
        {/* Toolbar skeleton */}
        <div className="flex items-center gap-1 border-b border-border-subtle px-2 py-1.5">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="skeleton h-8 w-8 rounded-lg"
              style={{ animationDelay: `${350 + i * 50}ms` }}
            />
          ))}
          <div className="mx-1.5 h-5 w-px bg-border-subtle" />
          {[5, 6, 7].map((i) => (
            <div
              key={i}
              className="skeleton h-8 w-8 rounded-lg"
              style={{ animationDelay: `${350 + i * 50}ms` }}
            />
          ))}
        </div>

        {/* Editor body skeleton — staggered lines */}
        <div className="flex-1 space-y-4 p-6">
          <div
            className="skeleton-text h-7 w-2/5"
            style={{ animationDelay: "600ms" }}
          />
          <div
            className="skeleton-text h-4 w-4/5"
            style={{ animationDelay: "650ms" }}
          />
          <div
            className="skeleton-text h-4 w-3/5"
            style={{ animationDelay: "700ms" }}
          />
          <div className="pt-2" />
          <div
            className="skeleton-text h-4 w-full"
            style={{ animationDelay: "750ms" }}
          />
          <div
            className="skeleton-text h-4 w-5/6"
            style={{ animationDelay: "800ms" }}
          />
          <div
            className="skeleton-text h-4 w-2/3"
            style={{ animationDelay: "850ms" }}
          />
          <div className="pt-2" />
          <div
            className="skeleton-text h-6 w-1/4"
            style={{ animationDelay: "900ms" }}
          />
          <div
            className="skeleton-text h-4 w-4/5"
            style={{ animationDelay: "950ms" }}
          />
          <div
            className="skeleton-text h-4 w-3/4"
            style={{ animationDelay: "1000ms" }}
          />
        </div>
      </div>
    </div>
  );
}
