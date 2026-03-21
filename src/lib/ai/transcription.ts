import OpenAI from "openai";

let openai: OpenAI | null = null;

function getClient() {
  if (!openai) {
    openai = new OpenAI();
  }
  return openai;
}

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string
): Promise<string> {
  const file = new File([new Uint8Array(audioBuffer)], filename, {
    type: "audio/webm",
  });

  const response = await getClient().audio.transcriptions.create({
    model: "whisper-1",
    file,
  });

  return response.text;
}
