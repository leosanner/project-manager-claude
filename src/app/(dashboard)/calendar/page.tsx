import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserFeaturesWithDueDates } from "@/lib/db/features";
import { MonthCalendar } from "./components/month-calendar";
import { CalendarDaysIcon } from "lucide-react";
import type { CalendarFeature } from "@/types/feature";

export default async function CalendarPage() {
  const { user } = await getSessionOrThrow();
  const features = await getUserFeaturesWithDueDates(user.id);

  const serialized: CalendarFeature[] = features.map((f) => ({
    id: f.id,
    title: f.title,
    status: f.status,
    priority: f.priority,
    dueDate: f.endDate!.toISOString(),
    projectId: f.projectId,
    projectName: f.project.name,
  }));

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
            <CalendarDaysIcon className="h-5 w-5 text-brand" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            <p className="mt-0.5 text-sm text-fg-secondary">
              {serialized.length > 0
                ? `${serialized.length} feature${serialized.length !== 1 ? "s" : ""} with due dates`
                : "No features with due dates yet"}
            </p>
          </div>
        </div>
      </div>

      <MonthCalendar features={serialized} />
    </div>
  );
}
