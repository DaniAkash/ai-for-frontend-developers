import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import { cn } from "../utils/cn";
import WeatherWidget from "./weather-widget";

export const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/ai",
    maxSteps: 3,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen min-h-96 w-screen overflow-clip bg-white text-zinc-600 shadow-md ring-1 ring-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 dark:ring-zinc-300/20">
      <div className="relative flex flex-1 flex-col items-stretch justify-between">
        <div className="flex h-full flex-col space-y-4 overflow-auto p-4 xl:space-y-2 xl:p-2">
          {messages.map((m, mIndex) => {
            const isUser = m.role === "user";
            const content = m.content.length > 0 ? m.content : "";
            const isLastMessage = mIndex === messages.length - 1;

            return (
              <div
                key={m.id}
                ref={isLastMessage ? messagesEndRef : undefined}
                className={cn(
                  "flex flex-col gap-4 whitespace-pre-wrap rounded-xl bg-zinc-50 p-4 shadow-sm xl:gap-2 xl:p-2 dark:bg-black",
                  isUser ? "items-end" : "items-start",
                )}
              >
                <div className="font-semibold">
                  {!isUser ? "🤖 daniakash.com" : "You"}
                </div>
                <p>
                  {content ? (
                    content
                  ) : (
                    <span className="font-light italic">
                      {"⏳ Retrieving Data..."}
                    </span>
                  )}
                </p>

                {m.toolInvocations && m.toolInvocations.length > 0 && (
                  <div>
                    {m.toolInvocations.map((toolInvocation) => {
                      const { toolName, toolCallId, state, args } =
                        toolInvocation;

                      if (toolName === "getWeather") {
                        if (state === "result") {
                          const weatherData = toolInvocation.result;
                          return <WeatherWidget weatherData={weatherData} />;
                        }

                        return (
                          <pre>
                            {JSON.stringify(
                              {
                                toolName,
                                toolCallId,
                                state,
                                args,
                              },
                              null,
                              2,
                            )}
                          </pre>
                        );
                      }
                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="flex w-full flex-row gap-4 p-4 xl:gap-2 xl:p-2">
            <input
              className="w-full flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-sm dark:border-zinc-700 dark:bg-zinc-700/[0.15] dark:text-zinc-200 dark:placeholder:text-zinc-500 dark:focus:border-teal-400 dark:focus:ring-teal-400/10"
              value={input}
              placeholder="Ask something..."
              onChange={handleInputChange}
            />
            <button
              className="inline-flex flex-none items-center justify-center gap-2 rounded-md bg-zinc-800 px-3 py-2 text-sm font-semibold text-zinc-100 outline-offset-2 transition hover:bg-zinc-700 active:bg-zinc-800 active:text-zinc-100/70 active:transition-none dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:active:bg-zinc-700 dark:active:text-zinc-100/70"
              type="submit"
            >
              Ask
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
