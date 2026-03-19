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
  return prisma.feature.create({
    data: {
      title: data.title,
      endDate: data.dueDate ?? null,
      project: { connect: { id: projectId, userId } },
      document: { create: {} },
    },
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

export async function deleteFeature(featureId: string, userId: string) {
  return prisma.feature.delete({
    where: { id: featureId, project: { userId } },
  });
}
