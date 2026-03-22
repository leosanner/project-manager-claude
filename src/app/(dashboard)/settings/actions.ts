"use server";

import { revalidatePath } from "next/cache";
import { getSessionOrThrow } from "@/lib/auth/session";
import {
  setUserOpenAIKey,
  removeUserOpenAIKey,
} from "@/lib/db/user-settings";

export type ActionState = { success: boolean; error?: string };

export async function saveApiKeyAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const apiKey = (formData.get("apiKey") as string)?.trim();

  if (!apiKey) {
    return { success: false, error: "API key is required" };
  }

  if (!apiKey.startsWith("sk-")) {
    return { success: false, error: "Invalid API key format" };
  }

  try {
    const { user } = await getSessionOrThrow();
    await setUserOpenAIKey(user.id, apiKey);
    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to save API key" };
  }
}

export async function removeApiKeyAction(
  _prevState: ActionState,
  _formData: FormData
): Promise<ActionState> {
  try {
    const { user } = await getSessionOrThrow();
    await removeUserOpenAIKey(user.id);
    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { success: false, error: "Failed to remove API key" };
  }
}
