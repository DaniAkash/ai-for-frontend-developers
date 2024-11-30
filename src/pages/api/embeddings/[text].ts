import type { APIRoute } from "astro";
import { embedMany } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openai = createOpenAI({
  compatibility: "strict",
  apiKey: import.meta.env.OPENAI_API_KEY,
});

const embeddingModel = openai.embedding("text-embedding-ada-002");

export const GET: APIRoute = async ({ params }) => {
  const { text } = params;

  if (!text) {
    return new Response(null, { status: 400 });
  }

  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: [text] as string[],
  });

  return new Response(JSON.stringify({ embeddings }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
