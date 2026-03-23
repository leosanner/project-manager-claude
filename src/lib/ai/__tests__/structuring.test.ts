// Must use var (not const/let) for jest.mock hoisting to work
// eslint-disable-next-line no-var
var mockInvoke = jest.fn();

jest.mock("@langchain/openai", () => ({
  ChatOpenAI: jest.fn().mockImplementation(() => ({})),
}));

jest.mock("@langchain/core/prompts", () => ({
  ChatPromptTemplate: {
    fromTemplate: jest.fn().mockReturnValue({
      pipe: jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnValue({
          invoke: (...args: unknown[]) => mockInvoke(...args),
        }),
      }),
    }),
  },
}));

jest.mock("@langchain/core/output_parsers", () => ({
  StringOutputParser: jest.fn().mockImplementation(() => ({})),
}));

import { structureTranscription } from "../structuring";

beforeEach(() => {
  jest.clearAllMocks();
  mockInvoke.mockResolvedValue("## Overview\n\nStructured content");
});

describe("structureTranscription", () => {
  it("returns structured markdown from transcription text", async () => {
    const result = await structureTranscription("I want to build a new login page");
    expect(result).toBe("## Overview\n\nStructured content");
  });

  it("passes the transcription to the chain", async () => {
    await structureTranscription("Build a dashboard with charts");
    expect(mockInvoke).toHaveBeenCalledWith({
      transcription: "Build a dashboard with charts",
      language: "English",
    });
  });

  it("propagates LLM errors", async () => {
    mockInvoke.mockRejectedValueOnce(new Error("LLM timeout"));
    await expect(structureTranscription("some text")).rejects.toThrow("LLM timeout");
  });
});
