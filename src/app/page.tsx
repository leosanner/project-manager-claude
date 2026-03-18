import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-canvas text-fg-primary">
      <h1 className="text-3xl font-semibold">Project Manager</h1>
      <p className="text-fg-secondary">Coming soon</p>
      <ThemeToggle />
    </div>
  );
}
