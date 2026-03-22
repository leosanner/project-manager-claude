import OpenAI from "openai";

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string,
  apiKey: string
): Promise<string> {
  const client = new OpenAI({ apiKey });

  const file = new File([new Uint8Array(audioBuffer)], filename, {
    type: "audio/webm",
  });

  const response = await client.audio.transcriptions.create({
    model: "whisper-1",
    file,
  });

  return response.text;
}
