"use server";

import { revalidatePath } from "next/cache";
import { getSessionOrThrow } from "@/lib/auth/session";
import {
  createProject,
  updateProjectName,
  deleteProject,
} from "@/lib/db/projects";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function createProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = (formData.get("name") as string)?.trim();
  if (!name) {
    return { success: false, error: "Project name is required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await createProject(user.id, { name });
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create project" };
  }
}

export async function updateProjectNameAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const projectId = formData.get("projectId") as string;
  const name = (formData.get("name") as string)?.trim();

  if (!projectId || !name) {
    return { success: false, error: "Project ID and name are required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await updateProjectName(projectId, user.id, name);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update project" };
  }
}

export async function deleteProjectAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const projectId = formData.get("projectId") as string;

  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await deleteProject(projectId, user.id);
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to delete project" };
  }
}
