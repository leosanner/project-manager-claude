/**
 * @jest-environment node
 */

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

jest.mock("@/lib/auth/session", () => ({
  getSessionOrThrow: jest.fn(),
}));

jest.mock("@/lib/db/projects", () => ({
  createProject: jest.fn(),
  updateProjectName: jest.fn(),
  deleteProject: jest.fn(),
}));

import { revalidatePath } from "next/cache";
import { getSessionOrThrow } from "@/lib/auth/session";
import {
  createProject,
  updateProjectName,
  deleteProject,
} from "@/lib/db/projects";
import {
  createProjectAction,
  updateProjectNameAction,
  deleteProjectAction,
} from "../actions";
import type { ActionState } from "../actions";

const mockGetSession = getSessionOrThrow as jest.Mock;
const mockCreateProject = createProject as jest.Mock;
const mockUpdateProjectName = updateProjectName as jest.Mock;
const mockDeleteProject = deleteProject as jest.Mock;
const mockRevalidatePath = revalidatePath as jest.Mock;

const initialState: ActionState = { success: false };

function makeFormData(entries: Record<string, string>) {
  const fd = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    fd.set(key, value);
  }
  return fd;
}

describe("dashboard actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetSession.mockResolvedValue({
      user: { id: "user-1" },
      session: { id: "session-1" },
    });
  });

  describe("createProjectAction", () => {
    it("creates a project and revalidates", async () => {
      mockCreateProject.mockResolvedValue({ id: "p1" });

      const result = await createProjectAction(
        initialState,
        makeFormData({ name: "My Project" })
      );

      expect(result).toEqual({ success: true });
      expect(mockCreateProject).toHaveBeenCalledWith("user-1", {
        name: "My Project",
      });
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    });

    it("returns error for empty name", async () => {
      const result = await createProjectAction(
        initialState,
        makeFormData({ name: "  " })
      );

      expect(result).toEqual({
        success: false,
        error: "Project name is required",
      });
      expect(mockCreateProject).not.toHaveBeenCalled();
    });

    it("returns error on failure", async () => {
      mockCreateProject.mockRejectedValue(new Error("DB error"));

      const result = await createProjectAction(
        initialState,
        makeFormData({ name: "Test" })
      );

      expect(result).toEqual({
        success: false,
        error: "Failed to create project",
      });
    });
  });

  describe("updateProjectNameAction", () => {
    it("updates the project name and revalidates", async () => {
      mockUpdateProjectName.mockResolvedValue({ id: "p1" });

      const result = await updateProjectNameAction(
        initialState,
        makeFormData({ projectId: "p1", name: "Renamed" })
      );

      expect(result).toEqual({ success: true });
      expect(mockUpdateProjectName).toHaveBeenCalledWith(
        "p1",
        "user-1",
        "Renamed"
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    });

    it("returns error for missing fields", async () => {
      const result = await updateProjectNameAction(
        initialState,
        makeFormData({ projectId: "p1", name: "" })
      );

      expect(result).toEqual({
        success: false,
        error: "Project ID and name are required",
      });
    });
  });

  describe("deleteProjectAction", () => {
    it("deletes the project and revalidates", async () => {
      mockDeleteProject.mockResolvedValue({ id: "p1" });

      const result = await deleteProjectAction(
        initialState,
        makeFormData({ projectId: "p1" })
      );

      expect(result).toEqual({ success: true });
      expect(mockDeleteProject).toHaveBeenCalledWith("p1", "user-1");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard");
    });

    it("returns error for missing projectId", async () => {
      const result = await deleteProjectAction(
        initialState,
        makeFormData({})
      );

      expect(result).toEqual({
        success: false,
        error: "Project ID is required",
      });
    });
  });
});
