export type FeatureSummary = {
  id: string;
  title: string;
  status: "PLANNED" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FeatureDetail = FeatureSummary & {
  document: {
    id: string;
    markdownContent: string;
  } | null;
};

export type CalendarFeature = {
  id: string;
  title: string;
  status: "PLANNED" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  dueDate: string;
  projectId: string;
  projectName: string;
};
