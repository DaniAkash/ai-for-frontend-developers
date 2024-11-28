import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { z } from "zod";

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
      tools: {
        getWeather: {
          description: "Get the current weather at a location",
          parameters: z.object({
            latitude: z.number(),
            longitude: z.number(),
          }),
          execute: async ({ latitude, longitude }) => {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
            );

            const weatherData = await response.json();
            return weatherData;
          },
        },
        createCodeBlock: {
          description: "Create a code block",
          parameters: z.object({
            code: z.string(),
            language: z.string(),
          }),
          execute: async ({ code, language }) => {
            return { code, language };
          },
        },
      },
    });
    return response.toDataStreamResponse();
  }

  return new Response(null, { status: 400 });
};
