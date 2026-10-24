import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Producer-written text. Markdown is rendered without raw HTML. */
export function Story({ children }: { children: string }) {
  return (
    <div className="space-y-4 text-lg leading-relaxed [&_a]:underline [&_a]:underline-offset-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-6">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
