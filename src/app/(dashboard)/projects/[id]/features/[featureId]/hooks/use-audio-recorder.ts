"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export type RecorderState = "idle" | "recording" | "stopped";

export function useAudioRecorder() {
  const [state, setState] = useState<RecorderState>("idle");
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setAudioBlob(null);
      chunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setState("stopped");
        stopTracks();
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(1000);
      setState("recording");
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    } catch {
      setError(
        "Microphone access denied. Please allow microphone permissions."
      );
      setState("idle");
    }
  }, [stopTracks]);

  const stopRecording = useCallback(() => {
    mediaRecorderRef.current?.stop();
    clearTimer();
  }, [clearTimer]);

  const reset = useCallback(() => {
    setState("idle");
    setDuration(0);
    setAudioBlob(null);
    setError(null);
    clearTimer();
    stopTracks();
  }, [clearTimer, stopTracks]);

  useEffect(() => {
    return () => {
      clearTimer();
      stopTracks();
    };
  }, [clearTimer, stopTracks]);

  return {
    state,
    duration,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    reset,
  };
}
