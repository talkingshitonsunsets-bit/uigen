"use client";

import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className,
}: MarkdownRendererProps) {
  return (
    <div className={cn("prose leading-tight max-w-none", className)}>
      <ReactMarkdown
        components={{
          code: ({ children, className, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="not-prose text-[12px] px-1.5 py-0.5 rounded font-mono"
                  style={{
                    background: "rgba(139,92,246,0.15)",
                    color: "rgba(196,181,253,0.95)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                  {...props}
                >
                  {children}
                </code>
              );
            }
            return (
              <code className={cn("text-[12px]", className)} {...props}>
                {children}
              </code>
            );
          },
          p: ({ children, ...props }) => (
            <p className="mb-2 last:mb-0" {...props}>{children}</p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="my-2 space-y-1" {...props}>{children}</ul>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>{children}</li>
          ),
          strong: ({ children, ...props }) => (
            <strong className="font-semibold text-white/95" {...props}>{children}</strong>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
