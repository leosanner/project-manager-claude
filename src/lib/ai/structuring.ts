import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const STRUCTURING_PROMPT = `You are a documentation assistant for a software project management tool.
You receive raw transcribed text from a voice recording and must convert it into well-structured markdown.

Analyze the content and organize it into the most appropriate sections from this set:
- **## Overview** — A brief summary of what was discussed (always include)
- **## Key Points** — Main ideas, decisions, or observations
- **## Tasks / Action Items** — Concrete tasks extracted from the audio (use checkboxes: - [ ] task)
- **## Technical Notes** — Technical details, architecture decisions, code references
- **## Questions / Open Items** — Unresolved questions or items needing follow-up
- **## Notes** — Any additional context that doesn't fit above

Rules:
1. Only include sections that are relevant to the content. Do not add empty sections.
2. Always include an Overview section.
3. Use markdown formatting: headers, bullet points, checkboxes for tasks, bold for emphasis.
4. Preserve the speaker's intent and meaning. Do not invent information.
5. If the transcription mentions specific people, features, deadlines, or priorities, highlight them.
6. Keep the language professional but concise.
7. Output ONLY the markdown content, no preamble or explanation.

Raw transcription:
{transcription}`;

export async function structureTranscription(
  transcription: string
): Promise<string> {
  const model = new ChatOpenAI({
    modelName: "gpt-4o-mini",
    temperature: 0.3,
  });

  const prompt = ChatPromptTemplate.fromTemplate(STRUCTURING_PROMPT);
  const chain = prompt.pipe(model).pipe(new StringOutputParser());

  return chain.invoke({ transcription });
}
