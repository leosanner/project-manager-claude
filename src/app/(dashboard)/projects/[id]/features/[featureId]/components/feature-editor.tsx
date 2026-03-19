"use client";

import { useState, useActionState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
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
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Document</h2>
        <div className="flex items-center gap-2">
          {state.error && (
            <span className="text-sm text-danger">{state.error}</span>
          )}
          {state.success && !isDirty && (
            <span className="text-sm text-muted-foreground">Saved</span>
          )}
          <form action={formAction}>
            <input type="hidden" name="featureId" value={featureId} />
            <input type="hidden" name="projectId" value={projectId} />
            <input type="hidden" name="content" value={content} />
            <Button type="submit" disabled={isSaving || !isDirty} size="sm">
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </form>
        </div>
      </div>
      <div data-color-mode="auto">
        <MDEditor
          value={content}
          onChange={handleChange}
          height={500}
        />
      </div>
    </div>
  );
}
