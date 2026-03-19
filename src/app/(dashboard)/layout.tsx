import Link from "next/link";
import { getSessionOrThrow } from "@/lib/auth/session";
import { ThemeToggle } from "@/components/theme-toggle";
import { Sidebar, SidebarMobileToggle, UserAvatar } from "@/components/sidebar";
import {
  LayoutGridIcon,
  CalendarDaysIcon,
  SearchIcon,
  BellIcon,
} from "lucide-react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSessionOrThrow();

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar userName={user.name} userImage={user.image} />
      <div className="flex flex-1 flex-col lg:ml-[220px]">
        <header className="sticky top-0 z-30 bg-background/80 shadow-header backdrop-blur-lg">
          <div className="flex h-16 items-center justify-between px-6">
            {/* Left: brand + mobile toggle */}
            <div className="flex items-center gap-3">
              <SidebarMobileToggle
                userName={user.name}
                userImage={user.image}
              />
              <span className="text-lg font-bold tracking-tight">
                Project Manager
              </span>
            </div>

            {/* Center: inline nav tabs */}
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
              >
                <LayoutGridIcon className="h-4 w-4" />
                Dashboard
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-fg-secondary transition-colors hover:bg-muted hover:text-fg-primary"
              >
                <CalendarDaysIcon className="h-4 w-4" />
                Calendar
              </Link>
            </nav>

            {/* Right: search, bell, avatar, theme */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="h-9 w-48 rounded-lg border border-border-muted bg-subtle pl-9 pr-3 text-sm text-fg-primary placeholder:text-fg-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-muted hover:text-fg-primary"
                aria-label="Notifications"
              >
                <BellIcon className="h-4 w-4" />
              </button>
              <div className="h-5 w-px bg-border-muted" />
              <ThemeToggle />
              <UserAvatar name={user.name} image={user.image} size="sm" />
            </div>
          </div>
        </header>
        <main className="flex-1 px-6 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
