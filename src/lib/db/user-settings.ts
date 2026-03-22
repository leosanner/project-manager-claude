import prisma from "./prisma";
import { encrypt, decrypt } from "@/lib/crypto";

export async function getUserOpenAIKey(
  userId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { encryptedOpenAIKey: true },
  });

  if (!user?.encryptedOpenAIKey) return null;

  return decrypt(user.encryptedOpenAIKey);
}

export async function hasOpenAIKey(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { encryptedOpenAIKey: true },
  });

  return user?.encryptedOpenAIKey != null;
}

export async function setUserOpenAIKey(
  userId: string,
  apiKey: string
): Promise<void> {
  const encryptedKey = encrypt(apiKey);

  await prisma.user.update({
    where: { id: userId },
    data: { encryptedOpenAIKey: encryptedKey },
  });
}

export async function removeUserOpenAIKey(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { encryptedOpenAIKey: null },
  });
}
