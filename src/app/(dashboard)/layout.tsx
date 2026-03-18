import { getSessionOrThrow } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "./components/sign-out-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSessionOrThrow();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-semibold">Project Manager</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {user.name}
            </span>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
