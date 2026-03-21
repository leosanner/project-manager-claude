export default function CalendarLoading() {
  return (
    <div className="flex h-[calc(100dvh-6.5rem)] animate-in fade-in flex-col duration-300">
      {/* Calendar header skeleton */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="skeleton h-9 w-9 rounded-lg" />
          <div className="skeleton-text h-7 w-44" />
          <div
            className="skeleton h-9 w-9 rounded-lg"
            style={{ animationDelay: "100ms" }}
          />
        </div>
        <div
          className="skeleton h-9 w-20 rounded-lg"
          style={{ animationDelay: "150ms" }}
        />
      </div>

      {/* Day-of-week headers */}
      <div className="mb-1 grid grid-cols-7 gap-px">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => (
          <div
            key={day}
            className="flex items-center justify-center py-2"
          >
            <div
              className="skeleton-text h-4 w-8"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          </div>
        ))}
      </div>

      {/* Calendar grid skeleton — 5 rows x 7 cols */}
      <div className="grid flex-1 grid-cols-7 grid-rows-5 gap-px overflow-hidden rounded-lg border border-border-default">
        {Array.from({ length: 35 }).map((_, i) => {
          const row = Math.floor(i / 7);
          const col = i % 7;
          const delay = (row + col) * 30;
          const hasEvent = [3, 10, 17, 22, 28].includes(i);

          return (
            <div
              key={i}
              className="flex flex-col gap-1 border-border-subtle bg-card p-2"
            >
              <div
                className="skeleton-text h-4 w-5 self-end"
                style={{ animationDelay: `${delay}ms` }}
              />
              {hasEvent && (
                <div
                  className="skeleton mt-1 h-5 w-full rounded-md"
                  style={{ animationDelay: `${delay + 60}ms` }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
