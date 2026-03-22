export default function SettingsLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="skeleton h-9 w-48" />
        <div className="skeleton-text mt-3 h-5 w-72" />
      </div>

      <div className="max-w-2xl">
        <div className="rounded-xl border border-border-default bg-card p-6">
          <div className="skeleton-text mb-6 h-5 w-32" />
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div>
                <div className="skeleton-text h-4 w-28" />
                <div className="skeleton-text mt-1 h-3 w-52" />
              </div>
            </div>
            <div
              className="skeleton h-8 w-full rounded-lg"
              style={{ animationDelay: "100ms" }}
            />
            <div
              className="skeleton h-8 w-24 rounded-lg"
              style={{ animationDelay: "200ms" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
