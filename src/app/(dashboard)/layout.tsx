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
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
              <LayoutGridIcon className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Project Manager
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm font-medium text-fg-secondary sm:block">
              {user.name}
            </span>
            <div className="h-5 w-px bg-border-muted" />
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
