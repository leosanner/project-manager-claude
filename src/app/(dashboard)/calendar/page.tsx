import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserFeaturesWithDueDates } from "@/lib/db/features";
import { MonthCalendar } from "./components/month-calendar";

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
    <div className="flex h-[calc(100dvh-6.5rem)] flex-col">
      <MonthCalendar features={serialized} />
    </div>
  );
}
