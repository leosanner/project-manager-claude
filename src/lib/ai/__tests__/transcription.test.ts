import { transcribeAudio } from "../transcription";

jest.mock("openai", () => {
  const mockCreate = jest.fn().mockResolvedValue({ text: "Hello world" });
  return jest.fn().mockImplementation(() => ({
    audio: {
      transcriptions: {
        create: mockCreate,
      },
    },
  }));
});

import OpenAI from "openai";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mockOpenAI = new OpenAI() as jest.Mocked<Record<string, any>>;
const mockCreate = mockOpenAI.audio.transcriptions.create;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("transcribeAudio", () => {
  it("calls Whisper API with correct parameters", async () => {
    const audioBuffer = Buffer.from("fake-audio-data");
    await transcribeAudio(audioBuffer, "recording.webm");

    expect(mockCreate).toHaveBeenCalledTimes(1);
    const callArgs = mockCreate.mock.calls[0][0];
    expect(callArgs.model).toBe("whisper-1");
    expect(callArgs.file).toBeInstanceOf(File);
    expect(callArgs.file.name).toBe("recording.webm");
  });

  it("returns the transcribed text", async () => {
    const result = await transcribeAudio(Buffer.from("audio"), "test.webm");
    expect(result).toBe("Hello world");
  });

  it("propagates API errors", async () => {
    mockCreate.mockRejectedValueOnce(new Error("API rate limit exceeded"));
    await expect(transcribeAudio(Buffer.from("audio"), "test.webm")).rejects.toThrow(
      "API rate limit exceeded"
    );
  });
});
