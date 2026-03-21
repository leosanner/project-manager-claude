export default function ProjectLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Back link skeleton */}
      <div className="mb-6 flex items-center gap-1.5">
        <div className="skeleton-text h-4 w-4 rounded-full" />
        <div className="skeleton-text h-4 w-32" />
      </div>

      {/* Header skeleton */}
      <div className="mb-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="skeleton h-9 w-60" />
            <div
              className="skeleton-text mt-3 h-5 w-28"
              style={{ animationDelay: "80ms" }}
            />
          </div>
          <div
            className="skeleton h-10 w-36 rounded-lg"
            style={{ animationDelay: "120ms" }}
          />
        </div>
      </div>

      {/* Feature grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-border-default bg-card p-0"
          >
            {/* Left accent bar */}
            <div
              className="skeleton absolute left-0 top-0 h-full w-1 rounded-none"
              style={{ animationDelay: `${i * 100}ms` }}
            />
            {/* Card content */}
            <div className="p-4">
              <div
                className="skeleton-text h-5 w-3/5"
                style={{ animationDelay: `${i * 100 + 40}ms` }}
              />
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div
                  className="skeleton-text h-5 w-16"
                  style={{ animationDelay: `${i * 100 + 80}ms` }}
                />
                <div
                  className="skeleton-text h-4 w-20"
                  style={{ animationDelay: `${i * 100 + 120}ms` }}
                />
              </div>
              <div
                className="skeleton-text mt-4 h-3 w-24"
                style={{ animationDelay: `${i * 100 + 160}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
