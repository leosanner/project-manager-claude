export type FeatureSummary = {
  id: string;
  title: string;
  status: "PLANNED" | "IN_PROGRESS" | "DONE" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt: string;
  updatedAt: string;
};

export type FeatureDetail = FeatureSummary & {
  document: {
    id: string;
    markdownContent: string;
  } | null;
};
