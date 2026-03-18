"use client";

import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { LogOutIcon } from "lucide-react";

export function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/signin");
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      <LogOutIcon />
      Sign out
    </Button>
  );
}
