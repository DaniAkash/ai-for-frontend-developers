import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: import.meta.env.OPENAI_API_KEY,
});

export const POST: APIRoute = async ({ request }) => {
  const json = await request.json();

  const { messages } = json;

  if (messages.length) {
    const coreMessages = convertToCoreMessages(messages);

    const response = streamText({
      model: openai("gpt-4o"),
      messages: coreMessages,
    });
    return response.toDataStreamResponse();
  }

  return new Response(null, { status: 400 });
};
