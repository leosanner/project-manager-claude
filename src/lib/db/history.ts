import prisma from "./prisma";
import type { ProjectHistoryEventType } from "@/generated/prisma";

export async function createHistoryEvent(
  projectId: string,
  eventType: ProjectHistoryEventType,
  featureTitle: string
) {
  return prisma.projectHistoryEvent.create({
    data: { projectId, eventType, featureTitle },
  });
}

export async function getProjectHistory(projectId: string, userId: string) {
  return prisma.projectHistoryEvent.findMany({
    where: { projectId, project: { userId } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
