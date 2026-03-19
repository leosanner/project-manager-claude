"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import {
  LayoutGridIcon,
  CalendarDaysIcon,
  UsersIcon,
  SettingsIcon,
  HelpCircleIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGridIcon },
  { href: "/calendar", label: "Calendar", icon: CalendarDaysIcon },
  { href: "#", label: "Team", icon: UsersIcon, disabled: true },
  { href: "#", label: "Settings", icon: SettingsIcon, disabled: true },
];

function UserAvatar({
  name,
  image,
  size = "md",
}: {
  name: string;
  image?: string | null;
  size?: "sm" | "md";
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";

  if (image) {
    const px = size === "sm" ? 32 : 40;
    return (
      <Image
        src={image}
        alt={name}
        width={px}
        height={px}
        className={`${sizeClass} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex items-center justify-center rounded-full bg-brand font-semibold text-white`}
    >
      {initials}
    </div>
  );
}

function SidebarContent({
  userName,
  userImage,
  onNavigate,
}: {
  userName: string;
  userImage?: string | null;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/signin");
  }

  return (
    <div className="flex h-full flex-col">
      {/* User info */}
      <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-5">
        <UserAvatar name={userName} image={userImage} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-sidebar-foreground">
            {userName}
          </p>
          <p className="text-xs text-fg-muted">Project Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <li key={link.label}>
                {link.disabled ? (
                  <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-muted opacity-50">
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </span>
                ) : (
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      <div className="border-t border-sidebar-border px-3 py-4">
        <ul className="space-y-1">
          <li>
            <span className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg-muted opacity-50">
              <HelpCircleIcon className="h-4 w-4" />
              Help
            </span>
          </li>
          <li>
            <button
              onClick={handleSignOut}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent/50"
            >
              <LogOutIcon className="h-4 w-4" />
              Sign out
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export function Sidebar({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[220px] border-r border-sidebar-border bg-sidebar lg:block">
      <SidebarContent userName={userName} userImage={userImage} />
    </aside>
  );
}

export function SidebarMobileToggle({
  userName,
  userImage,
}: {
  userName: string;
  userImage?: string | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <MenuIcon className="h-5 w-5" />
      </Button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[220px] border-r border-sidebar-border bg-sidebar shadow-xl">
            <div className="flex justify-end p-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <XIcon className="h-5 w-5" />
              </Button>
            </div>
            <SidebarContent
              userName={userName}
              userImage={userImage}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

export { UserAvatar };
