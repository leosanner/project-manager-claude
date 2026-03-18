"use client";

import { authClient } from "@/lib/auth/auth-client";

export default function SignInPage() {
  const handleSignIn = () => {
    authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6 text-center">
        <h1 className="text-2xl font-bold">Project Manager</h1>
        <h2 className="text-xl">Sign in</h2>
        <button
          onClick={handleSignIn}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
