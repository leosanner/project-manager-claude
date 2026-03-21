import Link from "next/link";
import { PencilLineIcon } from "lucide-react";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "/signin", label: "Sign In" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-border-subtle bg-subtle">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-2 md:items-start">
          <div className="flex items-center gap-2">
            <PencilLineIcon className="h-4 w-4 text-brand" />
            <span className="text-sm font-semibold text-fg-primary">
              Project Manager
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-fg-muted">
            &copy; {new Date().getFullYear()} Project Manager
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {footerLinks.map((link) =>
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-fg-muted transition-colors hover:text-brand"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-fg-muted transition-colors hover:text-brand"
              >
                {link.label}
              </a>
            )
          )}
        </div>
      </div>
    </footer>
  );
}
