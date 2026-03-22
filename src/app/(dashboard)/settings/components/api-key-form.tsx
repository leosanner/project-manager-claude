"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  KeyIcon,
  Trash2Icon,
} from "lucide-react";
import {
  saveApiKeyAction,
  removeApiKeyAction,
  type ActionState,
} from "../actions";

const initialState: ActionState = { success: false };

export function ApiKeyForm({ hasExistingKey }: { hasExistingKey: boolean }) {
  const [showKey, setShowKey] = useState(false);

  const [saveState, saveAction, isSaving] = useActionState(
    saveApiKeyAction,
    initialState
  );

  const [removeState, removeAction, isRemoving] = useActionState(
    removeApiKeyAction,
    initialState
  );

  const saved = saveState.success;
  const removed = removeState.success;
  const keyConfigured = (hasExistingKey || saved) && !removed;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10">
          <KeyIcon className="h-5 w-5 text-brand" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-fg-primary">
            OpenAI API Key
          </h3>
          <p className="text-xs text-fg-secondary">
            Required for voice-to-markdown AI features
          </p>
        </div>
        {keyConfigured && (
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <CheckCircleIcon className="h-3 w-3" />
            Configured
          </span>
        )}
      </div>

      <form action={saveAction} className="space-y-3">
        <div className="relative">
          <Input
            name="apiKey"
            type={showKey ? "text" : "password"}
            placeholder={
              keyConfigured ? "Enter new key to update" : "sk-..."
            }
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-fg-muted transition-colors hover:text-fg-primary"
          >
            {showKey ? (
              <EyeOffIcon className="h-3.5 w-3.5" />
            ) : (
              <EyeIcon className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <Button type="submit" size="sm" disabled={isSaving}>
            {isSaving
              ? "Saving..."
              : keyConfigured
                ? "Update key"
                : "Save key"}
          </Button>

          {keyConfigured && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isRemoving}
              className="text-danger hover:text-danger"
              onClick={() => {
                const fd = new FormData();
                removeAction(fd);
              }}
            >
              <Trash2Icon className="mr-1 h-3.5 w-3.5" />
              {isRemoving ? "Removing..." : "Remove"}
            </Button>
          )}
        </div>
      </form>

      {saveState.error && (
        <p className="text-xs text-danger">{saveState.error}</p>
      )}
      {removeState.error && (
        <p className="text-xs text-danger">{removeState.error}</p>
      )}
      {saved && (
        <p className="text-xs text-success">API key saved successfully.</p>
      )}
      {removed && (
        <p className="text-xs text-success">API key removed.</p>
      )}

      <p className="text-xs text-fg-muted">
        Your key is encrypted and stored securely. Get your API key from{" "}
        <a
          href="https://platform.openai.com/api-keys"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline underline-offset-2 hover:text-brand/80"
        >
          platform.openai.com
        </a>
        .
      </p>
    </div>
  );
}
