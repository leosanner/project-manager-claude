"use client";

import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-fg-primary">
          Project Manager
        </h1>
        <h2 className="text-xl text-fg-secondary">Sign in</h2>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleSignIn}
        >
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}
