export default function DashboardLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      {/* Page header skeleton */}
      <div className="mb-10">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="skeleton h-9 w-72" />
            <div className="skeleton-text mt-3 h-5 w-56" />
          </div>
          <div className="skeleton h-10 w-36 rounded-lg" />
        </div>

        {/* Stats bar skeleton */}
        <div className="flex gap-6 border-b border-border-subtle pb-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className="skeleton h-8 w-8 rounded-lg"
                style={{ animationDelay: `${i * 150}ms` }}
              />
              <div>
                <div
                  className="skeleton-text h-5 w-8"
                  style={{ animationDelay: `${i * 150 + 50}ms` }}
                />
                <div
                  className="skeleton-text mt-1 h-3 w-14"
                  style={{ animationDelay: `${i * 150 + 100}ms` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl border border-border-default bg-card p-0"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Left accent bar */}
            <div className="skeleton absolute left-0 top-0 h-full w-1 rounded-none" />
            {/* Card content */}
            <div className="p-4">
              <div
                className="skeleton-text h-5 w-3/5"
                style={{ animationDelay: `${i * 80 + 40}ms` }}
              />
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="skeleton h-6 w-16 rounded-full"
                  style={{ animationDelay: `${i * 80 + 80}ms` }}
                />
                <div
                  className="skeleton-text h-4 w-20"
                  style={{ animationDelay: `${i * 80 + 120}ms` }}
                />
              </div>
              <div
                className="skeleton-text mt-4 h-3 w-24"
                style={{ animationDelay: `${i * 80 + 160}ms` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
