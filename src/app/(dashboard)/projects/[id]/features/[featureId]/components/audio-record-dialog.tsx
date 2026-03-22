"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  MicIcon,
  SquareIcon,
  LoaderIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  SparklesIcon,
} from "lucide-react";
import { useAudioRecorder } from "../hooks/use-audio-recorder";

type PipelineState = "idle" | "recording" | "processing" | "done" | "error";

interface AudioRecordDialogProps {
  onMarkdownReady: (markdown: string) => void;
}

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export function AudioRecordDialog({ onMarkdownReady }: AudioRecordDialogProps) {
  const [open, setOpen] = useState(false);
  const [pipelineState, setPipelineState] = useState<PipelineState>("idle");
  const [resultMarkdown, setResultMarkdown] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    state: recorderState,
    duration,
    audioBlob,
    error: recorderError,
    startRecording,
    stopRecording,
    reset: resetRecorder,
  } = useAudioRecorder();

  const shouldAutoProcess = useRef(false);

  const processAudio = useCallback(
    async (blob: Blob) => {
      try {
        setPipelineState("processing");
        const formData = new FormData();
        formData.append("audio", blob, "recording.webm");

        const response = await fetch("/api/ai/transcribe-and-structure", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Processing failed");
        }

        const data = await response.json();
        setResultMarkdown(data.markdown);
        setPipelineState("done");
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "An error occurred"
        );
        setPipelineState("error");
      }
    },
    []
  );

  // Auto-process when audioBlob becomes available after stopping
  useEffect(() => {
    if (audioBlob && shouldAutoProcess.current) {
      shouldAutoProcess.current = false;
      processAudio(audioBlob);
    }
  }, [audioBlob, processAudio]);

  const handleStopAndProcess = useCallback(() => {
    shouldAutoProcess.current = true;
    stopRecording();
  }, [stopRecording]);

  const handleClose = useCallback(() => {
    setOpen(false);
    setPipelineState("idle");
    setResultMarkdown(null);
    setErrorMessage(null);
    resetRecorder();
  }, [resetRecorder]);

  const handleInsert = useCallback(() => {
    if (resultMarkdown) {
      onMarkdownReady(resultMarkdown);
      handleClose();
    }
  }, [resultMarkdown, onMarkdownReady, handleClose]);

  const handleRetry = useCallback(() => {
    setPipelineState("idle");
    setResultMarkdown(null);
    setErrorMessage(null);
    resetRecorder();
  }, [resetRecorder]);

  const handleStartRecording = useCallback(async () => {
    const started = await startRecording();
    if (started) {
      setPipelineState("recording");
    }
  }, [startRecording]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            title="Record audio to generate markdown"
          />
        }
      >
        <MicIcon className="h-3.5 w-3.5" />
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 text-brand" />
            Voice to Markdown
          </DialogTitle>
          <DialogDescription>
            Record your thoughts and we&apos;ll structure them into markdown.
          </DialogDescription>
        </DialogHeader>

        <div className="flex min-h-[160px] flex-col items-center justify-center gap-4 py-4">
          <AnimatePresence mode="wait">
            {/* Idle state */}
            {pipelineState === "idle" && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-3"
              >
                {recorderError && (
                  <p className="text-center text-xs text-danger">
                    {recorderError}
                  </p>
                )}
                <button
                  onClick={handleStartRecording}
                  className="group flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 transition-all hover:bg-brand/20 hover:scale-105 active:scale-95"
                >
                  <MicIcon className="h-7 w-7 text-brand transition-transform group-hover:scale-110" />
                </button>
                <p className="text-sm text-fg-secondary">
                  Click to start recording
                </p>
              </motion.div>
            )}

            {/* Recording state */}
            {pipelineState === "recording" && (
              <motion.div
                key="recording"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    className="h-2.5 w-2.5 rounded-full bg-danger"
                    animate={{
                      scale: [1, 1.4, 1],
                      opacity: [1, 0.6, 1],
                    }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-fg-primary">
                    Recording
                  </span>
                </div>
                <span className="font-mono text-2xl font-light tabular-nums text-fg-primary">
                  {formatDuration(duration)}
                </span>
                <button
                  onClick={handleStopAndProcess}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-danger/10 transition-all hover:bg-danger/20 hover:scale-105 active:scale-95"
                >
                  <SquareIcon className="h-5 w-5 fill-danger text-danger" />
                </button>
                <p className="text-xs text-fg-secondary">Click to stop</p>
              </motion.div>
            )}

            {/* Processing state */}
            {pipelineState === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-3"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <LoaderIcon className="h-8 w-8 text-brand" />
                </motion.div>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-sm font-medium text-fg-primary">
                    Processing audio...
                  </p>
                  <p className="text-xs text-fg-secondary">
                    Transcribing and structuring your content
                  </p>
                </div>
              </motion.div>
            )}

            {/* Done state */}
            {pipelineState === "done" && resultMarkdown && (
              <motion.div
                key="done"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex w-full flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 text-success">
                  <CheckCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">Content ready</span>
                </div>
                <div className="max-h-[200px] w-full overflow-y-auto rounded-lg border border-border-subtle bg-subtle/50 p-3">
                  <pre className="whitespace-pre-wrap text-xs text-fg-secondary">
                    {resultMarkdown.slice(0, 500)}
                    {resultMarkdown.length > 500 && "..."}
                  </pre>
                </div>
              </motion.div>
            )}

            {/* Error state */}
            {pipelineState === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="flex items-center gap-2 text-danger">
                  <AlertCircleIcon className="h-5 w-5" />
                  <span className="text-sm font-medium">
                    Something went wrong
                  </span>
                </div>
                <p className="text-center text-xs text-fg-secondary">
                  {errorMessage}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          {pipelineState === "done" && (
            <Button onClick={handleInsert} className="gap-1.5">
              <SparklesIcon className="h-3.5 w-3.5" />
              Insert into editor
            </Button>
          )}
          {pipelineState === "error" && (
            <Button onClick={handleRetry} variant="outline">
              Try again
            </Button>
          )}
          {recorderState === "stopped" && pipelineState === "idle" && (
            <Button
              onClick={() => audioBlob && processAudio(audioBlob)}
              className="gap-1.5"
            >
              <SparklesIcon className="h-3.5 w-3.5" />
              Process recording
            </Button>
          )}
          {(pipelineState === "idle" || pipelineState === "error") && (
            <DialogClose render={<Button variant="outline" />}>
              Cancel
            </DialogClose>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
