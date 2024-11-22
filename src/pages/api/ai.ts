import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText, type Message } from "ai";
import { z } from "zod";

export const POST: APIRoute = async ({ request }) => {
  const openai = createOpenAI({
    compatibility: "strict",
    apiKey: import.meta.env.OPENAI_API_KEY,
  });
  const json = await request.json();

  const { messages } = json as { messages: Message[] };

  if (messages.length) {
    const coreMessages = convertToCoreMessages(messages);

    const response = streamText({
      model: openai("gpt-4o"),
      messages: coreMessages,
      maxSteps: 5,
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
      },
    });

    return response.toDataStreamResponse();
  }

  return new Response(null, { status: 400 });
};
