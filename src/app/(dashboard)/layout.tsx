import { getSessionOrThrow } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/theme-toggle";
import { SignOutButton } from "./components/sign-out-button";
import { LayoutGridIcon } from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSessionOrThrow();

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 bg-background/80 shadow-header backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <LayoutGridIcon className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              Project Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-fg-secondary sm:block">
              {user.name}
            </span>
            <div className="h-4 w-px bg-border-muted" />
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
