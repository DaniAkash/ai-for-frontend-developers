import { useState, useEffect } from "react";
import { createHighlighter } from "shiki";

async function getHighlightedCode(code: string, language: string) {
  const highlighter = await createHighlighter({
    themes: ["github-dark"],
    langs: [language],
  });

  const codeWithHighlight = highlighter.codeToHtml(code, {
    lang: language,
    theme: "github-dark",
  });

  return codeWithHighlight;
}

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const [highlightedCode, setHighlightedCode] = useState<string>("");

  useEffect(() => {
    getHighlightedCode(code, language).then(setHighlightedCode);
  }, [code, language]);

  return (
    <div className="relative overflow-hidden rounded-lg bg-gray-900">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2">
        <span className="text-sm font-medium text-gray-200">{language}</span>
        <button
          className="text-sm text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          onClick={() => navigator.clipboard.writeText(code)}
          aria-label="Copy code"
        >
          Copy
        </button>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="text-sm">
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className="language-{language}"
          />
        </pre>
      </div>
    </div>
  );
}
