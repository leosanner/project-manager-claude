import { getSessionOrThrow } from "@/lib/auth/session";
import { hasOpenAIKey } from "@/lib/db/user-settings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsIcon } from "lucide-react";
import { ApiKeyForm } from "./components/api-key-form";

export default async function SettingsPage() {
  const { user } = await getSessionOrThrow();
  const hasKey = await hasOpenAIKey(user.id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="mt-2 text-base text-fg-secondary">
          Manage your account and integrations
        </p>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Integrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ApiKeyForm hasExistingKey={hasKey} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
