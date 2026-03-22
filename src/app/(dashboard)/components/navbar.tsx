"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import {
  LayoutGridIcon,
  CalendarDaysIcon,
  SettingsIcon,
  PencilLineIcon,
  MenuIcon,
  XIcon,
  LogOutIcon,
  Sun,
  Moon,
  Monitor,
  UserIcon,
  ChevronRightIcon,
} from "lucide-react";
import { authClient } from "@/lib/auth/auth-client";

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutGridIcon,
    description: "Projects overview",
  },
  {
    href: "/calendar",
    label: "Calendar",
    icon: CalendarDaysIcon,
    description: "Schedule & deadlines",
  },
  {
    href: "/settings",
    label: "Settings",
    icon: SettingsIcon,
    description: "API keys & preferences",
  },
];

const themes = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
] as const;

export function Navbar({ userName }: { userName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKey);
      return () => document.removeEventListener("keydown", handleKey);
    }
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  async function handleSignOut() {
    setOpen(false);
    await authClient.signOut();
    router.push("/signin");
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Main bar */}
      <div className="bg-background/70 backdrop-blur-xl border-b border-border-subtle">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center">
              <div className="absolute inset-0 rounded-lg bg-brand/10 transition-all duration-300 group-hover:bg-brand/15 group-hover:scale-110" />
              <PencilLineIcon className="relative h-[18px] w-[18px] text-brand transition-transform duration-300 group-hover:rotate-[-8deg]" />
            </div>
            <span className="text-[15px] font-semibold tracking-[-0.01em] text-fg-primary">
              Project Manager
            </span>
          </Link>

          {/* Right side: compact active page indicator + menu trigger */}
          <div className="flex items-center gap-2">
            {/* Current page pill - subtle context */}
            {navItems.map(
              (item) =>
                pathname.startsWith(item.href) && (
                  <div
                    key={item.href}
                    className="hidden sm:flex items-center gap-1.5 rounded-full bg-brand/8 px-3 py-1 text-xs font-medium text-brand"
                  >
                    <item.icon className="h-3 w-3" />
                    {item.label}
                  </div>
                )
            )}

            {/* Menu button */}
            <button
              ref={buttonRef}
              onClick={() => setOpen(!open)}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-transparent transition-all duration-200 hover:border-border-muted hover:bg-subtle active:scale-95"
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <XIcon className="h-[18px] w-[18px] text-fg-secondary" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90, scale: 0.8 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                  >
                    <MenuIcon className="h-[18px] w-[18px] text-fg-secondary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Popup panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              aria-hidden
            />

            {/* Panel */}
            <motion.div
              ref={panelRef}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{
                duration: 0.2,
                ease: [0.23, 1, 0.32, 1],
              }}
              className="absolute right-4 sm:right-[calc((100vw-72rem)/2+1.5rem)] top-[calc(3.5rem+0.5rem)] z-50 w-[280px] origin-top-right"
            >
              <div className="overflow-hidden rounded-2xl border border-border-subtle bg-background/95 backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]">
                {/* User section */}
                <div className="px-4 pt-4 pb-3 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand/10">
                      <UserIcon className="h-4 w-4 text-brand" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-fg-primary truncate">
                        {userName}
                      </p>
                      <p className="text-[11px] text-fg-muted">Signed in</p>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-2">
                  <p className="px-2 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-muted">
                    Navigation
                  </p>
                  {navItems.map((item, i) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 + i * 0.04, duration: 0.2 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 ${
                            isActive
                              ? "bg-brand/8 text-brand"
                              : "text-fg-secondary hover:bg-subtle hover:text-fg-primary"
                          }`}
                        >
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                              isActive
                                ? "bg-brand/15"
                                : "bg-muted group-hover:bg-border-subtle"
                            }`}
                          >
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p
                              className={`text-[11px] ${
                                isActive ? "text-brand/70" : "text-fg-muted"
                              }`}
                            >
                              {item.description}
                            </p>
                          </div>
                          {isActive && (
                            <ChevronRightIcon className="h-3.5 w-3.5 text-brand/50" />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Theme switcher */}
                {mounted && (
                  <div className="p-2 border-t border-border-subtle">
                    <p className="px-2 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-fg-muted">
                      Appearance
                    </p>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.15 }}
                      className="flex items-center gap-1 rounded-xl bg-subtle p-1"
                    >
                      {themes.map(({ value, icon: Icon, label }) => (
                        <button
                          key={value}
                          onClick={() => setTheme(value)}
                          className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-all duration-200 ${
                            theme === value
                              ? "bg-background text-fg-primary shadow-sm"
                              : "text-fg-muted hover:text-fg-secondary"
                          }`}
                          title={label}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span className="hidden sm:inline">{label}</span>
                        </button>
                      ))}
                    </motion.div>
                  </div>
                )}

                {/* Sign out */}
                <div className="p-2 border-t border-border-subtle">
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-fg-secondary transition-all duration-150 hover:bg-danger/8 hover:text-danger"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                      <LogOutIcon className="h-4 w-4" />
                    </div>
                    Sign out
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
