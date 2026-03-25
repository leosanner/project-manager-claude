"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSessionOrThrow } from "@/lib/auth/session";
import {
  createFeature,
  updateFeatureTitle,
  updateFeaturePriority,
  updateFeatureDocument,
  deleteFeature,
  concludeFeature,
} from "@/lib/db/features";
import { deleteProject } from "@/lib/db/projects";

export type ActionState = {
  success: boolean;
  error?: string;
};

export async function createFeatureAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const title = (formData.get("title") as string)?.trim();
  const projectId = formData.get("projectId") as string;
  const dueDateStr = formData.get("dueDate") as string | null;

  if (!title) {
    return { success: false, error: "Feature title is required" };
  }
  if (title.length > 30) {
    return { success: false, error: "Feature title must be 30 characters or less" };
  }
  if (!projectId) {
    return { success: false, error: "Project ID is required" };
  }

  const dueDate = dueDateStr ? new Date(dueDateStr) : null;

  try {
    const { user } = await getSessionOrThrow();
    await createFeature(projectId, user.id, { title, dueDate });
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to create feature" };
  }
}

export async function updateFeatureTitleAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const featureId = formData.get("featureId") as string;
  const title = (formData.get("title") as string)?.trim();
  const projectId = formData.get("projectId") as string;

  if (!featureId || !title) {
    return { success: false, error: "Feature ID and title are required" };
  }
  if (title.length > 30) {
    return { success: false, error: "Feature title must be 30 characters or less" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await updateFeatureTitle(featureId, user.id, title);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update feature" };
  }
}

const VALID_PRIORITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

export async function updateFeaturePriorityAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const featureId = formData.get("featureId") as string;
  const priority = formData.get("priority") as string;
  const projectId = formData.get("projectId") as string;

  if (!featureId || !priority) {
    return { success: false, error: "Feature ID and priority are required" };
  }
  if (!VALID_PRIORITIES.includes(priority as (typeof VALID_PRIORITIES)[number])) {
    return { success: false, error: "Invalid priority value" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await updateFeaturePriority(featureId, user.id, priority as (typeof VALID_PRIORITIES)[number]);
    revalidatePath(`/projects/${projectId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to update priority" };
  }
}

export async function deleteFeatureAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const featureId = formData.get("featureId") as string;
  const projectId = formData.get("projectId") as string;

  if (!featureId) {
    return { success: false, error: "Feature ID is required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await deleteFeature(featureId, user.id);
  } catch {
    return { success: false, error: "Failed to delete feature" };
  }

  redirect(`/projects/${projectId}`);
}

export async function concludeFeatureAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const featureId = formData.get("featureId") as string;
  const projectId = formData.get("projectId") as string;

  if (!featureId) {
    return { success: false, error: "Feature ID is required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await concludeFeature(featureId, user.id);
  } catch {
    return { success: false, error: "Failed to conclude feature" };
  }

  redirect(`/projects/${projectId}`);
}

export async function saveDocumentAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const featureId = formData.get("featureId") as string;
  const content = formData.get("content") as string;
  const projectId = formData.get("projectId") as string;

  if (!featureId) {
    return { success: false, error: "Feature ID is required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await updateFeatureDocument(featureId, user.id, content ?? "");
    revalidatePath(`/projects/${projectId}/features/${featureId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save document" };
  }
}

export async function toggleCheckboxAction(
  featureId: string,
  projectId: string,
  updatedContent: string
): Promise<ActionState> {
  if (!featureId) {
    return { success: false, error: "Feature ID is required" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await updateFeatureDocument(featureId, user.id, updatedContent);
    revalidatePath(`/projects/${projectId}/features/${featureId}`);
    return { success: true };
  } catch {
    return { success: false, error: "Failed to toggle checkbox" };
  }
}

export async function deleteProjectFromPageAction(
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
  } catch {
    return { success: false, error: "Failed to delete project" };
  }

  redirect("/dashboard");
}
