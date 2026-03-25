import prisma from "./prisma";

export async function getProjectFeatures(projectId: string, userId: string) {
  return prisma.feature.findMany({
    where: { projectId, project: { userId } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getProjectById(projectId: string, userId: string) {
  return prisma.project.findFirst({
    where: { id: projectId, userId },
  });
}

export async function getFeature(featureId: string, userId: string) {
  return prisma.feature.findFirst({
    where: { id: featureId, project: { userId } },
    include: { document: true },
  });
}

export async function createFeature(
  projectId: string,
  userId: string,
  data: { title: string; dueDate?: Date | null }
) {
  return prisma.$transaction(async (tx) => {
    const feature = await tx.feature.create({
      data: {
        title: data.title,
        endDate: data.dueDate ?? null,
        project: { connect: { id: projectId, userId } },
        document: { create: {} },
      },
    });
    await tx.projectHistoryEvent.create({
      data: { projectId, eventType: "FEATURE_CREATED", featureTitle: data.title },
    });
    return feature;
  });
}

export async function updateFeatureTitle(
  featureId: string,
  userId: string,
  title: string
) {
  return prisma.feature.update({
    where: { id: featureId, project: { userId } },
    data: { title },
  });
}

export async function updateFeatureDocument(
  featureId: string,
  userId: string,
  markdownContent: string
) {
  const feature = await prisma.feature.findFirst({
    where: { id: featureId, project: { userId } },
    select: { id: true },
  });
  if (!feature) throw new Error("Feature not found");

  return prisma.featureDocument.upsert({
    where: { featureId },
    update: { markdownContent },
    create: { featureId, markdownContent },
  });
}

export async function updateFeaturePriority(
  featureId: string,
  userId: string,
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
) {
  return prisma.feature.update({
    where: { id: featureId, project: { userId } },
    data: { priority },
  });
}

export async function deleteFeature(featureId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const feature = await tx.feature.findFirst({
      where: { id: featureId, project: { userId } },
      select: { title: true, projectId: true },
    });
    if (!feature) throw new Error("Feature not found");
    await tx.feature.delete({ where: { id: featureId } });
    await tx.projectHistoryEvent.create({
      data: {
        projectId: feature.projectId,
        eventType: "FEATURE_DELETED",
        featureTitle: feature.title,
      },
    });
  });
}

export async function concludeFeature(featureId: string, userId: string) {
  return prisma.$transaction(async (tx) => {
    const feature = await tx.feature.findFirst({
      where: { id: featureId, project: { userId } },
      select: { title: true, projectId: true },
    });
    if (!feature) throw new Error("Feature not found");
    await tx.feature.delete({ where: { id: featureId } });
    await tx.projectHistoryEvent.create({
      data: {
        projectId: feature.projectId,
        eventType: "FEATURE_CONCLUDED",
        featureTitle: feature.title,
      },
    });
  });
}

export async function getTotalFeatureCount(userId: string) {
  return prisma.feature.count({
    where: { project: { userId } },
  });
}

export async function getNextUpcomingFeature(userId: string) {
  return prisma.feature.findFirst({
    where: {
      project: { userId },
      endDate: { gte: new Date() },
    },
    select: {
      id: true,
      title: true,
      endDate: true,
      projectId: true,
      project: { select: { name: true } },
    },
    orderBy: { endDate: "asc" },
  });
}

export async function getUserFeaturesWithDueDates(userId: string) {
  return prisma.feature.findMany({
    where: {
      project: { userId },
      endDate: { not: null },
    },
    select: {
      id: true,
      title: true,
      status: true,
      priority: true,
      endDate: true,
      projectId: true,
      project: { select: { name: true } },
    },
    orderBy: { endDate: "asc" },
  });
}
