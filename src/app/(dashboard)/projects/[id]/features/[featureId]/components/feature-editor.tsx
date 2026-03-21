"use client";

import { useState, useActionState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { SaveIcon, CheckCircleIcon } from "lucide-react";
import { saveDocumentAction, type ActionState } from "../../../actions";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const initialState: ActionState = { success: false };

export function FeatureEditor({
  featureId,
  projectId,
  initialContent,
}: {
  featureId: string;
  projectId: string;
  initialContent: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);

  const [state, formAction, isSaving] = useActionState(
    async (prevState: ActionState, formData: FormData) => {
      const result = await saveDocumentAction(prevState, formData);
      if (result.success) {
        setIsDirty(false);
      }
      return result;
    },
    initialState
  );

  function handleChange(value: string | undefined) {
    const newContent = value ?? "";
    setContent(newContent);
    setIsDirty(newContent !== initialContent);
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-border-subtle/50 bg-background shadow-2xl dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border-subtle/30 bg-subtle/30 px-4 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-fg-primary">Document</h2>
          {isDirty && (
            <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
              Unsaved changes
            </span>
          )}
          {state.success && !isDirty && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
              <CheckCircleIcon className="h-3 w-3" />
              Saved
            </span>
          )}
          {state.error && (
            <span className="rounded-full bg-danger/10 px-2 py-0.5 text-[10px] font-medium text-danger">
              {state.error}
            </span>
          )}
        </div>
        <form action={formAction}>
          <input type="hidden" name="featureId" value={featureId} />
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="content" value={content} />
          <Button
            type="submit"
            disabled={isSaving || !isDirty}
            size="sm"
            className="gap-1.5"
          >
            <SaveIcon className="h-3.5 w-3.5" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </form>
      </div>

      {/* Editor — fills remaining space */}
      <div className="min-h-0 flex-1" data-color-mode="auto">
        <MDEditor
          value={content}
          onChange={handleChange}
          height="100%"
          visibleDragbar={false}
          style={{ height: "100%" }}
        />
      </div>
    </div>
  );
}
