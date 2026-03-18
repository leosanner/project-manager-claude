import prisma from "./prisma";

export async function getUserProjects(userId: string) {
  return prisma.project.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { features: true } } },
  });
}

export async function createProject(
  userId: string,
  data: { name: string }
) {
  return prisma.project.create({
    data: {
      name: data.name,
      userId,
    },
  });
}

export async function updateProjectName(
  projectId: string,
  userId: string,
  name: string
) {
  return prisma.project.update({
    where: { id: projectId, userId },
    data: { name },
  });
}

export async function deleteProject(projectId: string, userId: string) {
  return prisma.project.delete({
    where: { id: projectId, userId },
  });
}
