import { getSessionOrThrow } from "@/lib/auth/session";
import { Navbar } from "./components/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSessionOrThrow();

  return (
    <div className="min-h-screen bg-canvas">
      <Navbar userName={user.name} />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  );
}
