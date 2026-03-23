import OpenAI from "openai";

export interface TranscriptionResult {
  text: string;
  language: string;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string,
  apiKey: string
): Promise<TranscriptionResult> {
  const client = new OpenAI({ apiKey });

  const file = new File([new Uint8Array(audioBuffer)], filename, {
    type: "audio/webm",
  });

  const response = await client.audio.transcriptions.create({
    model: "whisper-1",
    file,
    response_format: "verbose_json",
  });

  return {
    text: response.text,
    language: response.language,
  };
}
