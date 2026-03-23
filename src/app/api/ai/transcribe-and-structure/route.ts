import { NextRequest, NextResponse } from "next/server";
import { getSessionOrThrow } from "@/lib/auth/session";
import { getUserOpenAIKey } from "@/lib/db/user-settings";
import { transcribeAudio } from "@/lib/ai/transcription";
import { structureTranscription } from "@/lib/ai/structuring";

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB — Whisper API limit

export async function POST(request: NextRequest) {
  let userId: string;
  try {
    const { user } = await getSessionOrThrow();
    userId = user.id;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = await getUserOpenAIKey(userId);
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "OpenAI API key not configured. Please add your key in Settings.",
      },
      { status: 400 }
    );
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
    const { text: transcription, language } = await transcribeAudio(
      audioBuffer,
      audioFile.name || "recording.webm",
      apiKey
    );

    if (!transcription.trim()) {
      return NextResponse.json(
        { error: "No speech detected in the recording" },
        { status: 422 }
      );
    }

    const markdown = await structureTranscription(transcription, apiKey, language);

    return NextResponse.json({ transcription, markdown });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Incorrect API key") ||
        error.message.includes("invalid_api_key"))
    ) {
      return NextResponse.json(
        {
          error:
            "Your OpenAI API key is invalid. Please update it in Settings.",
        },
        { status: 401 }
      );
    }

    console.error("AI pipeline error:", error);
    return NextResponse.json(
      { error: "Failed to process audio. Please try again." },
      { status: 500 }
    );
  }
}
