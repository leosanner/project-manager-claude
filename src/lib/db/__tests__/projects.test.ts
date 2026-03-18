/**
 * @jest-environment node
 */

jest.mock("@/lib/db/prisma", () => ({
  __esModule: true,
  default: {
    project: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import prisma from "@/lib/db/prisma";
import {
  getUserProjects,
  createProject,
  updateProjectName,
  deleteProject,
} from "../projects";

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("projects data access", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserProjects", () => {
    it("queries projects for the given user ordered by updatedAt desc", async () => {
      const fakeProjects = [{ id: "p1", name: "Project 1" }];
      (mockPrisma.project.findMany as jest.Mock).mockResolvedValue(
        fakeProjects
      );

      const result = await getUserProjects("user-1");

      expect(mockPrisma.project.findMany).toHaveBeenCalledWith({
        where: { userId: "user-1" },
        orderBy: { updatedAt: "desc" },
        include: { _count: { select: { features: true } } },
      });
      expect(result).toEqual(fakeProjects);
    });
  });

  describe("createProject", () => {
    it("creates a project with the given name and userId", async () => {
      const fakeProject = { id: "p1", name: "New Project" };
      (mockPrisma.project.create as jest.Mock).mockResolvedValue(fakeProject);

      const result = await createProject("user-1", { name: "New Project" });

      expect(mockPrisma.project.create).toHaveBeenCalledWith({
        data: { name: "New Project", userId: "user-1" },
      });
      expect(result).toEqual(fakeProject);
    });
  });

  describe("updateProjectName", () => {
    it("updates project name scoped to the user", async () => {
      const fakeProject = { id: "p1", name: "Updated" };
      (mockPrisma.project.update as jest.Mock).mockResolvedValue(fakeProject);

      const result = await updateProjectName("p1", "user-1", "Updated");

      expect(mockPrisma.project.update).toHaveBeenCalledWith({
        where: { id: "p1", userId: "user-1" },
        data: { name: "Updated" },
      });
      expect(result).toEqual(fakeProject);
    });
  });

  describe("deleteProject", () => {
    it("deletes project scoped to the user", async () => {
      (mockPrisma.project.delete as jest.Mock).mockResolvedValue({
        id: "p1",
      });

      await deleteProject("p1", "user-1");

      expect(mockPrisma.project.delete).toHaveBeenCalledWith({
        where: { id: "p1", userId: "user-1" },
      });
    });
  });
});
