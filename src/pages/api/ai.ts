import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import { streamText, type CoreMessage } from "ai";

export const POST: APIRoute = async ({ request }) => {
  const openai = createOpenAI({
    compatibility: "strict",
    apiKey: import.meta.env.OPENAI_API_KEY,
  });
  const json = await request.json();

  const { messages } = json as { messages: CoreMessage[] };

  if (messages.length) {
    const response = streamText({
      model: openai("gpt-4o"),
      messages,
    });

    return response.toDataStreamResponse();
  }

  return new Response(null, { status: 400 });
};
