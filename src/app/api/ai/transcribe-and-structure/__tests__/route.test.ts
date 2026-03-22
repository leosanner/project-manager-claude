/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

/* eslint-disable no-var */
var mockGetSession = jest.fn();
var mockTranscribe = jest.fn();
var mockStructure = jest.fn();
/* eslint-enable no-var */

jest.mock("@/lib/auth/session", () => ({
  getSessionOrThrow: (...args: unknown[]) => mockGetSession(...args),
}));

jest.mock("@/lib/ai/transcription", () => ({
  transcribeAudio: (...args: unknown[]) => mockTranscribe(...args),
}));

jest.mock("@/lib/ai/structuring", () => ({
  structureTranscription: (...args: unknown[]) => mockStructure(...args),
}));

import { POST } from "../route";

function createAudioRequest(audioData = "fake-audio") {
  const blob = new Blob([audioData], { type: "audio/webm" });
  const file = new File([blob], "recording.webm", { type: "audio/webm" });
  const formData = new FormData();
  formData.append("audio", file);

  return new NextRequest("http://localhost:3000/api/ai/transcribe-and-structure", {
    method: "POST",
    body: formData,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetSession.mockResolvedValue({ user: { id: "user-1" } });
  mockTranscribe.mockResolvedValue("transcribed text");
  mockStructure.mockResolvedValue("## Overview\n\nStructured");
});

describe("POST /api/ai/transcribe-and-structure", () => {
  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockRejectedValueOnce(new Error("Unauthorized"));
    const request = createAudioRequest();
    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe("Unauthorized");
  });

  it("returns 400 when no audio file is provided", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/ai/transcribe-and-structure",
      {
        method: "POST",
        body: new FormData(),
      }
    );
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe("No audio file provided");
  });

  it("returns transcription and structured markdown on success", async () => {
    const request = createAudioRequest();
    const response = await POST(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.transcription).toBe("transcribed text");
    expect(data.markdown).toBe("## Overview\n\nStructured");
  });

  it("returns 422 when no speech is detected", async () => {
    mockTranscribe.mockResolvedValueOnce("   ");
    const request = createAudioRequest();
    const response = await POST(request);

    expect(response.status).toBe(422);
    const data = await response.json();
    expect(data.error).toBe("No speech detected in the recording");
  });

  it("returns 500 when pipeline fails", async () => {
    mockTranscribe.mockRejectedValueOnce(new Error("Whisper API down"));
    const request = createAudioRequest();
    const response = await POST(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe("Failed to process audio. Please try again.");
  });
});
