import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "@/lib/auth/session";
import { transcribeAudio } from "@/lib/ai/transcription";
import { structureTranscription } from "@/lib/ai/structuring";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB — Whisper API limit

export async function POST(request: NextRequest) {
  try {
    await getSessionOrThrow();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const audioFile = formData.get("audio") as File | null;

  if (!audioFile) {
    return NextResponse.json(
      { error: "No audio file provided" },
      { status: 400 }
    );
  }

  if (audioFile.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: "Audio file too large (max 25MB)" },
      { status: 400 }
    );
  }

  try {
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const transcription = await transcribeAudio(
      audioBuffer,
      audioFile.name || "recording.webm"
    );

    if (!transcription.trim()) {
      return NextResponse.json(
        { error: "No speech detected in the recording" },
        { status: 422 }
      );
    }

    const markdown = await structureTranscription(transcription);

    return NextResponse.json({ transcription, markdown });
  } catch (error) {
    console.error("AI pipeline error:", error);
    return NextResponse.json(
      { error: "Failed to process audio. Please try again." },
      { status: 500 }
    );
  }
}
