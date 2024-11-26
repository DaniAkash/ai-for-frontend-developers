import type { APIRoute } from "astro";
import { createOpenAI } from "@ai-sdk/openai";
import {
  convertToCoreMessages,
  StreamData,
  streamText,
  type Message,
} from "ai";
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
      system: `You are a friendly assistant! Keep your responses concise and helpful.
      
      CodeBlock is a way to display code to the User. A codeblock will contain the language's name and the actual code. If your answer requires a code to be shown to the user, you can use the createCodeBlock tool. Do not include the code in any other responses outside of the createCodeBlock tool.
      
      This is a guide for using the codeblock tool: \`createCodeBlock\` which will lets user see a code block with syntax highlighting
      
      When to use the createCodeBlock tool:
      - When you want to display code to the user
      - When the answer requires a code to be shown to the user`,
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
