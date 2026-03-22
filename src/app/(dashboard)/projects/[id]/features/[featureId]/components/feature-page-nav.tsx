"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EyeIcon, PencilIcon } from "lucide-react";

const tabs = [
  {
    key: "view" as const,
    label: "View",
    icon: EyeIcon,
    href: (projectId: string, featureId: string) =>
      `/projects/${projectId}/features/${featureId}`,
  },
  {
    key: "edit" as const,
    label: "Edit",
    icon: PencilIcon,
    href: (projectId: string, featureId: string) =>
      `/projects/${projectId}/features/${featureId}/edit`,
  },
];

export function FeaturePageNav({
  projectId,
  featureId,
  activeTab,
}: {
  projectId: string;
  featureId: string;
  activeTab: "view" | "edit";
}) {
  const pathname = usePathname();

  return (
    <nav className="mb-3 flex shrink-0 items-center">
      <div className="inline-flex items-center gap-0.5 rounded-lg bg-subtle p-0.5">
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;
          const href = tab.href(projectId, featureId);
          const isCurrent = pathname === href;

          return (
            <Link
              key={tab.key}
              href={href}
              aria-current={isCurrent ? "page" : undefined}
              className={`relative inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-background text-fg-primary shadow-sm"
                  : "text-fg-muted hover:text-fg-secondary"
              }`}
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
